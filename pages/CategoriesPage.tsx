import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Pencil, Trash2, FolderOpen, Tag } from 'lucide-react';
import { inventoryService, Category } from '../services/inventoryService';
import DeleteConfirmModal from '../components/stock/DeleteConfirmModal';
import AddCategoryModal from '../components/stock/AddCategoryModal';

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editModal, setEditModal] = useState<{ isOpen: boolean; category: Category | null }>({
        isOpen: false,
        category: null
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; category: Category | null }>({
        isOpen: false,
        category: null
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.listCategories();
            setCategories(data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            alert('Erro ao carregar categorias');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditModal({ isOpen: true, category });
    };

    const handleNew = () => {
        setEditModal({ isOpen: true, category: null });
    };

    const handleDeleteClick = (category: Category) => {
        setDeleteModal({ isOpen: true, category });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.category) return;

        try {
            await inventoryService.deleteCategory(deleteModal.category.id);
            setDeleteModal({ isOpen: false, category: null });
            loadCategories();
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            alert('Erro ao excluir categoria');
        }
    };

    const handleSaveCategory = async (data: any) => {
        try {
            if (editModal.category?.id) {
                // Editar categoria existente
                await inventoryService.updateCategory(editModal.category.id, data);
            } else {
                // Criar nova categoria
                await inventoryService.createCategory(data);
            }

            // Recarregar lista
            await loadCategories();
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao salvar categoria');
        }
    };

    const filteredCategories = categories.filter(c =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.setor_id && c.setor_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                        <FolderOpen className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Categorias</h1>
                        <p className="text-sm text-slate-500">Gerencie as categorias de produtos</p>
                    </div>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
                >
                    <Plus size={18} />
                    Nova Categoria
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-700">Lista de Categorias</h2>
                        <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
                            {filteredCategories.length} itens
                        </span>
                    </div>

                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Cor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Setor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        Carregando categorias...
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        Nenhuma categoria encontrada
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Tag size={16} className="text-indigo-500" />
                                                <span className="text-sm font-bold text-slate-700">{category.nome}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className="w-8 h-8 rounded-lg border-2 border-slate-200"
                                                style={{ backgroundColor: (category as any).cor || '#3B82F6' }}
                                                title={(category as any).cor || '#3B82F6'}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                {category.setor_id || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {category.descricao || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(category)}
                                                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editModal.isOpen && (
                <AddCategoryModal
                    isOpen={editModal.isOpen}
                    category={editModal.category}
                    onClose={() => setEditModal({ isOpen: false, category: null })}
                    onSave={handleSaveCategory}
                />
            )}

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                productName={deleteModal.category?.nome || ''}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModal({ isOpen: false, category: null })}
            />
        </div>
    );
};

export default CategoriesPage;
