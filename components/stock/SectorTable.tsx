
import React from 'react';
import { Search, Filter, Eye, Pencil, Trash2, Map, Users, Box } from 'lucide-react';

export interface InventorySector {
  id: string;
  nome: string;
  responsavel: string;
  localizacao: string;
  totalItens: number;
  status: 'Ativo' | 'Inativo' | 'Em Manutenção';
}

const MOCK_SECTORS: InventorySector[] = [
  { id: '1', nome: 'Cozinha Central', responsavel: 'Maria Silva', localizacao: 'Bloco A - Térreo', totalItens: 156, status: 'Ativo' },
  { id: '2', nome: 'Almoxarifado Geral', responsavel: 'Ricardo Santos', localizacao: 'Bloco B - Galpão 1', totalItens: 1240, status: 'Ativo' },
  { id: '3', nome: 'Bazar Social', responsavel: 'Ana Oliveira', localizacao: 'Unidade Centro', totalItens: 450, status: 'Ativo' },
  { id: '4', nome: 'Depósito de Limpeza', responsavel: 'Carlos Souza', localizacao: 'Bloco A - Subsolo', totalItens: 89, status: 'Em Manutenção' },
  { id: '5', nome: 'Farmácia Interna', responsavel: 'Dra. Fernanda', localizacao: 'Bloco C - Sala 4', totalItens: 210, status: 'Ativo' },
];

const SectorTable: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-emerald-100 text-emerald-600';
      case 'Inativo': return 'bg-slate-100 text-slate-500';
      case 'Em Manutenção': return 'bg-amber-100 text-amber-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-700">Setores de Armazenamento</h2>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
            {MOCK_SECTORS.length} setores
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou responsável..." 
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
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SETOR / ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">LOCALIZAÇÃO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">RESPONSÁVEL</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CAPACIDADE UTILIZADA</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_SECTORS.map((sector) => (
              <tr key={sector.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Map size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">{sector.nome}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ID: #SET-00{sector.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Box size={14} className="text-slate-300" />
                    {sector.localizacao}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200">
                      {sector.responsavel.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{sector.responsavel}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                      <span>{sector.totalItens} Itens</span>
                      <span>{Math.round((sector.totalItens / 2000) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full" 
                        style={{ width: `${Math.min((sector.totalItens / 2000) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(sector.status)}`}>
                    {sector.status}
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
        <p className="text-xs text-slate-400 font-medium">Organização por setores facilita a contagem e auditoria do estoque.</p>
        <div className="flex items-center gap-2">
           <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white transition-colors shadow-sm">Imprimir Etiquetas QR</button>
        </div>
      </div>
    </div>
  );
};

export default SectorTable;
