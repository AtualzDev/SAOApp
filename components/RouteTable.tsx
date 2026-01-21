
import React from 'react';
import { Pencil, Trash2, ExternalLink, Car, Search } from 'lucide-react';

export interface RouteData {
  id: string;
  dataHora: string;
  motorista: string;
  status: 'Pendente' | 'Em trânsito' | 'Concluído';
  contato: string;
}

interface RouteTableProps {
  routes: RouteData[];
  onEdit: (route: RouteData) => void;
  onDelete: (id: string) => void;
  onViewPassagers: () => void;
}

const RouteTable: React.FC<RouteTableProps> = ({ routes, onEdit, onDelete, onViewPassagers }) => {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Lista das rotas</h2>
          <p className="text-xs text-slate-400 font-medium">Leads cadastrados {routes.length}</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar rota..." 
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-5">ID</th>
              <th className="px-8 py-5">DATA/HORA</th>
              <th className="px-8 py-5">MOTORISTA</th>
              <th className="px-8 py-5 text-center">STATUS</th>
              <th className="px-8 py-5">CONTATO</th>
              <th className="px-8 py-5 text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-sm font-bold text-slate-500 font-mono tracking-tighter">
                  {route.id}
                </td>
                <td className="px-8 py-5 text-sm font-medium text-slate-600">
                  {route.dataHora}
                </td>
                <td className="px-8 py-5 text-sm font-bold text-slate-700">
                  {route.motorista || '--'}
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-4 py-1 rounded-full text-[11px] font-bold ${
                    route.status === 'Pendente' ? 'bg-[#FFB932] text-white' : 
                    route.status === 'Em trânsito' ? 'bg-blue-500 text-white' : 
                    'bg-emerald-500 text-white'
                  }`}>
                    {route.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-slate-500">
                  {route.contato || '--'}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => onEdit(route)}
                      className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(route.id)}
                      className="p-2 text-orange-400 hover:text-orange-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      className="p-2 text-slate-800 hover:text-blue-700 transition-colors"
                      title="Ver Detalhes"
                    >
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteTable;
