
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

    // --- Sectors (Setores) ---
    async listSectors(req, res) {
        try {
            const { data, error } = await supabase
                .from('setores')
                .select('*')
                .eq('deletado', false)
                .order('nome');
            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createSector(req, res) {
        const { name, description } = req.body;
        try {
            const { data, error } = await supabase
                .from('setores')
                .insert([{
                    nome: name,
                    descricao: description,
                    deletado: 'no'
                }])
                .select();
            if (error) throw error;
            res.status(201).json(data[0]);
        } catch (error) {
            console.error('Error creating sector:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async updateSector(req, res) {
        const { id } = req.params;
        const { name, description } = req.body;

        try {
            const updateData = {};
            if (name !== undefined) updateData.nome = name;
            if (description !== undefined) updateData.descricao = description;

            const { data, error } = await supabase
                .from('setores')
                .update(updateData)
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Sector not found' });
            }

            res.json(data[0]);
        } catch (error) {
            console.error('Error updating sector:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async deleteSector(req, res) {
        const { id } = req.params;

        try {
            // Soft delete
            const { data, error } = await supabase
                .from('setores')
                .update({ deletado: true })
                .eq('id', id)
                .select();

            if (error) throw error;

            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Sector not found' });
            }

            res.status(200).json({ message: 'Sector deleted successfully' });
        } catch (error) {
            console.error('Error deleting sector:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // --- Categories ---
    async listCategories(req, res) {
        try {
            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .eq('deletado', false)
                .order('nome');
            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createCategory(req, res) {
        const { name, sector, description } = req.body;
        try {
            const { data, error } = await supabase
                .from('categorias')
                .insert([{
                    nome: name,
                    setor: sector,
                    descricao: description,
                    deletado: 'no'
                }])
                .select();
            if (error) throw error;
            res.status(201).json(data[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateCategory(req, res) {
        const { id } = req.params;
        const { name, sector, description } = req.body;

        try {
            const updateData = {};
            if (name !== undefined) updateData.nome = name;
            if (sector !== undefined) updateData.setor = sector;
            if (description !== undefined) updateData.descricao = description;

            const { data, error } = await supabase
                .from('categorias')
                .update(updateData)
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json(data[0]);
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async deleteCategory(req, res) {
        const { id } = req.params;

        try {
            // Soft delete
            const { data, error } = await supabase
                .from('categorias')
                .update({ deletado: true })
                .eq('id', id)
                .select();

            if (error) throw error;

            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Error deleting category:', error);
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
            // Fetch products (only non-deleted ones)
            const { data: products, error: productsError } = await supabase
                .from('produtos')
                .select('*')
                .eq('deletado', false)  // Only show non-deleted products
                .order('nome', { ascending: true });

            if (productsError) throw productsError;

            // Fetch categories
            const { data: categories, error: categoriesError } = await supabase
                .from('categorias')
                .select('*');

            if (categoriesError) throw categoriesError;

            // Create a map of categories for quick lookup
            const categoryMap = {};
            if (categories) {
                categories.forEach(cat => {
                    categoryMap[cat.id] = cat;
                });
            }

            // Transform data to include categoria_nome at root level for easier access
            const transformedData = products.map(product => {
                const category = product.categoria ? categoryMap[product.categoria] : null;
                return {
                    ...product,
                    categoria_nome: category?.nome || null,
                    categoria_setor: category?.setor || null
                };
            });

            res.json(transformedData);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async createProduct(req, res) {
        const { nome, descricao, categoria, setor, unidade_medida, estoque_inicial, estoque_minimo, valor_referencia, codigo } = req.body;
        try {
            const { data, error } = await supabase
                .from('produtos')
                .insert([{
                    nome,
                    descricao,
                    categoria,
                    setor,
                    unidade_medida,
                    estoque_minimo,
                    estoque_atual: estoque_inicial || 0,  // Estoque atual inicia com o valor do estoque inicial
                    valor_referencia: valor_referencia || 0,
                    codigo
                }])
                .select();

            if (error) throw error;
            console.log('Product created:', data[0]);
            res.status(201).json(data[0]);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async updateProduct(req, res) {
        const { id } = req.params;
        const { nome, descricao, categoria_id, categoria, setor, unidade_medida, estoque_minimo, valor_referencia, codigo } = req.body;

        console.log('=== UPDATE PRODUCT ===');
        console.log('ID:', id);
        console.log('Body:', req.body);

        try {
            const updateData = {};
            if (nome !== undefined) updateData.nome = nome;
            if (descricao !== undefined) updateData.descricao = descricao;
            // Use categoria_id se fornecido, senão use categoria
            if (categoria_id !== undefined) updateData.categoria = categoria_id;
            else if (categoria !== undefined) updateData.categoria = categoria;
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
            // Soft delete: marca o produto como deletado ao invés de excluir permanentemente
            const { data, error } = await supabase
                .from('produtos')
                .update({ deletado: true })
                .eq('id', id)
                .select();

            if (error) throw error;

            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            console.log('Product soft deleted:', data[0]);
            res.status(200).json({ message: 'Product deleted successfully', product: data[0] });
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
