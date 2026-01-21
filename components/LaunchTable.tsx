
import React from 'react';
import { Launch } from '../types';
import { Search, Filter, Eye, Pencil } from 'lucide-react';

interface LaunchTableProps {
  launches: Launch[];
}

const LaunchTable: React.FC<LaunchTableProps> = ({ launches }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-700">Lista de lançamentos</h2>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
            {launches.length} lançamentos
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nº da nota" 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
            Filtrar por <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CÓDIGO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">RECEBIMENTO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">FORNECEDOR</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right md:text-left">NOTA FISCAL</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">TIPO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {launches.map((launch, idx) => (
              <tr key={launch.codigo + idx} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-slate-500">{launch.codigo}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{launch.recebimento}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700 uppercase max-w-[200px] truncate">{launch.fornecedor}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{launch.notaFiscal}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`font-medium ${launch.tipo === 'Doação' ? 'text-blue-600' : 'text-green-600'}`}>
                    {launch.tipo}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      title="Visualizar"
                      className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      title="Editar"
                      className="p-2 text-slate-300 hover:text-[#1E40AF] hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
        <p className="text-xs text-slate-400">Mostrando 1 a {launches.length} de {launches.length} lançamentos</p>
        <div className="flex items-center gap-2">
           <button className="px-3 py-1 rounded border border-slate-200 text-xs text-slate-400 disabled:opacity-30" disabled>Anterior</button>
           <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-bold">1</button>
           <button className="px-3 py-1 rounded border border-slate-200 text-xs text-slate-500 disabled:opacity-30" disabled>Próximo</button>
        </div>
      </div>
    </div>
  );
};

export default LaunchTable;
