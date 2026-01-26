import React, { useState, useEffect } from 'react';
import { X, Search, Package, User, Calendar, CheckCircle2 } from 'lucide-react';
import { basketService, Basket } from '../../services/basketService';

interface DonateBasketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const DonateBasketModal: React.FC<DonateBasketModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [baskets, setBaskets] = useState<Basket[]>([]);
    const [selectedBasketId, setSelectedBasketId] = useState('');
    const [beneficiary, setBeneficiary] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadBaskets();
            setBeneficiary('');
            setNotes('');
            setSelectedBasketId('');
        }
    }, [isOpen]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBasketId) return alert('Selecione uma cesta');
        if (!beneficiary) return alert('Informe o beneficiário');

        try {
            setSubmitting(true);
            await basketService.donateBasket(selectedBasketId, {
                beneficiary,
                notes: notes || undefined
            });
            alert('Doação registrada com sucesso!');
            onSuccess();
            onClose();
        } catch (error: any) {
            alert('Erro ao registrar doação: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const selectedBasket = baskets.find(b => b.id === selectedBasketId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col">

                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Package size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Doar Cesta</h2>
                            <p className="text-sm text-slate-400 font-medium">Registrar saída de estoque para doação.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Selecione a Cesta</label>
                        <select
                            value={selectedBasketId}
                            onChange={e => setSelectedBasketId(e.target.value)}
                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 transition-all cursor-pointer"
                            disabled={loading}
                        >
                            <option value="">Selecione...</option>
                            {baskets.map(b => (
                                <option key={b.id} value={b.id}>{b.nome} ({b.itens_count} itens)</option>
                            ))}
                        </select>
                        {selectedBasket && (
                            <p className="text-xs text-slate-500 mt-1 pl-1">{selectedBasket.descricao}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Beneficiário (Solicitante/Assistido)</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={beneficiary}
                                onChange={e => setBeneficiary(e.target.value)}
                                placeholder="Nome da pessoa ou família"
                                className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Observações (Opcional)</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Motivo, detalhes adicionais..."
                            rows={3}
                            className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 transition-all resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? 'Registrando...' : 'Confirmar Doação'}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default DonateBasketModal;
