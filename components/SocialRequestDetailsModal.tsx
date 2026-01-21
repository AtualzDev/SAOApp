
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Package, 
  Clock, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Truck,
  ArrowRight,
  ClipboardList,
  ChevronRight,
  ChevronDown,
  FileText,
  MapPin,
  ListChecks
} from 'lucide-react';

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
  request: {
    id: string;
    date: string;
    user: string;
    beneficiary: string;
    items: string;
    status: string;
  } | null;
}

const SocialRequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ isOpen, onClose, onEdit, onCancel, request }) => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  if (!isOpen || !request) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregue': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'Aguardando': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'Em Separação': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Cancelado': return 'bg-rose-100 text-rose-600 border-rose-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const steps = [
    { label: 'Solicitado', date: request.date, time: '09:00', completed: true, active: false },
    { label: 'Aprovado', date: request.date, time: '10:15', completed: true, active: false },
    { label: 'Em Separação', date: request.date, time: '14:30', completed: request.status === 'Em Separação' || request.status === 'Entregue', active: request.status === 'Em Separação' },
    { label: 'Entregue', date: '-', time: '-', completed: request.status === 'Entregue', active: false },
  ];

  const basicBasketItems = ["Arroz Agulhinha (5kg)", "Feijão Carioca (1kg)", "Açúcar Refinado (1kg)", "Óleo de Soja (900ml)", "Macarrão Espaguete (500g)", "Café Moído (250g)", "Sal Refinado (1kg)", "Farinha de Trigo (1kg)"];

  const toggleExpand = (index: number) => setExpandedItem(expandedItem === index ? null : index);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-[#F8FAFC] w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="bg-white p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ClipboardList size={24} /></div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Solicitação #{request.id.padStart(4, '0')}</h2>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(request.status)}`}>{request.status}</span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Criado em {request.date} por {request.user}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-2xl transition-all"><Printer size={20} /></button>
            <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-2xl transition-all"><X size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start relative px-4">
              <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-100" />
              {steps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-3 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all ${step.completed ? 'bg-emerald-500 text-white' : step.active ? 'bg-blue-600 text-white scale-110' : 'bg-slate-200 text-slate-400'}`}>
                    {step.completed ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-black uppercase tracking-widest ${step.active || step.completed ? 'text-slate-700' : 'text-slate-400'}`}>{step.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{step.date} {step.time !== '-' ? '• ' + step.time : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><User size={16} className="text-blue-500" /> Informações do Assistido</h3>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 border border-slate-200"><User size={32} /></div>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4 flex-1">
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome do Paciente</p><p className="text-sm font-black text-slate-800 mt-0.5">{request.beneficiary}</p></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CPF / Documento</p><p className="text-sm font-bold text-slate-600 mt-0.5">000.000.000-00</p></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Endereço de Entrega</p><p className="text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-1"><MapPin size={14} className="text-slate-300" /> Rua das Flores, 123 - Centro</p></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contato</p><p className="text-sm font-bold text-slate-600 mt-0.5">(31) 9 9988-7766</p></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Package size={16} className="text-blue-500" /> Itens da Solicitação</h3>
                <div className="space-y-4">
                  {request.items.split(',').map((itemStr, i) => {
                    const [qty, ...nameParts] = itemStr.trim().split(' ');
                    const name = nameParts.join(' ');
                    const isBasket = name.toLowerCase().includes('cesta básica');
                    const isExpanded = expandedItem === i;
                    return (
                      <div key={i} className="flex flex-col gap-2">
                        <div onClick={() => isBasket && toggleExpand(i)} className={`flex items-center justify-between p-4 bg-slate-50 rounded-2xl border transition-all ${isBasket ? 'cursor-pointer hover:border-blue-300 hover:bg-blue-50/30' : 'border-slate-100'}`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-black">{qty}</div>
                            <span className="text-sm font-bold text-slate-700">{name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-full uppercase tracking-widest">Em Estoque</span>
                            {isBasket && <div className={`p-1.5 rounded-lg bg-white shadow-sm text-blue-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown size={14} /></div>}
                          </div>
                        </div>
                        {isBasket && isExpanded && (
                          <div className="mx-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-inner animate-in slide-in-from-top-2 duration-300 space-y-3">
                            <div className="flex items-center gap-2 mb-3 border-b border-slate-50 pb-2"><ListChecks size={14} className="text-blue-500" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conteúdo da Cesta</span></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">{basicBasketItems.map((basketItem, bIdx) => (<div key={bIdx} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /><span className="text-xs font-semibold text-slate-500">{basketItem}</span></div>))}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-blue-600 p-6 rounded-[32px] text-white shadow-xl shadow-blue-500/20">
                <h4 className="font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Truck size={18} /> Próximo Passo</h4>
                <p className="text-sm font-medium text-blue-100 mb-6">{request.status === 'Aguardando' ? 'Aprovar solicitação e enviar para o estoque iniciar a separação.' : request.status === 'Em Separação' ? 'Confirmar recebimento dos itens e realizar a baixa final.' : 'Solicitação concluída com sucesso.'}</p>
                <button className="w-full py-3 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                  {request.status === 'Aguardando' ? 'Aprovar Agora' : request.status === 'Em Separação' ? 'Confirmar Entrega' : 'Ver Relatório'}
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Anotações Sociais</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50/50 rounded-2xl text-[11px] text-slate-500 font-medium italic border border-slate-100">"Assistido relatou necessidade urgente devido ao agravamento do quadro clínico. Prioridade máxima na separação."</div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><AlertCircle size={14} className="text-amber-500" /> Editado em 06/01 por Beatriz Lima</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <button 
                  onClick={onCancel}
                  className="py-3 px-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
                 >
                    Cancelar
                 </button>
                 <button 
                  onClick={onEdit}
                  className="py-3 px-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all"
                 >
                    Editar
                 </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border-t border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><FileText size={14} /> ID do Documento: SAO-REQ-{request.id.padStart(5, '0')}</div>
           <p className="text-[10px] text-slate-300 font-medium">© 2026 Plataforma SAO - Segurança e Transparência</p>
        </div>
      </div>
    </div>
  );
};

export default SocialRequestDetailsModal;
