import React, { useState, useEffect } from 'react';
import { X, LayoutGrid, Palette } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import Toast from '../common/Toast';

interface AddCategoryModalProps {
  isOpen: boolean;
  category?: any | null; // Categoria para edição (opcional)
  onClose: () => void;
  onSave: (data: any) => void;
}

const PRESET_COLORS = [
  { name: 'Laranja', value: '#F97316' },
  { name: 'Vermelho', value: '#EF4444' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Roxo', value: '#A855F7' },
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Ciano', value: '#06B6D4' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Amarelo', value: '#F59E0B' },
  { name: 'Cinza', value: '#6B7280' },
  { name: 'Índigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Lime', value: '#84CC16' },
];

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    description: '',
    color: '#3B82F6' // Cor padrão azul
  });

  const [sectors, setSectors] = useState<{ id: string; nome: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSectors();

      // Se está editando, carregar dados da categoria
      if (category) {
        setFormData({
          name: category.nome || '',
          sector: category.setor_id || '',
          description: category.descricao || '',
          color: category.cor || '#3B82F6'
        });
      } else {
        // Reset para nova categoria
        setFormData({
          name: '',
          sector: '',
          description: '',
          color: '#3B82F6'
        });
      }
    }
  }, [isOpen, category]);

  const loadSectors = async () => {
    try {
      const data = await inventoryService.listSectors();
      setSectors(data);
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
      setToast({ message: 'Erro ao carregar setores', type: 'error' });
    }
  };

  const handleSave = async () => {
    // Validação
    if (!formData.name.trim()) {
      setToast({ message: 'Nome da categoria é obrigatório', type: 'warning' });
      return;
    }

    if (!formData.sector) {
      setToast({ message: 'Selecione um setor', type: 'warning' });
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);

      // Reset form
      setFormData({
        name: '',
        sector: '',
        description: '',
        color: '#3B82F6'
      });

      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar categoria:', error);
      setToast({ message: error.message || 'Erro ao salvar categoria', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
          <h2 className="text-xl font-bold text-slate-800">{category ? 'Editar Categoria' : 'Nova Categoria'}</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-5">

          {/* Color Picker */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-slate-500" />
              <label className="text-sm font-bold text-slate-600">Cor da Categoria</label>
            </div>

            {/* Preview */}
            <div
              className="w-full h-20 rounded-2xl border-2 border-slate-200 flex items-center justify-center transition-all"
              style={{ backgroundColor: formData.color }}
            >
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <span className="text-sm font-bold text-slate-700">{formData.name || 'Prévia da Categoria'}</span>
              </div>
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`h-10 rounded-lg transition-all hover:scale-110 ${formData.color === color.value
                    ? 'ring-4 ring-blue-500 ring-offset-2 scale-110'
                    : 'hover:ring-2 hover:ring-slate-300'
                    }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-200"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#3B82F6"
                className="flex-1 h-12 px-4 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome da categoria */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Nome da categoria *</label>
              <input
                type="text"
                placeholder="Ex: Alimentação"
                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Setor Relacionado */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Setor Relacionado *</label>
              <select
                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              >
                <option value="">Selecione um setor</option>
                {sectors.map(sector => (
                  <option key={sector.id} value={sector.id}>{sector.nome}</option>
                ))}
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onClose}
              className="h-12 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="h-12 bg-[#2549D3] text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar Categoria'}
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AddCategoryModal;
