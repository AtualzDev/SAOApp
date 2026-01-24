import React from 'react';
import { X, CheckCircle2, Calendar, Ban, RefreshCw, Trash2 } from 'lucide-react';
import { CalendarEvent } from '../../types';

interface EventDetailsModalProps {
   isOpen: boolean;
   onClose: () => void;
   event: CalendarEvent | null;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, event }) => {
   if (!isOpen || !event) return null;

   // Format date if available, otherwise just mock
   const dateStr = event.date
      ? event.date.toLocaleDateString('pt-BR')
      : 'Data não informada';

   // Determine status color and text
   const getStatusConfig = () => {
      switch (event.status) {
         case 'realizado': return { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Realizado', icon: <CheckCircle2 size={16} /> };
         case 'pendente': return { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Pendente', icon: <Calendar size={16} /> };
         case 'cancelado': return { bg: 'bg-red-50', text: 'text-red-600', label: 'Cancelado', icon: <Ban size={16} /> };
         case 'confirmado': return { bg: 'bg-cyan-50', text: 'text-cyan-600', label: 'Confirmado', icon: <CheckCircle2 size={16} /> };
         default: return { bg: 'bg-gray-50', text: 'text-gray-600', label: 'Desconhecido', icon: <Calendar size={16} /> };
      }
   };

   const statusConfig = getStatusConfig();

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
         />

         {/* Modal Card */}
         <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn scale-100 transition-all overflow-hidden">

            {/* Header content */}
            <div className="p-6 pb-4">
               <div className="flex justify-end absolute top-2 right-2">
                  <button
                     onClick={onClose}
                     className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                     <X size={20} />
                  </button>
               </div>

               <div className="mb-4 pr-6">
                  <h3 className="text-lg font-bold text-gray-800 uppercase leading-snug">
                     {event.patientName}
                  </h3>
                  <div className="mt-1 text-sm text-gray-600">
                     <span className="font-bold text-gray-700">Procedimento: </span>
                     {event.procedure || 'Fisioterapia Geral'}
                  </div>
                  <div className="mt-0.5 text-sm text-gray-500">
                     <span className="font-medium text-gray-600">Queixa Principal: </span>
                     {event.complaint || 'Não informada'}
                  </div>
               </div>

               <div className="border-t border-b border-gray-100 py-4 mb-4 flex items-center justify-between">
                  <div>
                     <span className="font-bold text-gray-800 text-lg">Hora: </span>
                     <span className="text-gray-700 text-base font-medium">{dateStr} - {event.time}</span>
                  </div>
                  <div className="text-right">
                     <span className="font-bold text-gray-800 text-base">Nº de sessões: </span>
                     <span className="text-gray-700 font-medium">{event.sessionNumber || 1}</span>
                  </div>
               </div>

               {/* Status Badge */}
               <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.text} font-bold text-sm`}>
                  {statusConfig.icon}
                  {statusConfig.label}
               </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-2 grid grid-cols-3 gap-3">
               <button className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-medium text-sm transition-colors">
                  <Ban size={16} />
                  Ausência
               </button>

               <button className="flex items-center justify-center gap-2 py-2 px-3 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium text-sm transition-colors">
                  <RefreshCw size={16} />
                  Reagendar
               </button>

               <button className="flex items-center justify-center gap-2 py-2 px-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors">
                  <Trash2 size={16} />
                  Excluir
               </button>
            </div>
         </div>
      </div>
   );
};