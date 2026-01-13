
import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, DollarSign, Calendar, Target, CheckCircle2, ChevronRight, Info } from 'lucide-react';

interface FinanceTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const FinanceTransactionModal: React.FC<FinanceTransactionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<'entrada' | 'saida'>('entrada');
  const [status, setStatus] = useState<'Pago' | 'Pendente'>('Pago');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header com Seletor de Tipo */}
        <div className="bg-white p-8 border-b border-slate-100">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nova Transação</h2>
                <p className="text-sm text-slate-400 font-medium">Registre uma movimentação no seu fluxo de caixa</p>
             </div>
             <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-all">
                <X size={24} />
             </button>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-[20px] shadow-inner">
            <button 
              onClick={() => setType('entrada')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                type === 'entrada' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ArrowDownLeft size={16} /> Entrada
            </button>
            <button 
              onClick={() => setType('saida')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                type === 'saida' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ArrowUpRight size={16} /> Saída
            </button>
          </div>
        </div>

        {/* Body do Formulário */}
        <div className="p-8 space-y-6 bg-[#F8FAFC]/50">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Descrição do Lançamento</label>
              <input 
                type="text" 
                placeholder="Ex: Doação Mensal Empresa X ou Pagamento Aluguel"
                className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[20px] text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Valor da Transação</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</div>
                  <input 
                    type="text" 
                    placeholder="0,00"
                    className="w-full h-14 pl-14 pr-6 bg-white border border-slate-200 rounded-[20px] text-lg font-black text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Data Competência</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="date" 
                    className="w-full h-14 pl-14 pr-6 bg-white border border-slate-200 rounded-[20px] text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Centro de Custo</label>
                <div className="relative">
                   <Target className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <select className="w-full h-14 pl-14 pr-6 bg-white border border-slate-200 rounded-[20px] text-sm font-bold text-slate-700 outline-none focus:border-blue-400 transition-all appearance-none cursor-pointer">
                      <option>Selecione um centro</option>
                      <option>Administrativo</option>
                      <option>Projetos Sociais</option>
                      <option>Logística</option>
                      <option>Manutenção</option>
                   </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Status de Pagamento</label>
                <div className="flex bg-white border border-slate-200 p-1.5 rounded-[20px] h-14">
                  <button 
                    onClick={() => setStatus('Pago')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      status === 'Pago' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {status === 'Pago' && <CheckCircle2 size={14} />} Pago
                  </button>
                  <button 
                    onClick={() => setStatus('Pendente')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      status === 'Pendente' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {status === 'Pendente' && <Info size={14} />} Pendente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com Ações */}
        <div className="p-8 bg-white border-t border-slate-50 flex items-center justify-between">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] max-w-[240px]">
             Todas as transações geram logs de auditoria automática
           </p>
           <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => onSave({})}
                className={`px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center gap-2 text-white ${
                  type === 'entrada' ? 'bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-500/20 hover:bg-rose-700'
                }`}
              >
                Confirmar {type === 'entrada' ? 'Entrada' : 'Saída'} <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceTransactionModal;
