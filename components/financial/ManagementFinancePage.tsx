
import React, { useState } from 'react';
import { 
  CircleDollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  CreditCard,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronRight,
  BarChart3,
  Wallet
} from 'lucide-react';

interface GlobalTransaction {
  id: string;
  ong: string;
  avatar: string;
  plano: 'Básico' | 'Pro' | 'Business';
  valor: number;
  data: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  metodo: 'Cartão' | 'Boleto' | 'Pix';
}

const ManagementFinancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const transactions: GlobalTransaction[] = [
    { id: 'REC-001', ong: 'CAPEC', avatar: 'https://i.pravatar.cc/150?u=capec', plano: 'Pro', valor: 150.00, data: '06/01/2026', status: 'Pago', metodo: 'Cartão' },
    { id: 'REC-002', ong: 'Mãos Dadas', avatar: 'https://i.pravatar.cc/150?u=maos', plano: 'Básico', valor: 50.00, data: '05/01/2026', status: 'Pendente', metodo: 'Pix' },
    { id: 'REC-003', ong: 'Amigos do Bem', avatar: 'https://i.pravatar.cc/150?u=amigos', plano: 'Business', valor: 450.00, data: '05/01/2026', status: 'Pago', metodo: 'Boleto' },
    { id: 'REC-004', ong: 'Lar Esperança', avatar: 'https://i.pravatar.cc/150?u=lar', plano: 'Pro', valor: 150.00, data: '04/01/2026', status: 'Atrasado', metodo: 'Cartão' },
    { id: 'REC-005', ong: 'Instituto Vida', avatar: 'https://i.pravatar.cc/150?u=vida', plano: 'Business', valor: 450.00, data: '03/01/2026', status: 'Pago', metodo: 'Pix' },
  ];

  const stats = [
    { label: 'MRR (Receita Mensal)', value: 'R$ 18.450', sub: '+8.2% vs mês ant.', icon: <BarChart3 size={20} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Receita Anual (ARR)', value: 'R$ 221.400', sub: 'Projeção 2026', icon: <TrendingUp size={20} />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Faturas Pendentes', value: '14', sub: 'R$ 2.100 total', icon: <AlertCircle size={20} />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Churn Rate', value: '1.2%', sub: 'Média estável', icon: <ArrowDownLeft size={20} />, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto w-full">
      {/* Header Profissional */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#1E40AF] text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <CircleDollarSign size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Financeiro Global</h1>
            <p className="text-sm text-slate-400 font-medium">Controle de faturamentos, assinaturas e saúde financeira da plataforma.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm shadow-sm">
            <Download size={18} /> Exportar Relatório
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1E40AF] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-95">
            <Calendar size={18} /> Período Personalizado
          </button>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                {stat.icon}
              </div>
              <ArrowUpRight size={18} className="text-slate-200" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-800">{stat.value}</span>
              <span className="text-[10px] font-bold text-slate-400">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tabela de Recebimentos */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Fluxo de Recebimentos</h2>
                <p className="text-sm text-slate-400 font-medium">Últimas faturas geradas pelas ONGs</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por ONG ou Fatura..." 
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-5">ONG / ID</th>
                    <th className="px-8 py-5">PLANO</th>
                    <th className="px-8 py-5">VALOR</th>
                    <th className="px-8 py-5">MÉTODO</th>
                    <th className="px-8 py-5">STATUS</th>
                    <th className="px-8 py-5 text-right">AÇÃO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <img src={t.avatar} className="w-9 h-9 rounded-full border border-slate-100 shadow-sm" alt={t.ong} />
                          <div>
                            <p className="text-sm font-black text-slate-700 uppercase">{t.ong}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{t.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-2.5 py-1 bg-blue-50 text-[#1E40AF] rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                          {t.plano}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-slate-800">
                        R$ {t.valor.toFixed(2)}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <CreditCard size={14} className="text-slate-300" />
                          {t.metodo}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          t.status === 'Pago' ? 'bg-emerald-100 text-emerald-600' :
                          t.status === 'Atrasado' ? 'bg-rose-100 text-rose-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-slate-300 hover:text-[#1E40AF] transition-all"><MoreVertical size={20} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
              <button className="text-xs font-bold text-[#1E40AF] hover:underline">Ver todas as transações da plataforma</button>
            </div>
          </div>
        </div>

        {/* Sidebar de Resumo & Metas */}
        <div className="lg:col-span-4 space-y-8">
          {/* Gráfico Circular de Distribuição de Planos */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Users size={18} className="text-blue-500" /> Mix de Assinaturas
            </h3>
            
            <div className="flex justify-center py-4">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1E40AF" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="100" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="180" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-800">482</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">ONGs</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Business', count: 124, color: 'bg-[#1E40AF]' },
                { label: 'Pro', count: 218, color: 'bg-[#10B981]' },
                { label: 'Basic (Free)', count: 140, color: 'bg-slate-200' },
              ].map((p, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                    <span className="text-xs font-bold text-slate-600">{p.label}</span>
                  </div>
                  <span className="text-xs font-black text-slate-700">{p.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card de Projeção de Crescimento */}
          <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Objetivo Trimestral</h3>
                <div>
                   <div className="flex justify-between items-end mb-3">
                      <span className="text-4xl font-black tracking-tighter">R$ 25k</span>
                      <span className="text-xs font-bold text-emerald-400">74% Concluído</span>
                   </div>
                   <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#10B981] h-full w-[74%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                   </div>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Faltam <span className="text-white font-bold">R$ 6.550,00</span> para atingir a meta de novos faturamentos deste trimestre.
                </p>
                <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg">
                  Ver Estratégias <ChevronRight size={14} />
                </button>
             </div>
             <Wallet size={120} className="absolute -bottom-8 -right-8 text-white/5 -rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementFinancePage;
