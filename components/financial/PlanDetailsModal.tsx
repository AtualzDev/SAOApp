
import React from 'react';
import { X, CheckCircle2, Zap, Shield, Star, ShieldCheck } from 'lucide-react';

interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    description: string;
    features: string[];
    monthlyPrice: number;
    annualPrice: number;
    color: string;
    icon: React.ReactNode;
  } | null;
  cycle: 'monthly' | 'annually';
}

export const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({ isOpen, onClose, plan, cycle }) => {
  if (!isOpen || !plan) return null;

  const price = cycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn transition-all border border-slate-100">
        
        {/* Header with Plan Color */}
        <div className={`p-8 ${plan.id === 'profissional' ? 'bg-[#7B61FF]' : plan.id === 'premium' ? 'bg-slate-800' : 'bg-slate-100'} relative`}>
          <button 
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-full transition-all ${plan.id === 'essencial' ? 'text-slate-400 hover:bg-slate-200' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-white shadow-lg ${plan.id === 'essencial' ? 'text-slate-600' : plan.id === 'profissional' ? 'text-[#7B61FF]' : 'text-slate-800'}`}>
              {plan.icon}
            </div>
            <div>
              <h2 className={`text-3xl font-black tracking-tight ${plan.id === 'essencial' ? 'text-slate-900' : 'text-white'}`}>
                Plano {plan.name}
              </h2>
              <p className={plan.id === 'essencial' ? 'text-slate-500' : 'text-white/70'}>
                {plan.id === 'profissional' ? 'O preferido dos fisioterapeutas' : 'Solução completa e escalável'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Descrição do Plano</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {plan.id === 'essencial' && "Ideal para quem está começando e precisa de organização básica. Substitua o papel pela agenda digital e tenha o controle de seus pacientes em um só lugar."}
              {plan.id === 'profissional' && "Aumente seu faturamento e reduza faltas. Com o ZapFisio, seus pacientes recebem lembretes automáticos. O prontuário eletrônico garante segurança jurídica e praticidade total."}
              {plan.id === 'premium' && "A gestão definitiva para clínicas que pensam grande. Gerencie múltiplas unidades, acesse relatórios financeiros avançados e utilize ferramentas de marketing integradas para atrair mais pacientes."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Funcionalidades Inclusas</h3>
              <ul className="space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                    <CheckCircle2 size={18} className="text-[#7B61FF] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
                {plan.id !== 'essencial' && (
                  <li className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                    <CheckCircle2 size={18} className="text-[#7B61FF] shrink-0" />
                    <span>Suporte prioritário via chat</span>
                  </li>
                )}
              </ul>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center items-center text-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Investimento</span>
              <div className="flex items-baseline gap-1">
                <span className="text-slate-400 text-lg font-bold">R$</span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-slate-400 text-sm font-bold">/mês</span>
              </div>
              {cycle === 'annually' && (
                <span className="mt-2 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full uppercase">Economia de 20% no anual</span>
              )}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
            <Zap className="text-amber-500 shrink-0" size={24} fill="currentColor" />
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              Todos os planos incluem <strong>7 dias de teste grátis</strong>. Você pode cancelar a qualquer momento sem custos adicionais.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
          >
            Voltar
          </button>
          <button className="flex-[2] py-4 px-6 rounded-2xl bg-[#7B61FF] text-white font-black text-lg hover:bg-[#6A51E6] shadow-xl shadow-indigo-100 transition-all active:scale-95">
            Assinar Agora
          </button>
        </div>
      </div>
    </div>
  );
};
