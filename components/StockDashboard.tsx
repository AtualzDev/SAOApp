
import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CalendarClock, 
  ClipboardList, 
  ArrowUpRight, 
  Timer,
  ShoppingBag,
  History,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Clock,
  BarChart3,
  FileText,
  Bell,
  Box,
  Truck
} from 'lucide-react';

interface StockDashboardProps {
  onNavigate: (id: string) => void;
}

type StockSubView = 'indicadores' | 'graficos' | 'relatorios';

const StockDashboard: React.FC<StockDashboardProps> = ({ onNavigate }) => {
  const [activeSubView, setActiveSubView] = useState<StockSubView>('indicadores');

  const stats = [
    { id: 'produtos', label: 'Total em Estoque', value: '1.284', sub: '+12 hoje', icon: <Package size={24} />, color: 'bg-blue-50 text-blue-600' },
    { id: 'produtos', label: 'Estoque Crítico', value: '08', sub: 'Abaixo do mín.', icon: <AlertTriangle size={24} />, color: 'bg-rose-50 text-rose-600' },
    { id: 'auditoria', label: 'Vencimentos Próximos', value: '14', sub: 'Próximos 15 dias', icon: <CalendarClock size={24} />, color: 'bg-amber-50 text-amber-600' },
    { id: 'saidas', label: 'Solicitações Pendentes', value: '23', sub: 'Aguardando ação', icon: <ClipboardList size={24} />, color: 'bg-indigo-50 text-indigo-600' },
  ];

  const nearExpiration = [
    { id: '1', item: 'Leite Integral 1L', lote: '#L8821', vencimento: '12/01/2026', dias: 6, status: 'critico' },
    { id: '2', item: 'Fralda G Confort', lote: '#F2023', vencimento: '20/01/2026', dias: 14, status: 'alerta' },
  ];

  const lowStock = [
    { id: '1', item: 'Arroz Integral 5kg', atual: 8, min: 15, status: 'critico' },
    { id: '2', item: 'Sabonete Glicerina', atual: 20, min: 25, status: 'alerta' },
  ];

  const subMenu = [
    { id: 'indicadores', label: 'Indicadores', icon: <TrendingUp size={16} /> },
    { id: 'graficos', label: 'Gráficos', icon: <BarChart3 size={16} /> },
    { id: 'relatorios', label: 'Relatórios', icon: <FileText size={16} /> },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header com Status e Data */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Painel Operacional do Estoque</h1>
          <p className="text-sm text-slate-400 font-medium">Controle de validade, liberações e giro de mercadorias.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
           <div className="px-4 py-2 flex items-center gap-2 border-r border-slate-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistema Online</span>
           </div>
           <div className="px-4 py-2 flex items-center gap-2">
              <CalendarClock size={16} className="text-blue-600" />
              <span className="text-xs font-bold text-slate-600">06 Jan, 2026</span>
           </div>
        </div>
      </div>

      {/* Sub-menu de Navegação Interna */}
      <div className="border-b border-slate-100 pb-0.5">
        <div className="flex gap-8">
          {subMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSubView(item.id as StockSubView)}
              className={`pb-4 flex items-center gap-2 text-sm font-bold transition-all relative ${
                activeSubView === item.id ? 'text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.icon}
              {item.label}
              {activeSubView === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E40AF] rounded-full animate-in slide-in-from-left-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeSubView === 'indicadores' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUNA PRINCIPAL (ESQUERDA) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Stats Grid - Horizontal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <button 
                  key={i} 
                  onClick={() => onNavigate(stat.id)}
                  className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                      {stat.icon}
                    </div>
                    <ArrowUpRight size={20} className="text-slate-200 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">{stat.label}</p>
                  <div className="flex items-end gap-2 mt-2">
                     <span className="text-3xl font-black text-slate-800 leading-none">{stat.value}</span>
                     <span className="text-[10px] font-bold text-slate-400 mb-0.5">{stat.sub}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Próximos Vencimentos */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Próximos Vencimentos</h2>
                  <p className="text-xs text-slate-400 font-medium">Itens que precisam ser distribuídos com prioridade</p>
                </div>
                <div className="p-3 bg-slate-50 text-slate-300 rounded-2xl"><Timer size={20} /></div>
              </div>
              <div className="p-8 space-y-4">
                {nearExpiration.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-slate-100 group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${
                        item.status === 'critico' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        <span className="text-lg font-black leading-none">{item.dias}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Dias</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.item}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Lote: {item.lote} • Vence em {item.vencimento}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all">
                      Ver Lote <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Produtos com Estoque Baixo */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Produtos com estoque baixo</h2>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest font-black">Estoque Crítico</p>
                </div>
                <div className="p-3 bg-slate-50 text-slate-300 rounded-2xl"><AlertTriangle size={20} /></div>
              </div>
              <div className="p-8 space-y-4">
                {lowStock.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${
                        item.status === 'critico' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        <span className="text-lg font-black leading-none">{item.atual}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest">UN.</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.item}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Estoque Mínimo: {item.min} • Faltam {(item.min - item.atual)} un.</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-[#1E40AF] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10 hover:bg-blue-800 transition-all">
                      Repor agora
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SIDEBAR (DIREITA) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Ultimas Solicitações */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Truck size={18} className="text-[#1E40AF]" /> Últimas solicitações
                </h3>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="p-5 border border-slate-100 bg-slate-50/30 rounded-[24px] hover:border-blue-100 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">#REQ-023{i}</span>
                       <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1"><Clock size={10} /> Há {i + 1}h</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 mb-1">Cesta Básica + Kit Higiene</p>
                    <p className="text-[10px] text-slate-400 font-medium">Para: Maria Auxiliadora dos Santos</p>
                    <div className="mt-4 flex justify-end">
                       <button className="p-2 bg-white border border-slate-100 text-slate-400 rounded-xl group-hover:text-blue-600 group-hover:border-blue-200 transition-all">
                        <ArrowUpRight size={16} />
                       </button>
                    </div>
                  </div>
                ))}
                <button className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">
                  Ver todas solicitações
                </button>
              </div>
            </div>

            {/* Notificações do Operador */}
            <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Bell size={18} className="text-amber-400" /> Notificações
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 items-start pb-6 border-b border-white/5">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <History size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">Auditoria agendada</p>
                    <p className="text-[10px] text-slate-400 mt-1">Conferência do Setor B amanhã às 08:30h.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Box size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">Lote liberado</p>
                    <p className="text-[10px] text-slate-400 mt-1">Lançamento #TYZ4 validado pelo gestor.</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Configurar Alertas
              </button>
            </div>

          </div>

        </div>
      ) : activeSubView === 'graficos' ? (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
           <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mb-6">
              <BarChart3 size={48} />
           </div>
           <h3 className="text-2xl font-black text-slate-800">Gráficos de Movimentação</h3>
           <p className="text-sm text-slate-400 mt-2 max-w-sm">
             A análise visual de giro de estoque, sazonalidade e projeções de consumo está sendo processada.
           </p>
           <button onClick={() => setActiveSubView('indicadores')} className="mt-8 text-blue-600 font-bold hover:underline">Voltar aos Indicadores</button>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
           <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mb-6">
              <FileText size={48} />
           </div>
           <h3 className="text-2xl font-black text-slate-800">Relatórios de Impressão</h3>
           <p className="text-sm text-slate-400 mt-2 max-w-sm">
             Gere PDFs e planilhas de inventário total, auditorias de lotes e histórico de saídas por período.
           </p>
           <button className="mt-8 px-10 py-3 bg-[#1E40AF] text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20">Novo Relatório</button>
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
