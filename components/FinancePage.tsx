
import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Search, 
  Plus, 
  Filter, 
  ChevronRight, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  Target,
  FileText,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';
import FinanceTransactionModal from './FinanceTransactionModal';

type FinanceTab = 'fluxo' | 'centros' | 'indicadores';

interface Transaction {
  id: string;
  data: string;
  descricao: string;
  centroCusto: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  status: 'Pago' | 'Pendente';
}

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('fluxo');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  
  const transactions: Transaction[] = [
    { id: '1', data: '06/01/2026', descricao: 'Doação Pessoa Jurídica - Rodarte', centroCusto: 'Doações', valor: 2500.00, tipo: 'entrada', status: 'Pago' },
    { id: '2', data: '05/01/2026', descricao: 'Pagamento Internet Fibra', centroCusto: 'Administrativo', valor: 149.90, tipo: 'saida', status: 'Pago' },
    { id: '3', data: '05/01/2026', descricao: 'Manutenção Van Unidade Norte', centroCusto: 'Manutenção', valor: 850.00, tipo: 'saida', status: 'Pendente' },
    { id: '4', data: '04/01/2026', descricao: 'Emenda Parlamentar - Saúde', centroCusto: 'Projetos', valor: 15000.00, tipo: 'entrada', status: 'Pago' },
    { id: '5', data: '04/01/2026', descricao: 'Compra Insumos Médicos', centroCusto: 'Enfermaria', valor: 1200.00, tipo: 'saida', status: 'Pago' },
  ];

  const costCenters = [
    { nome: 'Administrativo', orcamento: 5000, gasto: 1200, cor: 'bg-blue-500' },
    { nome: 'Projetos Sociais', orcamento: 20000, gasto: 15400, cor: 'bg-indigo-500' },
    { nome: 'Manutenção', orcamento: 3000, gasto: 2850, cor: 'bg-amber-500' },
    { nome: 'Logística', orcamento: 8000, gasto: 3200, cor: 'bg-emerald-500' },
  ];

  const renderFluxo = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Saldo Atual', value: 'R$ 42.850,00', icon: <Wallet size={20} />, color: 'bg-[#1E40AF] text-white' },
          { label: 'Entradas (Mês)', value: 'R$ 17.500,00', icon: <ArrowDownLeft size={20} />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Saídas (Mês)', value: 'R$ 2.199,90', icon: <ArrowUpRight size={20} />, color: 'bg-rose-50 text-rose-600' },
          { label: 'A Pagar', value: 'R$ 850,00', icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between h-32 ${stat.color.includes('white') ? stat.color : 'bg-white'}`}>
             <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color.includes('white') ? 'text-blue-100' : 'text-slate-400'}`}>{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.color.includes('white') ? 'bg-white/10' : stat.color}`}>{stat.icon}</div>
             </div>
             <p className="text-xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabela de Movimentações */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <h2 className="text-xl font-bold text-slate-800">Fluxo de Caixa</h2>
             <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Janeiro 2026</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="text" placeholder="Buscar lançamento..." className="w-full md:w-64 h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-400 transition-all" />
             </div>
             <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-white transition-all"><Filter size={18} /></button>
             <button 
              onClick={() => setIsTransactionModalOpen(true)}
              className="flex items-center gap-2 px-8 py-3 bg-[#1E40AF] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-95"
             >
                <Plus size={18} /> Novo
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">DATA</th>
                <th className="px-8 py-5">DESCRIÇÃO / CENTRO DE CUSTO</th>
                <th className="px-8 py-5">VALOR</th>
                <th className="px-8 py-5">STATUS</th>
                <th className="px-8 py-5 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-500">{t.data}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div>
                       <p className="text-sm font-black text-slate-700">{t.descricao}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{t.centroCusto}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-sm font-black ${t.tipo === 'entrada' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.tipo === 'entrada' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.status === 'Pago' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {t.status}
                     </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCentros = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {costCenters.map((cc, i) => {
        const percent = Math.min((cc.gasto / cc.orcamento) * 100, 100);
        return (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 group hover:border-blue-200 transition-all">
             <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${cc.cor} text-white shadow-lg shadow-blue-500/10`}>
                   <Target size={20} />
                </div>
                <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">{cc.nome}</h3>
                <p className="text-xs text-slate-400 font-medium">Orçamento do período</p>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between items-end">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progresso</span>
                   <span className="text-sm font-black text-slate-700">{percent.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className={`${cc.cor} h-full rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
                </div>
                <div className="flex justify-between items-center pt-2">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Utilizado</p>
                      <p className="text-sm font-bold text-slate-800">R$ {cc.gasto.toLocaleString()}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
                      <p className="text-sm font-bold text-slate-400">R$ {cc.orcamento.toLocaleString()}</p>
                   </div>
                </div>
             </div>
          </div>
        );
      })}
      <button className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-[#1E40AF] hover:text-[#1E40AF] transition-all group">
         <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
            <Plus size={32} />
         </div>
         <span className="font-bold text-sm uppercase tracking-widest">Novo Centro de Custo</span>
      </button>
    </div>
  );

  const renderIndicadores = () => (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm h-[400px] flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h2 className="text-xl font-bold text-slate-800">Evolução Financeira</h2>
                 <p className="text-xs text-slate-400 font-medium">Comparativo mensal de receitas e despesas</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#1E40AF] rounded-full" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Receitas</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-rose-400 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Despesas</span>
                 </div>
              </div>
           </div>
           <div className="flex-1 flex items-end gap-3 opacity-40">
              {[60, 40, 80, 50, 90, 70, 45, 65, 30, 85, 95, 60].map((h, i) => (
                <div key={i} className="flex-1 space-y-1">
                   <div className="bg-[#1E40AF] rounded-t-lg" style={{ height: `${h}%` }} />
                   <div className="bg-rose-400 rounded-t-lg" style={{ height: `${h * 0.4}%` }} />
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-4 px-2">
              {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map(m => (
                <span key={m} className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{m}</span>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#1E40AF] text-white p-8 rounded-[32px] shadow-xl shadow-blue-200">
              <h3 className="font-bold text-sm mb-4">Meta de Arrecadação</h3>
              <div className="flex justify-between items-end mb-4">
                 <span className="text-4xl font-black tracking-tight">R$ 15k</span>
                 <span className="text-xs font-bold text-blue-200">75% da meta</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                 <div className="bg-white h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
              <p className="text-[10px] text-blue-100 font-medium mt-6 leading-relaxed">Faltam R$ 3.750,00 para atingir o objetivo mensal de doações recorrentes.</p>
           </div>
           
           <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Relatórios Disponíveis</h3>
              <div className="space-y-4">
                 {[
                   { name: 'DRE Sintético', icon: <FileText size={16} /> },
                   { name: 'Balancete Geral', icon: <PieChart size={16} /> },
                   { name: 'Extrato Bancário', icon: <Wallet size={16} /> }
                 ].map((report, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all group">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-lg text-slate-300 group-hover:text-blue-500">{report.icon}</div>
                         <span className="text-xs font-bold uppercase tracking-wider">{report.name}</span>
                      </div>
                      <Download size={16} className="text-slate-300 group-hover:text-blue-500" />
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full relative min-h-screen pb-20">
      {/* Header do Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#1E40AF] text-white rounded-[24px] shadow-lg shadow-blue-500/20">
            <DollarSign size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Módulo Financeiro</h1>
            <p className="text-sm text-slate-400 font-medium">Gestão de recursos, transparência e controle de caixa.</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl shadow-inner overflow-x-auto scrollbar-hide border border-slate-100">
          <button 
            onClick={() => setActiveTab('fluxo')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === 'fluxo' ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Fluxo de Caixa
          </button>
          <button 
            onClick={() => setActiveTab('centros')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === 'centros' ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Centros de Custo
          </button>
          <button 
            onClick={() => setActiveTab('indicadores')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === 'indicadores' ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Indicadores & Relatórios
          </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'fluxo' && renderFluxo()}
        {activeTab === 'centros' && renderCentros()}
        {activeTab === 'indicadores' && renderIndicadores()}
      </div>

      {/* Modais */}
      <FinanceTransactionModal 
        isOpen={isTransactionModalOpen} 
        onClose={() => setIsTransactionModalOpen(false)} 
        onSave={() => setIsTransactionModalOpen(false)} 
      />

      {/* Footer Info Banner */}
      <div className="fixed bottom-12 right-12 z-10 animate-in slide-in-from-right-10 duration-500 hidden md:block">
         <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conciliação Bancária</p>
               <p className="text-xs font-bold">Última atualização: Hoje, 14:35</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FinancePage;
