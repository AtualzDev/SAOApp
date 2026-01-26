import React, { useState, useEffect } from 'react';
import { Plus, Search, ShoppingBasket, Pencil, Trash2 } from 'lucide-react';
import { basketService, Basket } from '../../../services/basketService';
import BasketFormModal from '../modals/BasketFormModal';
import DeleteBasketModal from '../modals/DeleteBasketModal';

const BasketsTab: React.FC = () => {
    const [baskets, setBaskets] = useState<Basket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBasket, setSelectedBasket] = useState<Basket | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [basketToDelete, setBasketToDelete] = useState<Basket | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadBaskets();
    }, []);

    const loadBaskets = async () => {
        try {
            setLoading(true);
            const data = await basketService.listBaskets();
            setBaskets(data);
        } catch (error) {
            console.error('Error loading baskets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedBasket(null);
        setIsModalOpen(true);
    };

    const handleEdit = (basket: Basket) => {
        setSelectedBasket(basket);
        setIsModalOpen(true);
    };

    const confirmDelete = (basket: Basket) => {
        setBasketToDelete(basket);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!basketToDelete) return;
        try {
            setIsDeleting(true);
            await basketService.deleteBasket(basketToDelete.id);
            setBasketToDelete(null);
            setIsDeleteModalOpen(false);
            loadBaskets();
        } catch (error) {
            alert('Erro ao excluir cesta: ' + error);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredBaskets = baskets.filter(b =>
        b.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Cestas Básicas</h2>
                    <p className="text-sm text-slate-400 font-medium">Gerencie as composições de cestas para doação</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar cesta..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 outline-none transition-all w-64 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Plus size={18} /> Nova Cesta
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Carregando cestas...</div>
                ) : filteredBaskets.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBasket size={32} className="opacity-50" />
                        </div>
                        <p className="font-bold text-slate-600">Nenhuma cesta encontrada</p>
                        <p className="text-sm mt-1">Crie sua primeira cesta clicando no botão acima.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nome da Cesta</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Itens</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredBaskets.map(basket => (
                                <tr key={basket.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <ShoppingBasket size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700">{basket.nome}</p>
                                                <p className="text-xs text-slate-400 truncate max-w-[200px]">{basket.descricao || 'Sem descrição'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                                            {basket.itens_count || 0} Itens
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(basket)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(basket)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Excluir"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <BasketFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadBaskets}
                basketToEdit={selectedBasket}
            />

            <DeleteBasketModal
                isOpen={isDeleteModalOpen}
                basketName={basketToDelete?.nome || ''}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default BasketsTab;
