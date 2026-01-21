
import React from 'react';
import { Search, Filter, Pencil, Trash2, LayoutGrid, Utensils, Shirt, PencilRuler, Heart } from 'lucide-react';

export interface Category {
  id: string;
  nome: string;
  setor: string;
  qtdItens: number;
  cor: string;
  icon: React.ReactNode;
}

const MOCK_CATEGORIES: Category[] = [
  { id: '1', nome: 'Alimentação', setor: 'Cozinha Central', qtdItens: 142, cor: 'bg-amber-500', icon: <Utensils size={18} /> },
  { id: '2', nome: 'Vestuário', setor: 'Bazar Social', qtdItens: 850, cor: 'bg-indigo-500', icon: <Shirt size={18} /> },
  { id: '3', nome: 'Escritório', setor: 'Administrativo', qtdItens: 34, cor: 'bg-blue-500', icon: <PencilRuler size={18} /> },
  { id: '4', nome: 'Higiene', setor: 'Limpeza e Higiene', qtdItens: 89, cor: 'bg-emerald-500', icon: <Heart size={18} /> },
  { id: '5', nome: 'Limpeza', setor: 'Limpeza e Higiene', qtdItens: 56, cor: 'bg-rose-500', icon: <LayoutGrid size={18} /> },
];

const CategoryTable: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-700">Categorias de Estoque</h2>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
            {MOCK_CATEGORIES.length} categorias
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar categoria..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
            Filtrar <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">IDENTIFICAÇÃO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SETOR RELACIONADO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">QTD. DE ITENS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_CATEGORIES.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${cat.cor} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                      {cat.icon}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">{cat.nome}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ID: #{cat.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-600">
                    {cat.setor}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">{cat.qtdItens}</span>
                    <span className="text-[10px] text-slate-400 font-medium italic">itens ativos</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-600">
                    Ativa
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Pencil size={16} /></button>
                    <button className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
        <p className="text-xs text-slate-400 font-medium">Categorias organizam seu inventário logicamente.</p>
        <div className="flex items-center gap-2">
           <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white transition-colors shadow-sm">Configurar Hierarquia</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;
