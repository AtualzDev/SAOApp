
import React from 'react';
import { 
  Package, 
  AlertTriangle, 
  CalendarClock, 
  ClipboardList, 
  ArrowUpRight, 
  ArrowDownRight, 
  Timer,
  ShoppingBag,
  History,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';

const StockDashboard: React.FC = () => {
  const stats = [
    { label: 'Total em Estoque', value: '1.284', sub: '+12 hoje', icon: <Package size={24} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Estoque Crítico', value: '08', sub: 'Abaixo do mín.', icon: <AlertTriangle size={24} />, color: 'bg-rose-50 text-rose-600' },
    { label: 'Vencimentos Próximos', value: '14', sub: 'Próximos 15 dias', icon: <CalendarClock size={24} />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Solicitações Pendentes', value: '23', sub: 'Aguardando ação', icon: <ClipboardList size={24} />, color: 'bg-indigo-50 text-indigo-600' },
  ];

  const nearExpiration = [
    { id: '1', item: 'Leite Integral 1L', lote: '#L8821', vencimento: '12/01/2026', dias: 6, status: 'critico' },
    { id: '2', item: 'Fralda G Confort', lote: '#F2023', vencimento: '20/01/2026', dias: 14, status: 'alerta' },
    { id: '3', item: 'Arroz Integral 5kg', lote: '#A4590', vencimento: '25/01/2026', dias: 19, status: 'normal' },
  ];

  const topExits = [
    { item: 'Cesta Básica Tipo A', qtd: 85, trend: '+12%', color: 'bg-blue-500' },
    { item: 'Leite Especial', qtd: 64, trend: '+5%', color: 'bg-indigo-500' },
    { item: 'Kit Higiene Pessoal', qtd: 42, trend: '-2%', color: 'bg-slate-400' },
    { item: 'Fralda G', qtd: 38, trend: '+15%', color: 'bg-cyan-500' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Painel Operacional do Estoque</h1>
          <p className="text-sm text-slate-400 font-medium">Controle de validade, liberações e giro de mercadorias.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
           <div className="px-4 py-2 flex items-center gap-2 border-r border-slate-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistema Online</span>
           </div>
           <div className="px-4 py-2 flex items-center gap-2">
              <CalendarClock size={16} className="text-blue-600" />
              <span className="text-xs font-bold text-slate-600">06 Jan, 2026</span>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <ArrowUpRight size={20} className="text-slate-200" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end gap-3 mt-1">
               <span className="text-3xl font-black text-slate-800">{stat.value}</span>
               <span className="text-[10px] font-bold text-slate-400 mb-1.5">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lado Esquerdo - Movimentação e Vencimento */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Vencimentos Próximos */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Próximos Vencimentos</h2>
                <p className="text-xs text-slate-400 font-medium">Itens que precisam ser distribuídos com prioridade</p>
              </div>
              <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all"><Timer size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              {nearExpiration.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${
                      item.status === 'critico' ? 'bg-rose-100 text-rose-600' : 
                      item.status === 'alerta' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.dias}D
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{item.item}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Lote: {item.lote} • Vence em {item.vencimento}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                    Ver Lote <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50/50 text-center border-t border-slate-100">
               <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver relatório completo de validade</button>
            </div>
          </div>

          {/* Ranking de Saídas */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-lg font-bold text-slate-800">Top Saídas (Mês Atual)</h2>
                   <p className="text-xs text-slate-400 font-medium">Produtos com maior rotatividade</p>
                </div>
                <TrendingUp size={24} className="text-slate-200" />
             </div>
             <div className="space-y-6">
                {topExits.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-xs font-bold text-slate-600">{item.item}</span>
                       <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-800">{item.qtd} un.</span>
                          <span className={`text-[10px] font-bold ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{item.trend}</span>
                       </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                       <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${(item.qtd / 100) * 100}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Lado Direito - Solicitações */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Solicitações de Doação */}
           <div className="bg-indigo-900 text-white rounded-[32px] p-8 shadow-xl shadow-indigo-900/10">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2"><ShoppingBag size={18} className="text-indigo-400" /> Doações Pendentes</h3>
                 <span className="bg-white/10 px-2 py-0.5 rounded-lg text-[10px] font-black">08</span>
              </div>
              <div className="space-y-4">
                 {[1, 2, 3].map((_, i) => (
                   <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] font-black text-indigo-300 uppercase">#REQ-023{i}</span>
                         <span className="text-[9px] font-bold text-white/40">Há {i + 1}h</span>
                      </div>
                      <p className="text-xs font-bold text-white mb-1">Cesta Básica + Kit Higiene</p>
                      <p className="text-[10px] text-indigo-200">Destino: Maria Auxiliadora</p>
                      <div className="mt-4 flex justify-end">
                         <button className="p-2 bg-white text-indigo-900 rounded-lg group-hover:scale-110 transition-transform"><CheckCircle2 size={16} /></button>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Ver Todas Solicitações</button>
           </div>

           {/* Solicitações de Empréstimo */}
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2"><Clock size={18} className="text-amber-500" /> Empréstimos (Comodato)</h3>
                 <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-[10px] font-black">04</span>
              </div>
              <div className="space-y-4">
                 <div className="p-4 border border-slate-50 bg-slate-50/30 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                       <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm"><Package size={14} /></div>
                       <div>
                          <p className="text-xs font-black text-slate-700">Cadeira de Rodas Pro</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Solicitante: João Silva</p>
                       </div>
                    </div>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10">Liberar Saída</button>
                 </div>
              </div>
           </div>

           {/* Histórico Rápido */}
           <div className="bg-slate-900 text-white rounded-[32px] p-6">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><History size={14} /> Atividade Recente</h3>
              <div className="space-y-4">
                 <div className="flex gap-3">
                    <div className="w-1 h-10 bg-emerald-500 rounded-full flex-shrink-0" />
                    <div>
                       <p className="text-[11px] font-bold">Lançamento de Entrada #TYZ4</p>
                       <p className="text-[10px] text-slate-500">142 itens adicionados por Isaque</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <div className="w-1 h-10 bg-blue-500 rounded-full flex-shrink-0" />
                    <div>
                       <p className="text-[11px] font-bold">Saída de Consumo #OUT-92</p>
                       <p className="text-[10px] text-slate-500">Separado para Cozinha Central</p>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default StockDashboard;
