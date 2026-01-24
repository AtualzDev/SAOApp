
import React, { useState } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Search, 
  Filter, 
  Settings2, 
  Calendar, 
  ChevronRight, 
  MoreVertical,
  Zap,
  ShieldCheck,
  Ban,
  Clock,
  ArrowUpRight,
  Download,
  X,
  CheckCircle2
} from 'lucide-react';

interface SubscriptionData {
  id: string;
  ong: string;
  avatar: string;
  plano: 'Básico' | 'Pro' | 'Business';
  valor: number;
  status: 'Ativo' | 'Inadimplente' | 'Cancelado' | 'Trial';
  proximaCobranca: string;
  ciclo: 'Mensal' | 'Anual';
}

const ManagementSubscriptionsPage: React.FC = () => {
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionData | null>(null);

  const subscriptions: SubscriptionData[] = [
    { id: 'SUB-882', ong: 'CAPEC', avatar: 'https://i.pravatar.cc/150?u=capec', plano: 'Pro', valor: 150.00, status: 'Ativo', proximaCobranca: '15/02/2026', ciclo: 'Anual' },
    { id: 'SUB-412', ong: 'Mãos Dadas', avatar: 'https://i.pravatar.cc/150?u=maos', plano: 'Básico', valor: 49.90, status: 'Ativo', proximaCobranca: '10/02/2026', ciclo: 'Mensal' },
    { id: 'SUB-901', ong: 'Amigos do Bem', avatar: 'https://i.pravatar.cc/150?u=amigos', plano: 'Business', valor: 450.00, status: 'Inadimplente', proximaCobranca: '01/02/2026', ciclo: 'Anual' },
    { id: 'SUB-332', ong: 'Instituto Vida', avatar: 'https://i.pravatar.cc/150?u=vida', plano: 'Pro', valor: 150.00, status: 'Ativo', proximaCobranca: '22/02/2026', ciclo: 'Mensal' },
    { id: 'SUB-115', ong: 'Lar Esperança', avatar: 'https://i.pravatar.cc/150?u=lar', plano: 'Básico', valor: 49.90, status: 'Trial', proximaCobranca: '28/01/2026', ciclo: 'Mensal' },
  ];

  const stats = [
    { label: 'MRR (Receita Recurrente)', value: 'R$ 14.280', change: '+5.4%', icon: <TrendingUp size={20} />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Assinantes Ativos', value: '342', change: '+12 hoje', icon: <Users size={20} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Ticket Médio', value: 'R$ 124,50', change: 'Estável', icon: <Zap size={20} />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Churn (Cancelamento)', value: '0.8%', change: '-0.2%', icon: <Ban size={20} />, color: 'bg-rose-50 text-rose-600' },
  ];

  const handleOpenMaintenance = (sub: SubscriptionData) => {
    setSelectedSubscription(sub);
    setIsMaintenanceModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#1E40AF] text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <CreditCard size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Assinaturas e Planos</h1>
            <p className="text-sm text-slate-400 font-medium">Gestão operacional de clientes SaaS e faturamento recorrente.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm">
            <Download size={18} /> Logs de Venda
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1E40AF] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all">
            <Settings2 size={18} /> Configurar Planos
          </button>
        </div>
      </div>

      {/* SaaS Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <ArrowUpRight size={18} className="text-slate-200" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</span>
              <span className="text-[10px] font-bold text-slate-400">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800">Contratos ONGs</h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
              {subscriptions.length} Clientes Ativos
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Buscar ONG ou ID..." 
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
                <th className="px-8 py-5">INSTITUIÇÃO</th>
                <th className="px-8 py-5">PLANO ATUAL</th>
                <th className="px-8 py-5">VALOR / CICLO</th>
                <th className="px-8 py-5">STATUS</th>
                <th className="px-8 py-5">PRÓX. FATURA</th>
                <th className="px-8 py-5 text-right">MANUTENÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <img src={sub.avatar} className="w-9 h-9 rounded-xl border border-slate-100 shadow-sm" alt={sub.ong} />
                      <div>
                        <p className="text-sm font-black text-slate-700 uppercase leading-none">{sub.ong}</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-1 tracking-wider">{sub.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      sub.plano === 'Business' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      sub.plano === 'Pro' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {sub.plano}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-sm font-black text-slate-800">R$ {sub.valor.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{sub.ciclo}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      sub.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' :
                      sub.status === 'Trial' ? 'bg-blue-100 text-blue-600' :
                      sub.status === 'Inadimplente' ? 'bg-amber-100 text-amber-600' :
                      'bg-rose-100 text-rose-600'
                    }`}>
                      {sub.status === 'Ativo' && <CheckCircle2 size={12} />}
                      {sub.status === 'Inadimplente' && <AlertCircle size={12} />}
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Clock size={14} className="text-slate-300" />
                      {sub.proximaCobranca}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleOpenMaintenance(sub)}
                      className="px-4 py-2 bg-slate-100 hover:bg-[#1E40AF] hover:text-white text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                    >
                      Gerenciar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Manutenção de Assinatura */}
      {isMaintenanceModalOpen && selectedSubscription && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsMaintenanceModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Settings2 size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Manutenção de Plano</h2>
              </div>
              <button onClick={() => setIsMaintenanceModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[24px] border border-slate-100">
                <img src={selectedSubscription.avatar} className="w-14 h-14 rounded-2xl shadow-sm" alt="" />
                <div>
                   <h3 className="font-black text-slate-800 uppercase tracking-tight">{selectedSubscription.ong}</h3>
                   <p className="text-xs text-slate-400 font-bold">Assinatura: {selectedSubscription.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Alterar Plano</label>
                  <select className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-400 transition-all cursor-pointer">
                    <option>Plano Básico</option>
                    <option selected={selectedSubscription.plano === 'Pro'}>Plano Pro</option>
                    <option selected={selectedSubscription.plano === 'Business'}>Plano Business</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Global</label>
                  <select className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-400 transition-all cursor-pointer">
                    <option selected={selectedSubscription.status === 'Ativo'}>Ativo</option>
                    <option selected={selectedSubscription.status === 'Inadimplente'}>Suspenso (Inadimplência)</option>
                    <option>Congelado Temporariamente</option>
                    <option>Cancelado Manualmente</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Justificativa da alteração</label>
                <textarea 
                  rows={3}
                  placeholder="Descreva o motivo da manutenção manual..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-blue-400 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
                 <button 
                  onClick={() => setIsMaintenanceModalOpen(false)}
                  className="px-8 py-3 text-slate-400 font-bold hover:text-slate-600 transition-all"
                 >
                    Descartar
                 </button>
                 <button 
                  onClick={() => setIsMaintenanceModalOpen(false)}
                  className="px-12 py-3 bg-[#1E40AF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                 >
                    Salvar Mudanças
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-[40px] flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <ShieldCheck size={16} /> Monitoramento de Infraestrutura
          </div>
          <h2 className="text-2xl font-black tracking-tight leading-tight">Saúde dos gateways de pagamento ativa.</h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            As renovações automáticas estão sendo processadas via Stripe/Iugu. Última conciliação de faturas realizada há 42 minutos.
          </p>
        </div>
        <button className="relative z-10 px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg">
          Ver Dashboards Financeiros <ChevronRight size={14} />
        </button>
        <CreditCard size={180} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12" />
      </div>
    </div>
  );
};

export default ManagementSubscriptionsPage;
