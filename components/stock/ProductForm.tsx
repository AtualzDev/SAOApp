
import React, { useState, useEffect } from 'react';
import { Package, Plus, Save, X, LayoutGrid, Info } from 'lucide-react';
import { inventoryService, Category } from '../../services/inventoryService';
import SuccessModal from './SuccessModal';

interface ProductFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onCancel, onSuccess }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, productName: '' });

  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    categoria: '',
    setor: '',
    descricao: '',
    unidade_medida: 'UN',
    estoque_inicial: 0,
    estoque_minimo: 5,
    valor_referencia: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      console.log('Carregando categorias...');
      const data = await inventoryService.listCategories();
      console.log('Categorias carregadas:', data);
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      alert('Erro ao carregar categorias. Verifique se o backend está rodando.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }

    try {
      setLoading(true);

      await inventoryService.createProduct({
        nome: formData.nome,
        codigo: formData.codigo || undefined,
        categoria: formData.categoria || undefined,
        setor: formData.setor || undefined,
        descricao: formData.descricao || undefined,
        unidade_medida: formData.unidade_medida,
        estoque_inicial: formData.estoque_inicial,
        estoque_minimo: formData.estoque_minimo,
        valor_referencia: formData.valor_referencia
      });

      // Mostrar modal de sucesso
      setSuccessModal({ isOpen: true, productName: formData.nome });

      // Resetar formulário
      setFormData({
        nome: '',
        codigo: '',
        categoria: '',
        setor: '',
        descricao: '',
        unidade_medida: 'UN',
        estoque_minimo: 5,
        valor_referencia: 0
      });

      // Chamar callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModal({ isOpen: false, productName: '' });
    // Redirecionar para lista de produtos
    onCancel();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Novo Produto</h1>
              <p className="text-xs text-slate-400">Cadastre um novo item no catálogo do estoque</p>
            </div>
          </div>
          <button type="button" onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lado Esquerdo - Detalhes do Produto */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Info size={16} className="text-indigo-500" /> Informações Básicas
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome do Produto *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Leite Loga Vida"
                    required
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Código / SKU</label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      placeholder="45"
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all cursor-pointer"
                    >
                      <option value="">Selecione...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Setor</label>
                  <select
                    value={formData.setor}
                    onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Escritório">Escritório</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Descrição (Opcional)</label>
                  <textarea
                    rows={3}
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="444"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <LayoutGrid size={16} className="text-indigo-500" /> Gestão de Estoque
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Unidade Medida</label>
                  <select
                    value={formData.unidade_medida}
                    onChange={(e) => setFormData({ ...formData, unidade_medida: e.target.value })}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all cursor-pointer"
                  >
                    <option value="UN">Unidade (un)</option>
                    <option value="Kg">Quilograma (kg)</option>
                    <option value="Litro">Litro (l)</option>
                    <option value="Caixa">Caixa (cx)</option>
                    <option value="Pacote">Pacote (pct)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Estoque Inicial</label>
                  <input
                    type="number"
                    value={formData.estoque_inicial}
                    onChange={(e) => setFormData({ ...formData, estoque_inicial: Number(e.target.value) })}
                    min="0"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Estoque Mínimo</label>
                  <input
                    type="number"
                    value={formData.estoque_minimo}
                    onChange={(e) => setFormData({ ...formData, estoque_minimo: Number(e.target.value) })}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Resumo e Foto */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 group cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                <Plus className="text-slate-300 group-hover:text-indigo-400 transition-colors" size={40} />
                <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-500 uppercase tracking-widest">Add Imagem</span>
              </div>
              <p className="mt-4 text-[10px] text-slate-400 font-medium">Arquivos suportados: PNG, JPG ou JPEG (Máx. 2MB)</p>
            </div>

            <div className="bg-indigo-900 text-white p-6 rounded-[24px] shadow-xl shadow-indigo-200">
              <h3 className="font-bold text-sm mb-4">Valor de Referência</h3>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-indigo-300">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor_referencia}
                  onChange={(e) => setFormData({ ...formData, valor_referencia: Number(e.target.value) })}
                  placeholder="7"
                  className="w-full h-14 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-xl font-bold outline-none focus:bg-white/20 focus:border-white/40 transition-all"
                />
              </div>
              <p className="text-[10px] text-indigo-300 mt-4 leading-relaxed uppercase font-black tracking-widest">
                Este valor será usado como sugestão em novas compras e doações.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-3 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-indigo-800 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={successModal.isOpen}
        productName={successModal.productName}
        onClose={handleSuccessClose}
      />
    </>
  );
};

export default ProductForm;
