
import React from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ChevronDown,
  Download
} from 'lucide-react';

const ManagementDashboard: React.FC = () => {
  const timeFilters = ['12 Meses', '30 Dias', '7 Dias', 'Hoje'];
  
  const stats = [
    { label: "Total de Ong's", value: "482", change: "+12,5%", positive: true },
    { label: "Total de planos Pagos", value: "353", change: "+2,5%", positive: true },
    { label: "Total de planos Free", value: "353", change: "-2,0%", positive: false },
  ];

  const ongsList = [
    { name: "CAPEC", plan: "Pro", user: "Graziela Vaz", status: "Ativo", storage: "45%", avatar: "https://i.pravatar.cc/150?u=capec" },
    { name: "Mãos Dadas", plan: "Free", user: "Roberto Silva", status: "Inativo", storage: "12%", avatar: "https://i.pravatar.cc/150?u=maos" },
    { name: "Amigos do Bem", plan: "Business", user: "Ana Paula", status: "Ativo", storage: "88%", avatar: "https://i.pravatar.cc/150?u=amigos" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {timeFilters.map((filter) => (
                <button 
                  key={filter}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    filter === '12 Meses' ? 'bg-slate-50 text-slate-900 border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Calendar size={14} /> Filtrar por período
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart Card */}
        <div className="lg:col-span-3 bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 flex flex-col min-h-[400px]">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400">Receitas Vs Despesas</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">R$ 24.895,65</h2>
              <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black border border-emerald-100">
                <TrendingUp size={12} /> 12,5%
              </span>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center border-t border-slate-50 mt-8">
             <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-[#1E40AF]">Gráfico de linha</h3>
                <p className="text-sm text-slate-400 font-medium">Visualização de fluxo de caixa mensal</p>
                <div className="w-full h-32 flex items-end gap-2 justify-center opacity-20">
                  {[40, 70, 45, 90, 65, 80, 55, 75, 40, 60, 85, 50].map((h, i) => (
                    <div key={i} className="w-4 bg-[#1E40AF] rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Retention Gauge Card */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 flex flex-col">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-700">Taxa de retenção</h3>
            <p className="text-[10px] font-medium text-slate-400">Acima de X% é o objetivo</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
               <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="#F1F5F9" 
                    strokeWidth="8" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="62.8" 
                    strokeLinecap="round"
                  />
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="#10B981" 
                    strokeWidth="8" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="100" 
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900">84,3%</span>
               </div>
            </div>
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800">84,3% taxa de retenção atual</p>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Percentual de ONGs que continuam usando a plataforma após 6 meses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400">
                {stat.label.includes('Ong') ? 'Total de ' : 'Total de planos '}
                <span className="text-slate-600 font-black">{stat.label.split(' ').pop()}</span>
              </p>
              <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={18} /></button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-black text-slate-800">{stat.value}</span>
              <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                stat.positive 
                  ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                  : 'bg-rose-50 text-rose-500 border-rose-100'
              }`}>
                {stat.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ONGs Table List */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Lista de Ong's</h2>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por nome" 
                  className="w-full md:w-80 h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                />
             </div>
             <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-white transition-all uppercase tracking-widest">
                <Filter size={16} /> Filtrar por
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="px-8 py-5">NOME ONG</th>
                <th className="px-8 py-5">PLANO</th>
                <th className="px-8 py-5">USUÁRIO</th>
                <th className="px-8 py-5">STATUS</th>
                <th className="px-8 py-5">ARMAZENAMENTO</th>
                <th className="px-8 py-5 text-right">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ongsList.map((ong, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-700 uppercase">{ong.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-500">{ong.plan}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <img src={ong.avatar} className="w-8 h-8 rounded-full border border-slate-100" alt={ong.user} />
                      <span className="text-sm font-semibold text-slate-600">{ong.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ong.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {ong.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 min-w-[80px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: ong.storage }} />
                       </div>
                       <span className="text-xs font-bold text-slate-500">{ong.storage}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
