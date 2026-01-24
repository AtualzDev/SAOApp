
import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  MapPin, 
  Users, 
  Database, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Globe,
  ExternalLink
} from 'lucide-react';

interface OngData {
  id: string;
  nome: string;
  logo: string;
  localizacao: string;
  usuarios: number;
  plano: string;
  usoDisco: string;
  status: 'Ativo' | 'Inativo' | 'Bloqueado';
}

const ManagementOngsPage: React.FC = () => {
  const [ongs] = useState<OngData[]>([
    { id: '1', nome: 'CAPEC', logo: 'https://i.pravatar.cc/150?u=capec', localizacao: 'Belo Horizonte, MG', usuarios: 12, plano: 'Pro', usoDisco: '45%', status: 'Ativo' },
    { id: '2', nome: 'Mãos Dadas', logo: 'https://i.pravatar.cc/150?u=maos', localizacao: 'Contagem, MG', usuarios: 5, plano: 'Básico', usoDisco: '12%', status: 'Ativo' },
    { id: '3', nome: 'Amigos do Bem', logo: 'https://i.pravatar.cc/150?u=amigos', localizacao: 'São Paulo, SP', usuarios: 45, plano: 'Business', usoDisco: '88%', status: 'Ativo' },
    { id: '4', nome: 'Lar Esperança', logo: 'https://i.pravatar.cc/150?u=lar', localizacao: 'Curitiba, PR', usuarios: 8, plano: 'Pro', usoDisco: '30%', status: 'Inativo' },
    { id: '5', nome: 'Instituto Vida', logo: 'https://i.pravatar.cc/150?u=vida', localizacao: 'Rio de Janeiro, RJ', usuarios: 22, plano: 'Business', usoDisco: '65%', status: 'Ativo' },
  ]);

  const stats = [
    { label: 'Total de ONGs', value: '482', sub: '+8 este mês', icon: <Building2 size={20} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Usuários Totais', value: '2.450', sub: 'Média 5.1/ONG', icon: <Users size={20} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Uso de Storage', value: '1.2 TB', sub: '65% da capacidade', icon: <Database size={20} />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Taxa de Atividade', value: '94%', sub: 'Online agora', icon: <TrendingUp size={20} />, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#1E40AF] text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestão de Instituições</h1>
            <p className="text-sm text-slate-400 font-medium">Controle centralizado de todas as ONGs que utilizam a plataforma.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm shadow-sm">
            <Globe size={18} /> Ver Mapa
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1E40AF] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all">
            <Plus size={18} /> Cadastrar Nova ONG
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>{stat.icon}</div>
              <ShieldCheck size={18} className="text-slate-100" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</span>
              <span className="text-[10px] font-bold text-slate-400">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800">Instituições Ativas</h2>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              Operação Normal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Buscar ONG por nome ou CNPJ..." 
                className="w-full md:w-80 h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-400 transition-all"
              />
            </div>
            <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-white transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">INSTITUIÇÃO / LOCAL</th>
                <th className="px-8 py-5">USUÁRIOS</th>
                <th className="px-8 py-5">PLANO</th>
                <th className="px-8 py-5">USO DE DISCO</th>
                <th className="px-8 py-5">STATUS</th>
                <th className="px-8 py-5 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ongs.map((ong) => (
                <tr key={ong.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={ong.logo} className="w-10 h-10 rounded-2xl border border-slate-100 shadow-sm" alt="" />
                      <div>
                        <p className="text-sm font-black text-slate-700 uppercase tracking-tight leading-none">{ong.nome}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                          <MapPin size={10} /> {ong.localizacao}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-slate-700">{ong.usuarios}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase">Membros</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                      ong.plano === 'Business' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      ong.plano === 'Pro' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {ong.plano}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 min-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="bg-[#1E40AF] h-full" style={{ width: ong.usoDisco }} />
                       </div>
                       <span className="text-[10px] font-black text-slate-400">{ong.usoDisco}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ong.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-rose-100 text-rose-600'
                    }`}>
                      {ong.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><MoreVertical size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900 text-white p-8 rounded-[40px] flex items-center justify-between relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-xl font-black tracking-tight">Monitoramento em Tempo Real</h3>
            <p className="text-slate-400 text-sm mt-1">Status global das instâncias de banco de dados e servidores.</p>
         </div>
         <button className="relative z-10 px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
            Ver Logs de Servidor <ExternalLink size={14} />
         </button>
         <Building2 size={150} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12" />
      </div>
    </div>
  );
};

export default ManagementOngsPage;
