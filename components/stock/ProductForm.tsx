
import React from 'react';
import { Package, Plus, Save, X, LayoutGrid, Info } from 'lucide-react';

interface ProductFormProps {
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onCancel }) => {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-300">
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
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
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
                <label className="text-xs font-bold text-slate-500 uppercase">Nome do Produto</label>
                <input 
                  type="text" 
                  placeholder="Ex: Arroz Integral 5kg" 
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Código / SKU</label>
                  <input 
                    type="text" 
                    placeholder="PROD-XXXX" 
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                  <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all cursor-pointer">
                    <option>Alimentação</option>
                    <option>Limpeza</option>
                    <option>Higiene</option>
                    <option>Escritório</option>
                    <option>Outros</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Descrição (Opcional)</label>
                <textarea 
                  rows={3} 
                  placeholder="Detalhes sobre o produto..." 
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
                <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all cursor-pointer">
                  <option>Unidade (un)</option>
                  <option>Quilograma (kg)</option>
                  <option>Litro (l)</option>
                  <option>Caixa (cx)</option>
                  <option>Pacote (pct)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Estoque Inicial</label>
                <input 
                  type="number" 
                  defaultValue="0" 
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Estoque Mínimo</label>
                <input 
                  type="number" 
                  defaultValue="5" 
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
                type="text" 
                placeholder="0,00" 
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
          onClick={onCancel}
          className="px-8 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button className="px-12 py-3 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-indigo-800 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
          <Save size={18} /> Salvar Produto
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
