
import React from 'react';
import { Search, Filter, Eye, Pencil, Trash2, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';

export interface StockExit {
  id: string;
  codigo: string;
  data: string;
  destino: string;
  solicitante: string;
  totalItens: number;
  status: 'Concluído' | 'Pendente' | 'Cancelado';
}

const MOCK_EXITS: StockExit[] = [
  { id: '1', codigo: '#OUT-9283', data: '05/01/2026', destino: 'Cozinha Central', solicitante: 'Maria Silva', totalItens: 12, status: 'Concluído' },
  { id: '2', codigo: '#OUT-9284', data: '06/01/2026', destino: 'Bazar Social', solicitante: 'João Pereira', totalItens: 45, status: 'Pendente' },
  { id: '3', codigo: '#OUT-9285', data: '06/01/2026', destino: 'Administrativo', solicitante: 'Ana Oliveira', totalItens: 5, status: 'Concluído' },
  { id: '4', codigo: '#OUT-9286', data: '04/01/2026', destino: 'Unidade Norte', solicitante: 'Carlos Souza', totalItens: 28, status: 'Concluído' },
  { id: '5', codigo: '#OUT-9287', data: '03/01/2026', destino: 'Cozinha Central', solicitante: 'Maria Silva', totalItens: 15, status: 'Cancelado' },
];

const ExitTable: React.FC = () => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Concluído': return 'bg-emerald-100 text-emerald-600';
      case 'Pendente': return 'bg-amber-100 text-amber-600';
      case 'Cancelado': return 'bg-rose-100 text-rose-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-700">Histórico de Saídas</h2>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
            {MOCK_EXITS.length} registros
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por código ou destino..." 
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
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CÓDIGO / DATA</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">DESTINO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SOLICITANTE</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ITENS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_EXITS.map((exit) => (
              <tr key={exit.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">{exit.codigo}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{exit.data}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <ArrowUpRight size={14} className="text-slate-300" />
                    {exit.destino}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{exit.solicitante}</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-700">{exit.totalItens}</span>
                  <span className="text-[10px] text-slate-400 ml-1">unidades</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyles(exit.status)}`}>
                    {exit.status === 'Concluído' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {exit.status}
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
        <p className="text-xs text-slate-400 font-medium">Monitorando o fluxo de saída de mercadorias.</p>
        <div className="flex items-center gap-2">
           <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white transition-colors shadow-sm">Exportar Relatório</button>
        </div>
      </div>
    </div>
  );
};

export default ExitTable;
