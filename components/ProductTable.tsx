
import React from 'react';
import { Search, Filter, Eye, Pencil, Trash2, AlertTriangle, PackageCheck, PackageX } from 'lucide-react';

export interface Product {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  estoque: number;
  estoqueMinimo: number;
  unidade: string;
  valorReferencia: number;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', codigo: 'PROD-001', nome: 'Arroz Integral 5kg', categoria: 'Alimentação', estoque: 45, estoqueMinimo: 10, unidade: 'Pacote', valorReferencia: 22.50 },
  { id: '2', codigo: 'PROD-002', nome: 'Feijão Carioca 1kg', categoria: 'Alimentação', estoque: 8, estoqueMinimo: 15, unidade: 'Pacote', valorReferencia: 8.90 },
  { id: '3', codigo: 'PROD-003', nome: 'Papel A4 Resma', categoria: 'Escritório', estoque: 0, estoqueMinimo: 5, unidade: 'Unidade', valorReferencia: 25.00 },
  { id: '4', codigo: 'PROD-004', nome: 'Detergente Neutro 500ml', categoria: 'Limpeza', estoque: 120, estoqueMinimo: 20, unidade: 'Frasco', valorReferencia: 2.15 },
  { id: '5', codigo: 'PROD-005', nome: 'Leite Integral 1L', categoria: 'Alimentação', estoque: 12, estoqueMinimo: 24, unidade: 'Caixa', valorReferencia: 4.80 },
];

const ProductTable: React.FC = () => {
  const getStockStatus = (estoque: number, minimo: number) => {
    if (estoque === 0) return { label: 'Esgotado', color: 'bg-rose-100 text-rose-600', icon: <PackageX size={14} /> };
    if (estoque <= minimo) return { label: 'Crítico', color: 'bg-amber-100 text-amber-600', icon: <AlertTriangle size={14} /> };
    return { label: 'Em Estoque', color: 'bg-emerald-100 text-emerald-600', icon: <PackageCheck size={14} /> };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-700">Catálogo de Produtos</h2>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
            {MOCK_PRODUCTS.length} itens
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou código..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
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
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">PRODUTO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CATEGORIA</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ESTOQUE ATUAL</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">UNIDADE</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_PRODUCTS.map((product) => {
              const status = getStockStatus(product.estoque, product.estoqueMinimo);
              return (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{product.nome}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{product.codigo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {product.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700">{product.estoque}</span>
                      <span className="text-[10px] text-slate-400 font-medium">mín: {product.estoqueMinimo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{product.unidade}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={16} /></button>
                      <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Pencil size={16} /></button>
                      <button className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
        <p className="text-xs text-slate-400 font-medium">Página 1 de 1</p>
        <div className="flex items-center gap-2">
           <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-400 disabled:opacity-30" disabled>Anterior</button>
           <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white transition-colors">Próximo</button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
