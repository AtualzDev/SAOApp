import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessFeedbackModalProps {
    isOpen: boolean;
    title?: string;
    subtitle?: string;
    message: string;
    highlightText?: string;
    onClose: () => void;
}

const SuccessFeedbackModal: React.FC<SuccessFeedbackModalProps> = ({
    isOpen,
    title = 'Operação Realizada!',
    subtitle = 'Sucesso',
    message,
    highlightText,
    onClose
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
                {/* Header com gradiente verde */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                            <CheckCircle className="text-white" size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
                            <p className="text-emerald-100 text-xs font-medium">{subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="text-white" size={20} />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                    <div className="mb-6 text-center">
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                            {message}
                        </p>
                        {highlightText && (
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl inline-block w-full">
                                <p className="text-emerald-800 font-black text-lg">{highlightText}</p>
                            </div>
                        )}
                    </div>

                    {/* Botão de ação */}
                    <button
                        onClick={onClose}
                        className="w-full px-5 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessFeedbackModal;
