
import React from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  CalendarDays, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Truck
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // Dados mockados para o Dashboard
  const atendimentosPorPeriodo = [
    { periodo: 'Manhã', disponiveis: 5, ocupados: 15, cor: 'bg-blue-500' },
    { periodo: 'Tarde', disponiveis: 2, ocupados: 18, cor: 'bg-indigo-500' },
    { periodo: 'Noite', disponiveis: 12, ocupados: 3, cor: 'bg-slate-500' },
  ];

  const rotasViagem = [
    { id: '1', destino: 'Unidade Norte - Regional', motorista: 'Carlos Silva', status: 'Em trânsito', progresso: 65 },
    { id: '2', destino: 'Centro de Distribuição', motorista: 'Ana Oliveira', status: 'Carregando', progresso: 20 },
    { id: '3', destino: 'Visita Domiciliar - Setor A', motorista: 'Marcos Souza', status: 'Planejado', progresso: 0 },
  ];

  const assistidosDoDia = [
    { id: '1', nome: 'Maria Auxiliadora', hora: '09:00', servico: 'Cesta Básica', status: 'Concluído' },
    { id: '2', nome: 'João Pereira da Silva', hora: '10:30', servico: 'Atendimento Social', status: 'Em aguardo' },
    { id: '3', nome: 'Francisca das Chagas', hora: '14:00', servico: 'Entrega de Medicamento', status: 'Pendente' },
    { id: '4', nome: 'Antônio José Santos', hora: '15:30', servico: 'Triagem Inicial', status: 'Pendente' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Painel de Controle</h1>
          <p className="text-sm text-slate-400">Bem-vindo de volta! Aqui está o resumo das atividades de hoje.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <CalendarDays size={18} className="text-[#1E40AF]" />
          <span className="text-sm font-bold text-slate-600">06 de Janeiro, 2026</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Assistidos Hoje', value: '42', icon: <Users size={24} />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Rotas Ativas', value: '08', icon: <Truck size={24} />, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Atendimentos', value: '126', icon: <CheckCircle2 size={24} />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pendências', value: '03', icon: <AlertCircle size={24} />, color: 'bg-rose-50 text-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                {stat.icon}
              </div>
              <ArrowUpRight size={20} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assistidos do Dia - Prioridade Alta */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Assistidos do Dia</h2>
              <button className="text-xs font-bold text-[#1E40AF] hover:underline">Ver agenda completa</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">Horário</th>
                    <th className="px-6 py-4">Assistido</th>
                    <th className="px-6 py-4">Serviço</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {assistidosDoDia.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                          <Clock size={14} className="text-slate-300" />
                          {item.hora}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">{item.nome}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{item.servico}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                          item.status === 'Concluído' ? 'bg-emerald-100 text-emerald-600' :
                          item.status === 'Em aguardo' ? 'bg-amber-100 text-amber-600' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rotas de Viagem */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Rotas de Viagem</h2>
            <div className="space-y-4">
              {rotasViagem.map((rota) => (
                <div key={rota.id} className="p-4 border border-slate-100 rounded-2xl hover:border-blue-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{rota.destino}</p>
                        <p className="text-xs text-slate-400">Motorista: {rota.motorista}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{rota.status}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${rota.progresso}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar do Dashboard - Atendimentos por Período */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1E40AF] text-white rounded-[24px] p-6 shadow-xl shadow-blue-900/10">
            <h3 className="font-bold text-lg mb-4">Disponibilidade</h3>
            <p className="text-blue-100 text-sm mb-6">Vagas disponíveis para atendimentos emergenciais hoje.</p>
            
            <div className="space-y-6">
              {atendimentosPorPeriodo.map((p, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>{p.periodo}</span>
                    <span>{p.disponiveis} vagas livres</span>
                  </div>
                  <div className="flex h-3 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="bg-white h-full" 
                      style={{ width: `${(p.ocupados / (p.ocupados + p.disponiveis)) * 100}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/50">
                    <span>Ocupado: {p.ocupados}</span>
                    <span>Total: {p.ocupados + p.disponiveis}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-3 bg-white text-[#1E40AF] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Gerenciar Horários
            </button>
          </div>

          <div className="bg-slate-900 text-white rounded-[24px] p-6">
            <h3 className="font-bold text-sm mb-4">Avisos do Sistema</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <p className="text-xs text-slate-300">Inventário de Cesta Básica abaixo do limite de segurança (15%).</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <p className="text-xs text-slate-300">Nova diretriz de triagem social disponível na documentação.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
