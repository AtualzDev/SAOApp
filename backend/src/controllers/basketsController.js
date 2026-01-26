const supabase = require('../config/supabaseClient');

const basketsController = {
    // --- CRUD Operations ---

    // List all active baskets
    async listBaskets(req, res) {
        try {
            // Get baskets that are not deleted
            const { data: baskets, error } = await supabase
                .from('cestas')
                .select('*')
                .eq('deletado', false)
                .order('nome');

            if (error) throw error;

            // Enrich with item count (could be optimized with a view or join, but loop is fine for small scale)
            const enrichedBaskets = await Promise.all(baskets.map(async (basket) => {
                const { count, error: countError } = await supabase
                    .from('cestas_itens')
                    .select('*', { count: 'exact', head: true })
                    .eq('cesta_id', basket.id);

                if (countError) console.error('Error counting items for basket:', basket.id, countError);

                return {
                    ...basket,
                    itens_count: count || 0
                };
            }));

            res.json(enrichedBaskets);
        } catch (error) {
            console.error('Error listing baskets:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Get specific basket with items
    async getBasket(req, res) {
        const { id } = req.params;
        try {
            const { data, error } = await supabase
                .from('cestas')
                .select('*, items:cestas_itens(*, produto:produtos(id, nome, codigo, unidade_medida))')
                .eq('id', id)
                .single();

            if (error) throw error;
            res.json(data);
        } catch (error) {
            console.error('Error fetching basket:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Create new basket
    async createBasket(req, res) {
        const { name, description, items } = req.body; // items: [{ productId, quantity }]

        if (!name) return res.status(400).json({ error: 'Name is required' });
        if (!items || items.length === 0) return res.status(400).json({ error: 'At least one item is required' });

        try {
            // 1. Create Basket Header
            const { data: basket, error: basketError } = await supabase
                .from('cestas')
                .insert([{ nome: name, descricao: description }])
                .select()
                .single();

            if (basketError) throw basketError;

            // 2. Create Items
            const preparedItems = items.map(item => ({
                cesta_id: basket.id,
                produto_id: item.productId,
                quantidade: item.quantity
            }));

            const { error: itemsError } = await supabase
                .from('cestas_itens')
                .insert(preparedItems);

            if (itemsError) throw itemsError;

            res.status(201).json(basket);
        } catch (error) {
            console.error('Error creating basket:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Update basket
    async updateBasket(req, res) {
        const { id } = req.params;
        const { name, description, items } = req.body;

        try {
            // 1. Update Header
            const { error: updateError } = await supabase
                .from('cestas')
                .update({ nome: name, descricao: description })
                .eq('id', id);

            if (updateError) throw updateError;

            // 2. Update Items (Delete all and recreate - simplest strategy)
            if (items) {
                // Delete old
                await supabase.from('cestas_itens').delete().eq('cesta_id', id);

                // Insert new
                const preparedItems = items.map(item => ({
                    cesta_id: id,
                    produto_id: item.productId,
                    quantidade: item.quantity
                }));

                const { error: itemsError } = await supabase
                    .from('cestas_itens')
                    .insert(preparedItems);

                if (itemsError) throw itemsError;
            }

            res.json({ message: 'Basket updated successfully' });
        } catch (error) {
            console.error('Error updating basket:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Soft delete basket
    async deleteBasket(req, res) {
        const { id } = req.params;
        try {
            const { error } = await supabase
                .from('cestas')
                .update({ deletado: true })
                .eq('id', id);

            if (error) throw error;
            res.json({ message: 'Basket deleted successfully' });
        } catch (error) {
            console.error('Error deleting basket:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // --- Action: Donate Basket ---
    async donateBasket(req, res) {
        const { id } = req.params; // Basket ID
        const { beneficiary, notes, date } = req.body;

        try {
            // 1. Get Basket Details with Items
            const { data: basket, error: basketError } = await supabase
                .from('cestas')
                .select('*, items:cestas_itens(produto_id, quantity:quantidade, produto:produtos(unidade_medida))')
                .eq('id', id)
                .single();

            if (basketError || !basket) throw new Error('Basket not found');

            // 2. Create Stock Exit (Saída)
            const exitHeader = {
                tipo: 'Doação',
                status: 'Concluído',
                data_saida: date || new Date(),
                solicitante_ou_assistido: beneficiary || 'Anônimo',
                destino_local: 'Doação de Cesta',
                observacoes: `Cesta Entregue: ${basket.nome}. ${notes || ''}`
            };

            const { data: exitData, error: exitError } = await supabase
                .from('saidas_estoque')
                .insert([exitHeader])
                .select()
                .single();

            if (exitError) throw exitError;

            // 3. Prepare Exit Items (from Basket Items)
            const exitItems = basket.items.map(item => ({
                saida_id: exitData.id,
                produto_id: item.produto_id,
                quantidade: item.quantity,
                unidade_medida: item.produto?.unidade_medida
            }));

            // 4. Insert Exit Items
            const { error: itemsError } = await supabase
                .from('saidas_estoque_itens')
                .insert(exitItems);

            if (itemsError) throw itemsError;

            // 5. Update Stock (Subtract)
            for (const item of exitItems) {
                const { data: prod } = await supabase.from('produtos').select('estoque_atual').eq('id', item.produto_id).single();
                if (prod) {
                    const newStock = prod.estoque_atual - Number(item.quantidade);
                    await supabase.from('produtos').update({ estoque_atual: newStock }).eq('id', item.produto_id);
                }
            }

            res.status(201).json({ message: 'Basket donation processed successfully', exitId: exitData.id });

        } catch (error) {
            console.error('Error processing donation:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = basketsController;
