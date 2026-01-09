
import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddUnitModal: React.FC<AddUnitModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    observation: ''
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay mais escuro para o segundo modal */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Add Nova Unidade</h2>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-8 pb-8 space-y-5">
          
          {/* Add Logo Area */}
          <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100/50 transition-all group">
            <span className="text-slate-300 font-bold text-lg group-hover:text-slate-400 transition-colors">Add Logo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome da unidade */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Nome da unidade</label>
              <input
                type="text"
                placeholder="Nome da unidade"
                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Localização Geográfica */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Localização Geográfica</label>
              <input
                type="text"
                placeholder="Localização geográfica"
                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          {/* Observação */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600">Observação</label>
            <textarea
              placeholder="Observações"
              rows={3}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 resize-none transition-all"
              value={formData.observation}
              onChange={(e) => setFormData({...formData, observation: e.target.value})}
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

export default AddUnitModal;
