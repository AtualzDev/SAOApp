
import React, { useState } from 'react';
import { X, AlertTriangle, ChevronRight } from 'lucide-react';

interface CancelRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  requestId: string;
}

const CancelRequestModal: React.FC<CancelRequestModalProps> = ({ isOpen, onClose, onConfirm, requestId }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Cancelar Solicitação</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Você está prestes a cancelar a solicitação <span className="font-bold text-slate-800">#{requestId.padStart(4, '0')}</span>. 
            Esta ação não pode ser desfeita e o estoque reservado será liberado.
          </p>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Justificativa do Cancelamento</label>
            <textarea 
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo do cancelamento..."
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 text-slate-400 font-bold hover:text-slate-600 transition-all"
            >
              Voltar
            </button>
            <button 
              onClick={() => onConfirm(reason)}
              disabled={!reason.trim()}
              className="px-10 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-xl shadow-rose-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              Confirmar Cancelamento <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelRequestModal;
