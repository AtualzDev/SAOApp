
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddSimpleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
    title: string;
    label: string;
}

const AddSimpleModal: React.FC<AddSimpleModalProps> = ({ isOpen, onClose, onSave, title, label }) => {
    const [value, setValue] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700">{title}</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
                        <input
                            autoFocus
                            type="text"
                            className="w-full mt-1 h-10 px-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            if (value.trim()) {
                                onSave(value);
                                setValue('');
                                onClose();
                            }
                        }}
                        className="w-full h-10 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSimpleModal;
