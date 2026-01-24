
import React, { useState } from 'react';
import { Check, Info, ShieldCheck, Zap, Star, Shield, HelpCircle, CheckCircle2, LayoutList } from 'lucide-react';
import { PlanDetailsModal } from './PlanDetailsModal';

type BillingCycle = 'monthly' | 'annually';

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  color: string;
  icon: React.ReactNode;
  recommended?: boolean;
}

export const Planos: React.FC = () => {
  const [cycle, setCycle] = useState<BillingCycle>('annually');
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<Plan | null>(null);

  const plans: Plan[] = [
    {
      id: 'essencial',
      name: 'Essencial',
      description: 'Ideal para profissionais autônomos iniciando na gestão.',
      monthlyPrice: 49.90,
      annualPrice: 39.90,
      features: ['1 Profissional', 'Agenda Inteligente', 'Pacientes Ilimitados', 'Prontuário Básico', 'Financeiro Básico'],
      color: 'bg-slate-100 text-slate-600',
      icon: <Shield size={24} />
    },
    {
      id: 'profissional',
      name: 'Profissional',
      description: 'Perfeito para clínicas em crescimento com equipe.',
      monthlyPrice: 89.90,
      annualPrice: 69.90,
      features: ['Até 5 Profissionais', 'ZapFisio (Lembretes WhatsApp)', 'Financeiro Completo', 'Relatórios Avançados', 'Teleconsulta Ilimitada'],
      color: 'bg-[#7B61FF] text-white',
      recommended: true,
      icon: <Star size={24} />
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Gestão completa para grandes centros e franquias.',
      monthlyPrice: 149.90,
      annualPrice: 119.90,
      features: ['Profissionais Ilimitados', 'Multi-unidades', 'Marketing Integrado', 'Suporte Prioritário 24/7', 'Gestão de Convênios'],
      color: 'bg-slate-800 text-white',
      icon: <ShieldCheck size={24} />
    }
  ];

  const comparisonTable = [
    { feature: 'Agenda Online', plans: [true, true, true] },
    { feature: 'Prontuário Eletrônico', plans: [true, true, true] },
    { feature: 'Lembretes WhatsApp', plans: [false, true, true] },
    { feature: 'Financeiro (Fluxo de Caixa)', plans: [true, true, true] },
    { feature: 'Controle de Estoque', plans: [false, 'Opcional', true] },
    { feature: 'Teleconsulta Integrada', plans: [false, true, true] },
    { feature: 'Múltiplas Unidades', plans: [false, false, true] },
  ];

  return (
    <div className="flex flex-col h-full animate-fadeIn pb-20 overflow-y-auto no-scrollbar">
      
      {/* Header & Toggle */}
      <div className="text-center space-y-6 mb-16 mt-8 shrink-0">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight px-4">O plano ideal para sua clínica</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg px-4 font-medium">Escolha a melhor solução para automatizar seus processos e focar no que realmente importa: seus pacientes.</p>
        
        <div className="flex items-center justify-center gap-4 mt-10">
          <span className={`text-sm font-bold ${cycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Mensal</span>
          <button 
            onClick={() => setCycle(cycle === 'monthly' ? 'annually' : 'monthly')}
            className="w-16 h-8 bg-slate-200 rounded-full p-1 relative transition-all"
          >
            <div className={`w-6 h-6 bg-[#7B61FF] rounded-full shadow-md transition-all transform ${cycle === 'annually' ? 'translate-x-8' : 'translate-x-0'}`}></div>
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${cycle === 'annually' ? 'text-slate-900' : 'text-slate-400'}`}>Anual</span>
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-200">20% Desconto</span>
          </div>
        </div>
      </div>

      {/* Plans Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 w-full mb-24">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative flex flex-col p-10 rounded-[40px] border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.recommended ? 'border-[#7B61FF] bg-white ring-8 ring-indigo-50/50 shadow-xl' : 'border-slate-100 bg-white shadow-sm'}`}
          >
            {plan.recommended && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7B61FF] text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">MAIS POPULAR</span>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <div className={`p-4 rounded-2xl ${plan.color}`}>
                {plan.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
            </div>

            <p className="text-slate-500 text-sm mb-10 min-h-[40px] font-medium leading-relaxed">{plan.description}</p>

            <div className="mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-slate-400 text-lg font-bold">R$</span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {cycle === 'monthly' ? plan.monthlyPrice.toFixed(2).replace('.', ',') : plan.annualPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-slate-400 text-sm font-bold">/mês</span>
              </div>
              {cycle === 'annually' && (
                <p className="text-emerald-500 text-xs font-bold mt-2">Economize R$ {(plan.monthlyPrice - plan.annualPrice).toFixed(2).replace('.', ',')} por mês</p>
              )}
            </div>

            <ul className="space-y-4 mb-12 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                  <CheckCircle2 size={18} className="text-[#7B61FF] shrink-0 mt-0.5" />
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <button className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-95 ${plan.recommended ? 'bg-[#7B61FF] text-white shadow-indigo-100 hover:bg-[#6A51E6]' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-100'}`}>
                Assine agora
              </button>
              <button 
                onClick={() => setSelectedPlanDetails(plan)}
                className="w-full py-4 rounded-2xl font-bold text-sm transition-all text-slate-500 hover:text-[#7B61FF] hover:bg-indigo-50 flex items-center justify-center gap-2"
              >
                <LayoutList size={18} /> Detalhes do plano
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table Section */}
      <div className="max-w-7xl mx-auto w-full px-4 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Compare as funcionalidades</h2>
          <p className="text-slate-500 mt-4 font-medium">Veja em detalhes o que cada plano oferece para sua unidade.</p>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Recurso</th>
                <th className="px-8 py-6 text-center text-lg font-black text-slate-900">Essencial</th>
                <th className="px-8 py-6 text-center text-lg font-black text-[#7B61FF]">Profissional</th>
                <th className="px-8 py-6 text-center text-lg font-black text-slate-800">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonTable.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 group cursor-help">
                      <span className="font-bold text-slate-700 text-sm">{row.feature}</span>
                      <Info size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </td>
                  {row.plans.map((p, idx) => (
                    <td key={idx} className="px-8 py-6 text-center">
                      {typeof p === 'boolean' ? (
                        p ? <div className="mx-auto w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><Check size={14} /></div> : <span className="text-slate-200">—</span>
                      ) : (
                        <span className="text-[10px] font-black bg-indigo-50 text-[#7B61FF] px-2 py-1 rounded-md uppercase tracking-wider">{p}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple FAQ Footer */}
      <div className="max-w-3xl mx-auto w-full px-4 text-center">
        <div className="inline-flex p-4 bg-amber-50 rounded-full text-amber-500 mb-6">
          <HelpCircle size={32} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">Ainda tem dúvidas?</h3>
        <p className="text-slate-500 mb-8 font-medium leading-relaxed">Fale com nossos especialistas agora mesmo via WhatsApp e receba uma demonstração gratuita personalizada para sua clínica.</p>
        <button className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-emerald-600 shadow-xl shadow-emerald-100 transition-all flex items-center gap-3 mx-auto active:scale-95">
          <Zap size={20} fill="currentColor" /> Falar com Especialista
        </button>
      </div>

      {/* Plan Details Modal */}
      <PlanDetailsModal 
        isOpen={!!selectedPlanDetails}
        onClose={() => setSelectedPlanDetails(null)}
        plan={selectedPlanDetails}
        cycle={cycle}
      />

    </div>
  );
};
