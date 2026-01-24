
import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Clock, X, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'warning', title: 'Estoque Baixo', message: 'Arroz Integral 5kg atingiu o estoque mínimo de 10 unidades.', time: 'há 5 min', isRead: false },
  { id: '2', type: 'success', title: 'Entrada Confirmada', message: 'Doação de CAPEC SEDE registrada com sucesso no sistema.', time: 'há 2 horas', isRead: false },
  { id: '3', type: 'info', title: 'Agenda Atualizada', message: 'A triagem social do setor B foi reagendada para amanhã às 09h.', time: 'há 4 horas', isRead: true },
  { id: '4', type: 'warning', title: 'Vencimento Próximo', message: 'Lote #8821 de Leite Integral vence em 3 dias.', time: 'há 6 horas', isRead: true },
];

interface NotificationPopoverProps {
  onClose: () => void;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ onClose }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={18} />;
      case 'info': return <Info className="text-blue-500" size={18} />;
      default: return <Bell size={18} />;
    }
  };

  return (
    <div className="absolute bottom-24 left-72 ml-4 w-96 bg-white rounded-[24px] shadow-2xl border border-slate-200 z-[100] overflow-hidden animate-in slide-in-from-left-4 fade-in duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
           <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Bell size={18} />
           </div>
           <h3 className="font-bold text-slate-800">Notificações</h3>
           <span className="bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">2</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Limpar tudo">
            <Trash2 size={16} />
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div key={notif.id} className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer group ${!notif.isRead ? 'bg-indigo-50/20' : ''}`}>
            <div className="flex gap-3">
              <div className="flex-shrink-0 pt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold truncate ${!notif.isRead ? 'text-slate-800' : 'text-slate-600'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2 flex items-center gap-1">
                    <Clock size={10} /> {notif.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {notif.message}
                </p>
                {!notif.isRead && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Nova</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
        <button className="text-xs font-bold text-indigo-600 hover:underline">
          Ver todas as atividades do sistema
        </button>
      </div>
    </div>
  );
};

export default NotificationPopover;
