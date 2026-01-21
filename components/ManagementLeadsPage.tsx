
import React, { useState } from 'react';
import { 
  Users2, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  ChevronRight,
  Target,
  ArrowUpRight,
  Star,
  Clock,
  Briefcase
} from 'lucide-react';

interface LeadData {
  id: string;
  empresa: string;
  responsavel: string;
  origem: string;
  estagio: 'Novo' | 'Contato' | 'Reunião' | 'Proposta' | 'Ganha' | 'Perdida';
  valor: number;
  probabilidade: number;
  data: string;
}

const ManagementLeadsPage: React.FC = () => {
  const [leads] = useState<LeadData[]>([
    { id: '1', empresa: 'ONG Vida Nova', responsavel: 'Dr. Roberto', origem: 'Google Ads', estagio: 'Proposta', valor: 2500, probabilidade: 75, data: '06/01/2026' },
    { id: '2', empresa: 'Instituto Esperança', responsavel: 'Carla Silva', origem: 'Instagram', estagio: 'Reunião', valor: 1200, probabilidade: 50, data: '05/01/2026' },
    { id: '3', empresa: 'Fundação Futuro', responsavel: 'Marcos Braz', origem: 'Indicação', estagio: 'Ganha', valor: 4500, probabilidade: 100, data: '04/01/2026' },
    { id: '4', empresa: 'Asilo São Vicente', responsavel: 'Irmã Maria', origem: 'Orgânico', estagio: 'Novo', valor: 800, probabilidade: 20, data: '04/01/2026' },
    { id: '5', empresa: 'Centro Social Norte', responsavel: 'Paulo Guedes', origem: 'LinkedIn', estagio: 'Contato', valor: 1500, probabilidade: 35, data: '03/01/2026' },
  ]);

  const stats = [
    { label: 'Novos Leads (Mês)', value: '64', change: '+15%', icon: <Target size={20} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Conversão SaaS', value: '18.4%', change: '+2.1%', icon: <TrendingUp size={20} />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pipeline Total', value: 'R$ 42k', change: 'Ativo', icon: <Briefcase size={20} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Reuniões Hoje', value: '05', change: 'Agenda cheia', icon: <Calendar size={20} />, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#1E40AF] text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <Users2 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pipeline de Leads</h1>
            <p className="text-sm text-slate-400 font-medium">Acompanhe a prospecção de novas instituições para a rede SAO.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm shadow-sm">
            <MessageSquare size={18} /> Automações WhatsApp
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1E40AF] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all">
            <Plus size={18} /> Novo Prospecto
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
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

      {/* Leads Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800">Funil de Vendas</h2>
            <div className="flex -space-x-2">
               {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm"><img src={`https://i.pravatar.cc/100?u=${i}`} alt="" /></div>)}
               <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">+12</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Buscar prospecto ou vendedor..." 
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
                <th className="px-8 py-5">INSTITUIÇÃO / RESPONSÁVEL</th>
                <th className="px-8 py-5">ORIGEM</th>
                <th className="px-8 py-5">ESTÁGIO</th>
                <th className="px-8 py-5">VALOR ESTIMADO</th>
                <th className="px-8 py-5">PROBABILIDADE</th>
                <th className="px-8 py-5 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{lead.empresa}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{lead.responsavel}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500">{lead.origem}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                      lead.estagio === 'Ganha' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      lead.estagio === 'Proposta' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      lead.estagio === 'Perdida' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {lead.estagio}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-700">R$ {lead.valor.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 min-w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${lead.probabilidade > 70 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${lead.probabilidade}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-slate-400">{lead.probabilidade}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-slate-300 hover:text-blue-600 transition-all"><Star size={18} /></button>
                       <button className="p-2 text-slate-300 hover:text-slate-600 transition-all"><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">Atividades Recentes</h3>
           <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {[
                { title: 'Reunião Agendada', desc: 'Demo da plataforma para ONG Vida Nova', time: 'Há 2h', icon: <Calendar size={14} />, color: 'bg-blue-500' },
                { title: 'E-mail Enviado', desc: 'Proposta comercial enviada para Dr. Roberto', time: 'Há 5h', icon: <MessageSquare size={14} />, color: 'bg-indigo-500' },
                { title: 'Novo Lead Registrado', desc: 'Lead vindo via LinkedIn - Instituto Futuro', time: 'Ontem', icon: <Users2 size={14} />, color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="relative pl-12">
                   <div className={`absolute left-0 top-0.5 w-10 h-10 rounded-full ${item.color} text-white flex items-center justify-center border-4 border-white shadow-sm z-10`}>{item.icon}</div>
                   <div className="flex items-center justify-between"><h4 className="text-sm font-bold text-slate-700">{item.title}</h4><span className="text-[10px] font-bold text-slate-400 uppercase">{item.time}</span></div>
                   <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden">
           <div className="relative z-10 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Próximo Follow-up</h3>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><Clock size={24} className="text-amber-400" /></div>
                 <div>
                    <p className="text-sm font-black tracking-tight">ONG Lar da Fraternidade</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Hoje às 15:30h</p>
                 </div>
              </div>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Iniciar Chamada <ChevronRight size={14} />
              </button>
           </div>
           <Target size={120} className="absolute -bottom-8 -right-8 text-white/5 -rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default ManagementLeadsPage;
