import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    productName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    productName,
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                {/* Header com gradiente vermelho */}
                <div className="bg-gradient-to-r from-rose-500 to-red-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                            <AlertTriangle className="text-white" size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Confirmar Exclusão</h2>
                            <p className="text-rose-100 text-sm font-medium">Esta ação pode ser revertida</p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="text-white" size={24} />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-slate-600 text-base leading-relaxed mb-3">
                            Tem certeza que deseja excluir o produto:
                        </p>
                        <div className="bg-slate-50 border-l-4 border-rose-500 p-4 rounded-lg">
                            <p className="text-slate-800 font-bold text-lg">{productName}</p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <div className="flex gap-3">
                            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="text-amber-800 text-sm font-semibold mb-1">Importante:</p>
                                <p className="text-amber-700 text-sm leading-relaxed">
                                    O produto será ocultado da listagem, mas seus dados serão preservados no sistema.
                                    Você poderá restaurá-lo posteriormente se necessário.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-5 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-5 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl text-sm font-bold hover:from-rose-600 hover:to-red-700 transition-all shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40"
                        >
                            Sim, Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
