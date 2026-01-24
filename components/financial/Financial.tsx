import React, { useState } from 'react';
import { Plus, Download, CheckCircle2, Search, Filter, Printer, FileText, ChevronDown, Calendar, User } from 'lucide-react';

type FinancialTab = 'fluxo' | 'mensalidade' | 'fisioterapia' | 'profissionais';

interface Transaction {
  id: number;
  status: 'pending' | 'completed';
  date: string;
  type: 'Receita' | 'Despesa';
  description: string;
  dueDate: string;
  value: number;
}

interface MonthlyPayment {
    id: number;
    patient: string;
    dueDate: string;
    value: number;
    status: 'Pago' | 'Pendente' | 'Atrasado';
    professional: string;
    paymentDate?: string;
}

export const Financial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinancialTab>('fluxo');
  
  // Mock Data for Fluxo
  const transactions: Transaction[] = [
    { id: 1, status: 'pending', date: '29/10/2025', type: 'Receita', description: 'MARIA DA PENHA FERREIRA DOS SANTOS - ...', dueDate: '29/10/2025', value: 90.00 },
    { id: 2, status: 'pending', date: '29/10/2025', type: 'Receita', description: 'YGOR QS - FISIOTERAPIA 1', dueDate: '29/10/2025', value: 90.00 },
    { id: 3, status: 'pending', date: '30/10/2025', type: 'Receita', description: 'EDMILSON SANTOS - FISIOTERAPIA 1', dueDate: '30/10/2025', value: 90.00 },
    { id: 4, status: 'pending', date: '30/10/2025', type: 'Receita', description: 'DÓRIO CYPRESTES - FISIOTERAPIA 1', dueDate: '30/10/2025', value: 120.00 },
  ];

  // Mock Data for Mensalidade
  const monthlyPayments: MonthlyPayment[] = [
      { id: 1, patient: 'Ademar Soares', dueDate: '05/11/2025', value: 450.00, status: 'Pago', paymentDate: '05/11/2025', professional: 'Márcio Andrei' },
      { id: 2, patient: 'Ana Maria Silva', dueDate: '10/11/2025', value: 280.00, status: 'Pendente', professional: 'Bernadete A.' },
      { id: 3, patient: 'Carlos Eduardo', dueDate: '15/11/2025', value: 450.00, status: 'Atrasado', professional: 'Márcio Andrei' },
      { id: 4, patient: 'Mariana Souza', dueDate: '20/11/2025', value: 280.00, status: 'Pendente', professional: 'Natalia P.' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn pb-10">
      
      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex mb-6 overflow-x-auto max-w-full">
        <button 
          onClick={() => setActiveTab('fluxo')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'fluxo' ? 'bg-[#7B61FF] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
        >
          Fluxo de caixa
        </button>
        <button 
          onClick={() => setActiveTab('mensalidade')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'mensalidade' ? 'bg-[#7B61FF] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
        >
          Financeiro mensalidade
        </button>
        <button 
          onClick={() => setActiveTab('fisioterapia')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'fisioterapia' ? 'bg-[#7B61FF] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
        >
          Financeiro Fisioterapia
        </button>
        <button 
          onClick={() => setActiveTab('profissionais')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'profissionais' ? 'bg-[#7B61FF] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
        >
          Profissionais
        </button>
      </div>

      {/* ==================== FLUXO DE CAIXA TAB ==================== */}
      {activeTab === 'fluxo' && (
        <div className="animate-fadeIn">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-800">Fluxo de caixa</h3>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none bg-[#10B981] hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors text-sm uppercase flex items-center justify-center gap-2">
                        <Plus size={18} /> Receita
                    </button>
                    <button className="flex-1 md:flex-none bg-[#EF4444] hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors text-sm uppercase flex items-center justify-center gap-2">
                        <Plus size={18} /> Despesa
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <KPICard label="Faturamento previsto" value={7470.00} color="text-[#10B981]" />
                <KPICard label="Receita" value={45.00} color="text-[#3B82F6]" />
                <KPICard label="Despesas" value={0} color="text-[#EF4444]" />
                <KPICard label="Saldo do período" value={45.00} color="text-[#10B981]" />
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-800">Movimentação Financeira</h3>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm font-medium text-gray-600">De</span>
                    <input type="date" className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]" defaultValue="2025-10-29" />
                    <span className="text-sm font-medium text-gray-600">Até</span>
                    <input type="date" className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]" defaultValue="2025-11-28" />
                    
                    <button className="ml-2 p-2.5 border border-purple-200 text-[#7B61FF] rounded-lg hover:bg-purple-50 transition-colors">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-600 font-bold tracking-wider">
                            <th className="px-6 py-4 w-16 text-center">Status</th>
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4">Tipo</th>
                            <th className="px-6 py-4 w-1/3">Descrição</th>
                            <th className="px-6 py-4">Vencimento</th>
                            <th className="px-6 py-4 text-right">Valor</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-center">
                                    <div className="w-6 h-6 rounded-full bg-[#E11D48] text-white flex items-center justify-center mx-auto text-[10px] font-bold">
                                        <span className="sr-only">Pending</span>
                                        i
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{t.date}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{t.type}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600 truncate max-w-xs">{t.description}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{t.dueDate}</td>
                                <td className="px-6 py-4 text-sm font-bold text-[#10B981] text-right">{formatCurrency(t.value)}</td>
                                <td className="px-6 py-4 text-center">
                                    <button className="text-gray-400 hover:text-[#7B61FF] transition-colors">
                                        <CheckCircle2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {/* ==================== MENSALIDADE TAB ==================== */}
      {activeTab === 'mensalidade' && (
          <div className="animate-fadeIn space-y-6">
              
              {/* 5 KPI Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-2xl font-bold text-[#10B981]">R$ 1.460,00</h3>
                    <p className="text-xs text-gray-500 font-medium">Total de mensalidade</p>
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-2xl font-bold text-[#3B82F6]">R$ 450,00</h3>
                    <p className="text-xs text-gray-500 font-medium">Pagas</p>
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-2xl font-bold text-[#EF4444]">R$ 1.010,00</h3>
                    <p className="text-xs text-gray-500 font-medium">Pendentes</p>
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-2xl font-bold text-[#3B82F6]">R$ 0,00</h3>
                    <p className="text-xs text-gray-500 font-medium">Despesas/Pagamento</p>
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-2xl font-bold text-[#10B981]">R$ 0,00</h3>
                    <p className="text-xs text-gray-500 font-medium">Faturamento do Período</p>
                 </div>
              </div>

              {/* Filter & List Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* Filter Toolbar */}
                  <div className="p-6 border-b border-gray-200 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                      <h3 className="text-lg font-bold text-gray-800 whitespace-nowrap">Lista de Mensalidades</h3>
                      
                      <div className="flex flex-col md:flex-row items-end md:items-center gap-3 w-full xl:w-auto">
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-medium text-gray-600">De</span>
                             <input type="date" className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]" defaultValue="2025-11-21" />
                          </div>
                          
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-medium text-gray-600">Até</span>
                             <input type="date" className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]" defaultValue="2025-11-29" />
                          </div>

                          <div className="relative w-full md:w-48">
                              <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] appearance-none">
                                  <option>Filtrar por Profissional</option>
                                  <option>Márcio Andrei</option>
                                  <option>Bernadete A.</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>

                          <button className="p-2 border border-purple-200 text-[#7B61FF] rounded-lg hover:bg-purple-50 transition-colors" title="Exportar">
                              <Download size={18} />
                          </button>
                      </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead>
                              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-600 font-bold tracking-wider">
                                  <th className="px-6 py-4">Paciente</th>
                                  <th className="px-6 py-4">Profissional</th>
                                  <th className="px-6 py-4">Vencimento</th>
                                  <th className="px-6 py-4">Pagamento</th>
                                  <th className="px-6 py-4">Valor</th>
                                  <th className="px-6 py-4">Status</th>
                                  <th className="px-6 py-4 text-right">Ações</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {monthlyPayments.map((payment) => (
                                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[#7B61FF] font-bold text-xs">
                                                  {payment.patient.charAt(0)}
                                              </div>
                                              <span className="text-sm font-bold text-gray-800">{payment.patient}</span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-600">{payment.professional}</td>
                                      <td className="px-6 py-4 text-sm font-medium text-gray-600">{payment.dueDate}</td>
                                      <td className="px-6 py-4 text-sm text-gray-500">{payment.paymentDate || '-'}</td>
                                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{formatCurrency(payment.value)}</td>
                                      <td className="px-6 py-4">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border
                                              ${payment.status === 'Pago' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                                payment.status === 'Atrasado' ? 'bg-red-50 text-red-600 border-red-200' :
                                                'bg-amber-50 text-amber-600 border-amber-200'}
                                          `}>
                                              {payment.status}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                          <button className="text-gray-400 hover:text-[#7B61FF] p-1.5 transition-colors">
                                              <FileText size={18} />
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  
                  {/* Table Footer */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500 flex justify-between items-center">
                       <span>Mostrando {monthlyPayments.length} registros</span>
                       <div className="flex gap-2">
                          <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Anterior</button>
                          <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Próximo</button>
                       </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

const KPICard = ({ label, value, color }: { label: string, value: number, color: string }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className={`text-2xl font-bold mb-1 ${color}`}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            </h3>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
        </div>
    );
};