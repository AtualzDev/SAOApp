
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Save, X, Palette, HelpCircle, Box } from 'lucide-react';
import { inventoryService, Category } from '../../services/inventoryService';

interface CategoryFormProps {
  onCancel: () => void;
  initialData?: Category;
  onSuccess?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onCancel, initialData, onSuccess }) => {
  const [selectedColor, setSelectedColor] = useState('bg-indigo-500');
  const [loading, setLoading] = useState(false);
  const [sectors, setSectors] = useState<{ id: string, nome: string }[]>([]);

  const [formData, setFormData] = useState({
    nome: '',
    setor_id: '',
    descricao: '',
    cor: '#3B82F6' // Cor padrão
  });

  const colors = [
    '#F59E0B', '#F97316', '#EF4444', '#EC4899',
    '#6366F1', '#3B82F6', '#06B6D4', '#10B981'
  ];

  useEffect(() => {
    loadSectors();
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        setor_id: initialData.setor_id || '',
        descricao: initialData.descricao || '',
        cor: (initialData as any).cor || '#3B82F6'
      });
      // Atualizar cor selecionada se tiver
      if ((initialData as any).cor) {
        setSelectedColor((initialData as any).cor);
      }
    }
  }, [initialData]);

  const loadSectors = async () => {
    try {
      // Assume que createSector retorna {id, nome}
      const data = await inventoryService.listSectors();
      setSectors(data);
    } catch (error) {
      console.error('Erro ao carregar setores', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) return alert('Nome é obrigatório');

    try {
      setLoading(true);

      // Mapear para o formato esperado pelo backend (inglês)
      const payload: any = {
        name: formData.nome,
        sector: formData.setor_id, // Enviar ID do setor
        description: formData.descricao,
        color: selectedColor // Enviar cor selecionada
      };

      if (initialData) {
        await inventoryService.updateCategory(initialData.id, payload);
      } else {
        await inventoryService.createCategory(payload);
      }

      if (onSuccess) onSuccess();
      onCancel();
    } catch (error: any) {
      console.error('Erro ao salvar categoria:', error);
      const msg = error.message || 'Erro desconhecido';
      alert(`Erro ao salvar categoria: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {initialData ? 'Editar Categoria' : 'Nova Categoria'}
            </h1>
            <p className="text-xs text-slate-400">
              {initialData ? 'Atualize as informações da categoria' : 'Defina uma nova classificação para os itens do estoque'}
            </p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado Esquerdo - Detalhes */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
              Identificação da Categoria
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Nome da Categoria</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Material de Limpeza Profissional"
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Setor de Atuação</label>
                <select
                  value={formData.setor_id}
                  onChange={(e) => setFormData({ ...formData, setor_id: e.target.value })}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all cursor-pointer font-medium"
                >
                  <option value="">Selecione um setor...</option>
                  {sectors.map(sector => (
                    <option key={sector.id} value={sector.id}>{sector.nome}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Descrição da Finalidade</label>
                <textarea
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Explique o que deve ser classificado aqui..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Identidade Visual */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
              Identidade Visual
            </h3>

            <div className="flex flex-col items-center gap-4 py-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: selectedColor }}
              >
                <LayoutGrid size={32} />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase text-center leading-relaxed">
                Esta cor será usada para identificar itens desta categoria em listagens rápidas.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-full h-8 rounded-lg transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-105'
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-[24px] shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-indigo-400" /> Dica SAO
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Evite criar categorias genéricas. Quanto mais específica for a classificação, melhor será o seu relatório de consumo mensal por setor.
              </p>
            </div>
            <Box size={80} className="absolute -bottom-4 -right-4 text-white/5 rotate-12" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          onClick={onCancel}
          className="px-8 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-12 py-3 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-indigo-800 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} /> {loading ? 'Salvando...' : (initialData ? 'Atualizar Categoria' : 'Criar Categoria')}
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;
