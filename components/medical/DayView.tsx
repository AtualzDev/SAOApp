import React from 'react';
import { CalendarEvent } from '../../types';
import { getCalendarData } from '../../utils/mockData';
import { Clock, MoreVertical } from 'lucide-react';

interface DayViewProps {
   currentDate: Date;
   onAddEvent: (date: Date, time: string) => void;
   onEventClick?: (event: CalendarEvent) => void;
}

export const DayView: React.FC<DayViewProps> = ({ currentDate, onAddEvent, onEventClick }) => {
   // Generate hours from 06:00 to 22:00
   const hours = Array.from({ length: 17 }, (_, i) => i + 6);

   // Get events for this specific day
   const monthData = getCalendarData(currentDate.getFullYear(), currentDate.getMonth());
   const dayData = monthData.find(d => d.day === currentDate.getDate() && d.month === 'current');
   const events = dayData?.events || [];

   const getEventsForHour = (hour: number) => {
      return events.filter(e => {
         const eventHour = parseInt(e.time.split(':')[0]);
         return eventHour === hour;
      });
   };

   const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full animate-fadeIn">
         {/* Header */}
         <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-bold text-gray-800">
                  {weekDays[currentDate.getDay()]}, {currentDate.getDate()} de {currentDate.toLocaleString('pt-BR', { month: 'long' })}
               </h2>
               <p className="text-sm text-gray-500">Programação diária detalhada</p>
            </div>
            <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
               {events.length} atendimentos
            </div>
         </div>

         {/* Timeline */}
         <div className="overflow-y-auto custom-scrollbar flex-1 relative">
            {/* Current Time Indicator (Visual only, fixed at 09:15 for demo) */}
            <div className="absolute left-0 right-0 top-[220px] z-10 flex items-center pointer-events-none">
               <div className="w-16 text-right pr-2 text-xs font-bold text-red-500">09:15</div>
               <div className="flex-1 h-[1px] bg-red-500"></div>
               <div className="w-2 h-2 rounded-full bg-red-500 -ml-1"></div>
            </div>

            {hours.map((hour) => {
               const hourEvents = getEventsForHour(hour);

               return (
                  <div key={hour} className="flex min-h-[100px] group border-b border-gray-100 last:border-0">
                     {/* Time Label */}
                     <div className="w-16 shrink-0 border-r border-gray-100 py-3 pr-3 text-right text-xs font-semibold text-gray-500 bg-gray-50/30">
                        {String(hour).padStart(2, '0')}:00
                     </div>

                     {/* Content Slot */}
                     <div
                        className="flex-1 p-2 relative hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => onAddEvent(currentDate, `${hour}:00`)}
                     >
                        {/* Add Button on Hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                           <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded font-bold">+ Adicionar</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2 relative z-10">
                           {hourEvents.map((event) => (
                              <div
                                 key={event.id}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    if (onEventClick) onEventClick(event);
                                 }}
                                 className={`
                                p-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex justify-between items-start
                                ${event.color === 'yellow' ? 'bg-amber-50 border-amber-400 text-amber-900' :
                                       event.color === 'red' ? 'bg-red-50 border-red-500 text-red-900' :
                                          event.color === 'cyan' ? 'bg-cyan-50 border-cyan-400 text-cyan-900' :
                                             'bg-emerald-50 border-emerald-500 text-emerald-900'}
                              `}
                              >
                                 <div>
                                    <div className="flex items-center gap-2 mb-1">
                                       <span className="font-bold text-sm bg-white/50 px-1.5 rounded">{event.time}</span>
                                       <span className="font-bold text-sm">{event.patientName}</span>
                                    </div>
                                    <p className="text-xs opacity-80 pl-1">{event.procedure || 'Fisioterapia Geral'}</p>
                                 </div>
                                 <button className="text-black/20 hover:text-black/60">
                                    <MoreVertical size={16} />
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
};