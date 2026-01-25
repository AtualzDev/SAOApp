import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    productName: string;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, productName, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
                {/* Header com gradiente verde */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                            <CheckCircle className="text-white" size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Produto Cadastrado!</h2>
                            <p className="text-emerald-100 text-sm font-medium">Operação realizada com sucesso</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="text-white" size={24} />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-slate-600 text-base leading-relaxed mb-3">
                            O produto foi adicionado ao catálogo com sucesso:
                        </p>
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-lg">
                            <p className="text-emerald-800 font-bold text-lg">{productName}</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">✓</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-blue-800 text-sm font-semibold mb-1">Próximos passos:</p>
                                <p className="text-blue-700 text-sm leading-relaxed">
                                    Você pode visualizar o produto na listagem ou adicionar um novo item ao estoque.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botão de ação */}
                    <button
                        onClick={onClose}
                        className="w-full px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-sm font-bold hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
