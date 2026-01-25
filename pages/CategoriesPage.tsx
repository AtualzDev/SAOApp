import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Pencil, Trash2, FolderOpen, Tag } from 'lucide-react';
import { inventoryService, Category } from '../../services/inventoryService';
import DeleteConfirmModal from './DeleteConfirmModal';

interface CategoryEditModalProps {
    category: Category | null;
    onClose: () => void;
    onSave: () => void;
}

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({ category, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        sector: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.nome || '',
                sector: category.setor || '',
                description: category.descricao || ''
            });
        }
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Nome da categoria é obrigatório');
            return;
        }

        try {
            setLoading(true);

            if (category?.id) {
                await inventoryService.updateCategory(category.id, formData);
            } else {
                await inventoryService.createCategory(formData);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
            alert('Erro ao salvar categoria: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (!category && category !== null) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <FolderOpen className="text-white" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {category ? 'Editar Categoria' : 'Nova Categoria'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <span className="text-white text-2xl">×</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Nome da Categoria *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                placeholder="Ex: Alimentos"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Setor
                            </label>
                            <select
                                value={formData.sector}
                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                            >
                                <option value="">Selecione...</option>
                                <option value="Alimentação">Alimentação</option>
                                <option value="Limpeza">Limpeza</option>
                                <option value="Escritório">Escritório</option>
                                <option value="Higiene">Higiene</option>
                                <option value="Vestuário">Vestuário</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Descrição
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                                placeholder="Descrição da categoria..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-5 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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

    const filteredCategories = categories.filter(c =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.setor && c.setor.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Setor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        Carregando categorias...
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
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
                                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                {category.setor || '-'}
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
                <CategoryEditModal
                    category={editModal.category}
                    onClose={() => setEditModal({ isOpen: false, category: null })}
                    onSave={loadCategories}
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
