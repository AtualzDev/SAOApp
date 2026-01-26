import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteBasketModalProps {
    isOpen: boolean;
    basketName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

const DeleteBasketModal: React.FC<DeleteBasketModalProps> = ({
    isOpen,
    basketName,
    onConfirm,
    onCancel,
    isDeleting = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                {/* Header com gradiente vermelho */}
                <div className="bg-gradient-to-r from-rose-500 to-red-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                            <AlertTriangle className="text-white" size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">Excluir Cesta</h2>
                            <p className="text-rose-100 text-xs font-medium">Ação irreversível de arquivamento</p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="text-white" size={20} />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                    <div className="mb-6 text-center">
                        <p className="text-slate-600 text-sm mb-3">
                            Tem certeza que deseja excluir a cesta:
                        </p>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl inline-block w-full">
                            <p className="text-slate-800 font-black text-lg">{basketName}</p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex gap-3">
                        <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                        <p className="text-amber-700 text-xs leading-relaxed">
                            A cesta será removida da lista. O histórico de doações realizadas com esta cesta <strong>não será afetado</strong>.
                        </p>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="flex-1 px-5 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-5 py-3 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-70 flex justify-center"
                        >
                            {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteBasketModal;
