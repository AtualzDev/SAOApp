import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import DeleteConfirmModal from '../components/stock/DeleteConfirmModal';
import Toast from '../components/common/Toast';

interface Sector {
    id: string;
    nome: string;
    descricao?: string;
    deletado?: string;
    totalItens?: number;
}

interface SectorEditModalProps {
    sector: Sector | null;
    onClose: () => void;
    onSave: () => void;
}

const SectorEditModal: React.FC<SectorEditModalProps> = ({ sector, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sector) {
            setFormData({
                name: sector.nome || '',
                description: sector.descricao || ''
            });
        } else {
            setFormData({
                name: '',
                description: ''
            });
        }
    }, [sector]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Nome do setor é obrigatório');
            return;
        }

        try {
            setLoading(true);

            if (sector?.id) {
                await inventoryService.updateSector(sector.id, formData);
            } else {
                await inventoryService.createSector(formData);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar setor:', error);
            alert('Erro ao salvar setor: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Layers className="text-white" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {sector ? 'Editar Setor' : 'Novo Setor'}
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
                                Nome do Setor *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                placeholder="Ex: Alimentação"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Descrição
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                                placeholder="Descrição do setor..."
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
                            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SectorsPage: React.FC = () => {
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const itemsPerPage = 10;

    const [editModal, setEditModal] = useState<{ isOpen: boolean; sector: Sector | null }>({
        isOpen: false,
        sector: null
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; sector: Sector | null }>({
        isOpen: false,
        sector: null
    });

    useEffect(() => {
        loadSectors();
    }, []);

    const loadSectors = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.listSectors();
            // Filtrar apenas setores não deletados
            const activeSectors = data.filter((s: Sector) => s.deletado !== 'yes');
            setSectors(activeSectors);
        } catch (error) {
            console.error('Erro ao carregar setores:', error);
            setToast({ message: 'Erro ao carregar setores', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (sector: Sector) => {
        setEditModal({ isOpen: true, sector });
    };

    const handleNew = () => {
        setEditModal({ isOpen: true, sector: null });
    };

    const handleDeleteClick = (sector: Sector) => {
        setDeleteModal({ isOpen: true, sector });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.sector) return;

        try {
            // Soft delete - marca como deletado
            await inventoryService.deleteSector(deleteModal.sector.id);
            setDeleteModal({ isOpen: false, sector: null });
            setToast({ message: 'Setor excluído com sucesso!', type: 'success' });
            loadSectors();
        } catch (error) {
            console.error('Erro ao excluir setor:', error);
            setToast({ message: 'Erro ao excluir setor', type: 'error' });
        }
    };

    const handleSaveSuccess = () => {
        setToast({ message: 'Setor salvo com sucesso!', type: 'success' });
        loadSectors();
    };

    // Filtrar setores
    const filteredSectors = sectors.filter(s =>
        s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.descricao && s.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Paginação
    const totalPages = Math.ceil(filteredSectors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSectors = filteredSectors.slice(startIndex, endIndex);

    // Reset para página 1 quando filtrar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                        <Layers className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Setores de Estoque</h1>
                        <p className="text-sm text-slate-500">Gestão de locais físicos e capacidades</p>
                    </div>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30"
                >
                    <Plus size={18} />
                    Novo Setor
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-700">Lista de Setores</h2>
                        <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
                            {filteredSectors.length} {filteredSectors.length === 1 ? 'item' : 'itens'}
                        </span>
                    </div>

                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar setor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Produtos</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                                        Carregando setores...
                                    </td>
                                </tr>
                            ) : currentSectors.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                                        {searchTerm ? 'Nenhum setor encontrado com esse termo' : 'Nenhum setor cadastrado'}
                                    </td>
                                </tr>
                            ) : (
                                currentSectors.map((sector) => (
                                    <tr key={sector.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Layers size={16} className="text-blue-500" />
                                                <span className="text-sm font-bold text-slate-700">{sector.nome}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(sector.totalItens || 0) > 0
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {sector.totalItens || 0} itens
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {sector.descricao || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(sector)}
                                                    className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(sector)}
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

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredSectors.length)} de {filteredSectors.length} setores
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm font-medium text-slate-600">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {
                editModal.isOpen && (
                    <SectorEditModal
                        sector={editModal.sector}
                        onClose={() => setEditModal({ isOpen: false, sector: null })}
                        onSave={handleSaveSuccess}
                    />
                )
            }

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                productName={deleteModal.sector?.nome || ''}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModal({ isOpen: false, sector: null })}
            />

            {
                toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )
            }
        </div >
    );
};

export default SectorsPage;
