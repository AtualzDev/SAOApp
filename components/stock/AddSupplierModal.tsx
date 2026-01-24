
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        cnpj: '',
        observation: ''
    });

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Add Novo Fornecedor</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="px-8 pb-8 space-y-5">

                    <div className="grid grid-cols-1 gap-4">
                        {/* Nome do Fornecedor */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-600">Nome do Fornecedor</label>
                            <input
                                type="text"
                                placeholder="Ex: Supermercado BH"
                                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* CNPJ/CPF */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-600">CNPJ / CPF (Opcional)</label>
                            <input
                                type="text"
                                placeholder="00.000.000/0000-00"
                                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                                value={formData.cnpj}
                                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Observação */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-600">Descrição / Observação</label>
                        <textarea
                            placeholder="Observações adicionais"
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 resize-none transition-all"
                            value={formData.observation}
                            onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="h-12 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="h-12 bg-[#2549D3] text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSupplierModal;
