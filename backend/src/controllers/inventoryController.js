
const supabase = require('../config/supabaseClient');

const inventoryController = {
    // --- Units (Instituições) ---
    async listUnits(req, res) {
        try {
            const { data, error } = await supabase.from('unidades').select('*').order('nome');
            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createUnit(req, res) {
        const { name, observation } = req.body;
        try {
            const { data, error } = await supabase
                .from('unidades')
                .insert([{
                    nome: name,
                    descricao: observation
                }])
                .select();
            if (error) throw error;
            res.status(201).json(data[0]);
        } catch (error) {
            console.error("Create Unit Error:", error);
            res.status(500).json({ error: error.message, details: error });
        }
    },

    // --- Categories ---
    async listCategories(req, res) {
        try {
            const { data, error } = await supabase.from('categorias').select('*').order('nome');
            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createCategory(req, res) {
        const { name, sector, description } = req.body;
        try {
            const { data, error } = await supabase.from('categorias').insert([{ nome: name, setor: sector, descricao: description }]).select();
            if (error) throw error;
            res.status(201).json(data[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // --- Suppliers (Fornecedores) ---
    async listSuppliers(req, res) {
        try {
            const { data, error } = await supabase.from('fornecedores').select('*').order('nome');
            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createSupplier(req, res) {
        const { name, cnpj, observation } = req.body;
        try {
            const { data, error } = await supabase
                .from('fornecedores')
                .insert([{
                    nome: name,
                    cnpj_cpf: cnpj,
                    observacao: observation
                }])
                .select();
            if (error) throw error;
            res.status(201).json(data[0]);
        } catch (error) {
            console.error("Create Supplier Error Full Object:", JSON.stringify(error, null, 2));
            res.status(500).json({ error: error.message || "Unknown db error", details: error });
        }
    },

    // --- Products (Catalog) ---

    async listProducts(req, res) {
        try {
            const { data, error } = await supabase
                .from('produtos')
                .select('*')
                .order('nome', { ascending: true });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async createProduct(req, res) {
        const { nome, descricao, categoria, unidade_medida, estoque_minimo, codigo } = req.body;
        try {
            const { data, error } = await supabase
                .from('produtos')
                .insert([{ nome, descricao, categoria, unidade_medida, estoque_minimo, codigo, estoque_atual: 0 }])
                .select();

            if (error) throw error;
            res.status(201).json(data[0]);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async updateProduct(req, res) {
        const { id } = req.params;
        const { nome, descricao, categoria_id, setor, unidade_medida, estoque_minimo, valor_referencia, codigo } = req.body;

        console.log('=== UPDATE PRODUCT ===');
        console.log('ID:', id);
        console.log('Body:', req.body);

        try {
            const updateData = {};
            if (nome !== undefined) updateData.nome = nome;
            if (descricao !== undefined) updateData.descricao = descricao;
            if (categoria_id !== undefined) updateData.categoria_id = categoria_id;
            if (setor !== undefined) updateData.setor = setor;
            if (unidade_medida !== undefined) updateData.unidade_medida = unidade_medida;
            if (estoque_minimo !== undefined) updateData.estoque_minimo = estoque_minimo;
            if (valor_referencia !== undefined) updateData.valor_referencia = valor_referencia;
            if (codigo !== undefined) updateData.codigo = codigo;

            console.log('Update Data:', updateData);

            const { data, error } = await supabase
                .from('produtos')
                .update(updateData)
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            console.log('Product updated successfully:', data[0]);
            res.json(data[0]);
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async deleteProduct(req, res) {
        const { id } = req.params;

        try {
            // Verifica se o produto tem lançamentos associados
            const { data: launches, error: launchError } = await supabase
                .from('lancamentos_itens')
                .select('id')
                .eq('produto_id', id)
                .limit(1);

            if (launchError) throw launchError;

            if (launches && launches.length > 0) {
                return res.status(400).json({
                    error: 'Não é possível excluir produto com lançamentos associados'
                });
            }

            const { error } = await supabase
                .from('produtos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // --- Launches (Header + Items) ---

    async createLaunch(req, res) {
        const { type, status, emissionDate, receptionDate, provider, unit, noteNumber, notes, items } = req.body;

        // Basic validation
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Launch must have at least one item' });
        }

        try {
            // 1. Create Header
            const headerData = {
                tipo: type,
                status,
                data_recebimento: receptionDate || null,
                fornecedor: provider,
                instituicao_beneficiada: unit,
                observacoes: notes,
                data_emissao: (status === 'Com nota' ? emissionDate : null),
                numero_nota: (status === 'Com nota' ? noteNumber : null),
                valor_total: items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0)
            };

            const { data: launchData, error: launchError } = await supabase
                .from('lancamentos')
                .insert([headerData])
                .select()
                .single();

            if (launchError) throw launchError;

            const launchId = launchData.id;

            // 2. Create Items & Update Stock
            const preparedItems = items.map(item => ({
                lancamento_id: launchId,
                produto_id: item.productId,
                quantidade: Number(item.quantity),
                valor_unitario: Number(item.unitPrice),
                validade: item.validity || null,
                setor: item.sector || null,         // New fields
                categoria: item.category || null,   // New fields
                unidade_medida: item.unit || null   // New fields
            }));

            const { error: itemsError } = await supabase
                .from('lancamentos_itens')
                .insert(preparedItems);

            if (itemsError) {
                console.error('Error creating items, might need to rollback header:', itemsError);
                throw itemsError;
            }

            // 3. Update Stock for each item
            for (const item of items) {
                // Fetch current
                const { data: prod } = await supabase.from('produtos').select('estoque_atual').eq('id', item.productId).single();
                if (prod) {
                    let newStock = prod.estoque_atual;
                    if (type === 'Doação' || type === 'Compra') { // Entradas
                        newStock += Number(item.quantity);
                    }

                    await supabase.from('produtos').update({ estoque_atual: newStock }).eq('id', item.productId);
                }
            }

            res.status(201).json({ message: 'Launch created successfully', id: launchId });

        } catch (error) {
            console.error('Error processing launch:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async updateLaunch(req, res) {
        const { id } = req.params;
        const { type, status, emissionDate, receptionDate, provider, unit, noteNumber, notes, items } = req.body;

        try {
            // 1. Fetch old header & items for stock reversion
            const { data: oldHeader } = await supabase.from('lancamentos').select('tipo').eq('id', id).single();
            if (!oldHeader) return res.status(404).json({ error: 'Launch not found' });

            const { data: oldItems } = await supabase.from('lancamentos_itens').select('*').eq('lancamento_id', id);

            // 2. Revert Stock (Undo previous operation)
            if (oldItems) {
                for (const oldItem of oldItems) {
                    if (oldItem.produto_id) {
                        const { data: prod } = await supabase.from('produtos').select('estoque_atual').eq('id', oldItem.produto_id).single();
                        if (prod) {
                            let revertStock = prod.estoque_atual;
                            // If it was input, subtract. If output, add.
                            if (oldHeader.tipo === 'Doação' || oldHeader.tipo === 'Compra' || oldHeader.tipo === 'Entrada') {
                                revertStock -= oldItem.quantidade;
                            } else {
                                revertStock += oldItem.quantidade;
                            }
                            await supabase.from('produtos').update({ estoque_atual: revertStock }).eq('id', oldItem.produto_id);
                        }
                    }
                }
            }

            // 3. Update Header
            const headerData = {
                tipo: type,
                status,
                data_recebimento: receptionDate || null,
                fornecedor: provider,
                instituicao_beneficiada: unit,
                observacoes: notes,
                data_emissao: (status === 'Com nota' ? emissionDate : null),
                numero_nota: (status === 'Com nota' ? noteNumber : null),
                valor_total: items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0)
            };

            const { error: updateError } = await supabase.from('lancamentos').update(headerData).eq('id', id);
            if (updateError) throw updateError;

            // 4. Delete Old Items
            await supabase.from('lancamentos_itens').delete().eq('lancamento_id', id);

            // 5. Insert New Items
            const preparedItems = items.map(item => ({
                lancamento_id: id,
                produto_id: item.productId || null,
                quantidade: Number(item.quantity),
                valor_unitario: Number(item.unitPrice),
                validade: item.validity || null,
                setor: item.sector || null,
                categoria: item.category || null,
                unidade_medida: item.unit || null
            }));

            const { error: itemsError } = await supabase.from('lancamentos_itens').insert(preparedItems);
            if (itemsError) throw itemsError;

            // 6. Apply New Stock
            for (const item of items) {
                if (item.productId) {
                    const { data: prod } = await supabase.from('produtos').select('estoque_atual').eq('id', item.productId).single();
                    if (prod) {
                        let newStock = prod.estoque_atual;
                        if (type === 'Doação' || type === 'Compra' || type === 'Entrada') {
                            newStock += Number(item.quantity);
                        } else {
                            newStock -= Number(item.quantity);
                        }
                        await supabase.from('produtos').update({ estoque_atual: newStock }).eq('id', item.productId);
                    }
                }
            }

            res.json({ message: 'Launch updated successfully' });

        } catch (error) {
            console.error('Error updating launch:', error);
            res.status(500).json({ error: error.message });
        }
    },
    async listTransactions(req, res) {
        try {
            const { data, error } = await supabase
                .from('lancamentos')
                .select('*, items:lancamentos_itens(*, produto:produtos(nome))')
                .order('created_at', { ascending: false });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            console.error("List transactions error:", error);
            res.status(500).json({ error: error.message });
        }
    }

};

module.exports = inventoryController;
