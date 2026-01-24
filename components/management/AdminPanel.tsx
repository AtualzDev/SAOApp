
import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  CreditCard, 
  History, 
  Plus, 
  Search, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  Building2, 
  Clock, 
  Download,
  AlertCircle,
  Mail,
  Smartphone
} from 'lucide-react';

type AdminTab = 'users' | 'clinic' | 'billing' | 'logs';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  // Mock Users Data
  const [users] = useState([
    { id: 1, name: 'Márcio Andrei', email: 'marcio.andrei@email.com', role: 'Proprietário', status: 'Ativo', lastLogin: 'Hoje, 10:30' },
    { id: 2, name: 'Bernadete Araujo', email: 'bernadete.a@email.com', role: 'Fisioterapeuta', status: 'Ativo', lastLogin: 'Ontem, 16:45' },
    { id: 3, name: 'Rodrigo Mesquita', email: 'rodrigo.m@email.com', role: 'Fisioterapeuta', status: 'Ativo', lastLogin: '12/10/2025' },
    { id: 4, name: 'Natalia Siqueira', email: 'natalia.p@email.com', role: 'Secretária', status: 'Inativo', lastLogin: '05/09/2025' },
  ]);

  return (
    <div className="flex flex-col h-full animate-fadeIn pb-10">
      
      {/* Tab Navigation */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex mb-8 overflow-x-auto max-w-full shrink-0">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'users' ? 'bg-[#7B61FF] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
        >
          <Users size={18} /> Equipe e Usuários
        </button>
        <button 
          onClick={() => setActiveTab('clinic')}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'clinic' ? 'bg-[#7B61FF] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
        >
          <Building2 size={18} /> Dados da Clínica
        </button>
        <button 
          onClick={() => setActiveTab('billing')}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'billing' ? 'bg-[#7B61FF] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
        >
          <CreditCard size={18} /> Plano e Faturas
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'logs' ? 'bg-[#7B61FF] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
        >
          <History size={18} /> Auditoria / Logs
        </button>
      </div>

      <div className="flex-1">
        
        {/* === ABA: USUÁRIOS === */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn">
             <div className="flex justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar por nome ou email..." 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7B61FF] outline-none shadow-sm"
                    />
                </div>
                <button className="bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap">
                    <Plus size={20} /> Convidar Membro
                </button>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Usuário</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cargo / Nível</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Último Acesso</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-[#7B61FF] flex items-center justify-center font-bold text-xs">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{u.name}</p>
                                            <p className="text-xs text-gray-500 font-medium">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600 font-medium flex items-center gap-1.5">
                                        <Shield size={14} className="text-indigo-400" />
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${u.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {u.status === 'Ativo' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                        {u.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                    {u.lastLogin}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>
        )}

        {/* === ABA: DADOS DA CLÍNICA === */}
        {activeTab === 'clinic' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Building2 size={20} className="text-[#7B61FF]" /> Informações Gerais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Nome da Unidade / Razão Social</label>
                            <input type="text" defaultValue="Clínica Fisionline Central" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF] transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">CNPJ</label>
                            <input type="text" defaultValue="12.345.678/0001-90" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF] transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Email Institucional</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="email" defaultValue="contato@fisionline.com.br" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF] transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Telefone/WhatsApp</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" defaultValue="(11) 4567-8901" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF] transition-all" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button className="bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold px-8 py-2.5 rounded-xl shadow-md transition-all">Salvar Alterações</button>
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-[#7B61FF]" /> Horário de Funcionamento
                    </h3>
                    <div className="space-y-4">
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(day => (
                            <div key={day} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <span className="font-medium text-gray-700 w-32">{day}</span>
                                <div className="flex items-center gap-3">
                                    <input type="text" defaultValue="08:00" className="w-20 text-center px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                                    <span className="text-gray-400">até</span>
                                    <input type="text" defaultValue="18:00" className="w-20 text-center px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#7B61FF] focus:ring-[#7B61FF]" />
                                    <span className="text-xs font-bold text-gray-500 uppercase">Aberto</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                    <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400 hover:border-[#7B61FF] hover:text-[#7B61FF] transition-all cursor-pointer">
                        <Plus size={32} />
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Logo da Clínica</h4>
                    <p className="text-xs text-gray-500 px-4">PNG ou JPG até 2MB. Recomendado fundo transparente.</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="text-amber-500 shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-amber-800 text-sm mb-1">Backup do Sistema</h4>
                        <p className="text-xs text-amber-700 leading-relaxed">O backup é realizado automaticamente a cada 24 horas. Para solicitar uma exportação manual, entre em contato com o suporte.</p>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* === ABA: PLANO E FATURAS === */}
        {activeTab === 'billing' && (
          <div className="space-y-8 animate-fadeIn">
             {/* Current Plan Highlight */}
             <div className="bg-gradient-to-r from-[#7B61FF] to-indigo-600 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <span className="bg-white/20 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">Plano Atual</span>
                        <h3 className="text-4xl font-black mt-4 tracking-tight">Fisionline Premium</h3>
                        <p className="text-indigo-100 mt-2 font-medium">Assinado desde: 15 de Janeiro, 2025</p>
                        <div className="flex gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-sm font-bold">
                                4 / 10 Fisioterapeutas
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-sm font-bold">
                                ZapFisio Ativo
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 text-center text-slate-800 min-w-[240px] shadow-2xl">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-1">Próximo Vencimento</p>
                        <p className="text-lg font-black">15 de Nov, 2025</p>
                        <p className="text-3xl font-black text-[#7B61FF] mt-4 tracking-tighter">R$ 69,90</p>
                        <button className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-100">Atualizar Plano</button>
                    </div>
                </div>
             </div>

             {/* Invoice History */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Histórico de Faturas</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Referência</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Data Pagto</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Valor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Método</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Nota Fiscal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { ref: 'Outubro 2025', date: '15/10/2025', val: 'R$ 69,90', method: 'Cartão de Crédito' },
                                { ref: 'Setembro 2025', date: '15/09/2025', val: 'R$ 69,90', method: 'Cartão de Crédito' },
                                { ref: 'Agosto 2025', date: '15/08/2025', val: 'R$ 69,90', method: 'PIX' },
                            ].map((inv, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{inv.ref}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{inv.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{inv.val}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{inv.method}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[#7B61FF] hover:bg-indigo-50 p-2 rounded-lg transition-colors" title="Baixar PDF">
                                            <Download size={18} />
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

        {/* === ABA: AUDITORIA / LOGS === */}
        {activeTab === 'logs' && (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                    <History className="text-[#7B61FF]" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">Atividades Recentes do Sistema</h3>
                </div>
                <div className="space-y-4">
                    {[
                        { time: '10:45', user: 'Márcio Andrei', action: 'Alterou o valor do procedimento "Pilates 2x"', type: 'financial' },
                        { time: '09:12', user: 'Bernadete Araujo', action: 'Excluiu o agendamento de "Ademar Soares"', type: 'agenda' },
                        { time: '08:05', user: 'Márcio Andrei', action: 'Efetuou login no sistema', type: 'auth' },
                        { time: 'Ontem, 18:20', user: 'Rodrigo Mesquita', action: 'Finalizou a avaliação de "Ana Maria Silva"', type: 'eval' },
                        { time: 'Ontem, 17:15', user: 'Márcio Andrei', action: 'Desativou o usuário "Natalia Siqueira"', type: 'admin' },
                    ].map((log, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                            <div className="w-10 text-xs font-bold text-gray-400 mt-1">{log.time}</div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800 font-medium">
                                    <span className="font-bold">{log.user}</span> {log.action}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#7B61FF] bg-indigo-50 px-2 py-0.5 rounded">
                                        #{log.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="mt-8 w-full py-3 text-sm font-bold text-gray-500 hover:text-[#7B61FF] border-t border-gray-50 transition-colors uppercase tracking-widest">
                    Carregar mais registros
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
