
import React from 'react';
import { 
  X, 
  User, 
  ClipboardPlus, 
  FileText, 
  CalendarClock, 
  ExternalLink, 
  History,
  ChevronRight,
  Heart,
  Stethoscope,
  MapPin
} from 'lucide-react';

interface BeneficiaryServiceHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary: {
    nome: string;
    cpf: string;
    status: string;
  } | null;
  onNewRequest: () => void;
  onViewHistory: () => void;
  onSchedule: () => void;
}

const BeneficiaryServiceHubModal: React.FC<BeneficiaryServiceHubModalProps> = ({ 
  isOpen, 
  onClose, 
  beneficiary,
  onNewRequest,
  onViewHistory,
  onSchedule
}) => {
  if (!isOpen || !beneficiary) return null;

  const actions = [
    { 
      title: 'Nova Solicitação', 
      desc: 'Cestas básicas, medicamentos, fraldas ou insumos.', 
      icon: <ClipboardPlus size={24} />, 
      color: 'bg-emerald-50 text-emerald-600',
      action: onNewRequest
    },
    { 
      title: 'Prontuário Social', 
      desc: 'Ver histórico completo e evoluções do assistido.', 
      icon: <FileText size={24} />, 
      color: 'bg-blue-50 text-blue-600',
      action: onViewHistory
    },
    { 
      title: 'Agendar Visita/Ação', 
      desc: 'Marcar retorno ou visita domiciliar na agenda.', 
      icon: <CalendarClock size={24} />, 
      color: 'bg-indigo-50 text-indigo-600',
      action: onSchedule
    },
    { 
      title: 'Encaminhamento', 
      desc: 'Registrar envio para hospitais ou rede de apoio.', 
      icon: <ExternalLink size={24} />, 
      color: 'bg-rose-50 text-rose-600',
      action: () => {}
    },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-[#F8FAFC] w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col">
        {/* Header de Contexto */}
        <div className="bg-white p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 border border-slate-200">
              <User size={40} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{beneficiary.nome}</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200">
                  {beneficiary.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <FileText size={14} className="text-slate-300" /> CPF: {beneficiary.cpf}
                </p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={14} className="text-slate-300" /> Belo Horizonte - MG
                </p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Grid de Ações do Hub */}
        <div className="p-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Qual ação deseja realizar agora?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((item, idx) => (
              <button 
                key={idx}
                onClick={item.action}
                className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[32px] hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all group text-left"
              >
                <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 tracking-tight">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Banner de Ultima Interação */}
        <div className="px-8 pb-8">
           <div className="bg-white/60 border border-slate-100 p-6 rounded-[32px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl">
                    <History size={18} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Última Interação Social</p>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">Visita Domiciliar em 02/01/2026 - Realizada por Beatriz Lima</p>
                 </div>
              </div>
              <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Ver Notas</button>
           </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-center">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Heart size={14} className="text-rose-400" /> Humanizando a tecnologia para quem mais precisa
           </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryServiceHubModal;
