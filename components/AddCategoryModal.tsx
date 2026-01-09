
import React, { useState } from 'react';
import { X, LayoutGrid } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    description: ''
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
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Add Nova Categoria</h2>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-5">
          
          {/* Visual Placeholder for Category Icon/Color */}
          <div className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100/50 transition-all group">
            <LayoutGrid className="text-slate-300 group-hover:text-blue-400 transition-colors" size={32} />
            <span className="text-slate-400 font-bold text-sm">Personalizar Categoria</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome da categoria */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Nome da categoria</label>
              <input
                type="text"
                placeholder="Ex: Alimentação"
                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Setor Relacionado */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Setor Relacionado</label>
              <select
                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                value={formData.sector}
                onChange={(e) => setFormData({...formData, sector: e.target.value})}
              >
                <option value="">Selecione um setor</option>
                <option value="estoque">Estoque Geral</option>
                <option value="cozinha">Cozinha</option>
                <option value="escritorio">Escritório</option>
              </select>
            </div>
          </div>

          {/* Observação */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600">Descrição / Observação</label>
            <textarea
              placeholder="Descreva a finalidade desta categoria"
              rows={3}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 resize-none transition-all"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              Salvar Categoria
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
