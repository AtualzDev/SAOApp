import React from 'react';
import { DayData, CalendarEvent } from '../../types';

interface CalendarGridProps {
  days: DayData[];
  selectedDay: DayData | null;
  onSelectDay: (day: DayData) => void;
  onAddEvent?: (day: DayData) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const EventItem: React.FC<{ event: CalendarEvent; onClick?: (event: CalendarEvent) => void }> = ({ event, onClick }) => {
  if (event.isMore) {
    return (
      <div className="text-[10px] text-gray-500 px-1 mt-0.5 font-medium hover:text-gray-700 transition-colors">
        +{event.moreCount} mais
      </div>
    );
  }

  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800 border-l-[3px] border-yellow-400',
    red: 'bg-red-100 text-red-800 border-l-[3px] border-red-500',
    black: 'bg-gray-800 text-white border-l-[3px] border-black',
    cyan: 'bg-cyan-100 text-cyan-800 border-l-[3px] border-cyan-400',
    gray: 'bg-gray-100 text-gray-600 border-l-[3px] border-gray-400',
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(event);
      }}
      className={`
      ${colorClasses[event.color]} 
      text-[10px] px-1.5 py-0.5 rounded-sm mb-1
      whitespace-nowrap overflow-hidden text-ellipsis
      flex items-center gap-1.5 shadow-sm hover:shadow transition-all hover:scale-105 cursor-pointer
    `}>
      <span className="font-bold tabular-nums opacity-90">{event.time}</span>
      <span className="truncate font-medium">{event.patientName}</span>
    </div>
  );
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({ days, selectedDay, onSelectDay, onAddEvent, onEventClick }) => {
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Week Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {weekDays.map((day) => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {days.map((day, index) => {
              const isLastCol = (index + 1) % 7 === 0;
              const isLastRow = index >= days.length - 7;
              const isSelected = selectedDay?.day === day.day && selectedDay?.month === day.month;

              return (
                <div
                  key={index}
                  onClick={() => onSelectDay(day)}
                  className={`
                    min-h-[140px] p-1.5 border-gray-100 relative transition-all duration-200 cursor-pointer group
                    ${!isLastCol ? 'border-r' : ''} 
                    ${!isLastRow ? 'border-b' : ''}
                    ${day.month !== 'current' ? 'bg-gray-50/80' : 'bg-white hover:bg-blue-50/50'}
                    ${isSelected ? 'bg-blue-50/80 ring-2 ring-inset ring-blue-500 z-10' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`
                      text-xs font-bold w-7 h-7 flex items-center justify-center rounded-lg transition-all
                      ${day.month !== 'current' ? 'text-gray-400' : 'text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700'}
                      ${day.isToday ? '!bg-blue-600 !text-white shadow-md' : ''}
                      ${isSelected && !day.isToday ? '!bg-blue-200 !text-blue-800' : ''}
                    `}>
                      {day.day}
                    </span>

                    {/* Quick Add Button on Hover */}
                    {day.month === 'current' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDay(day);
                          if (onAddEvent) onAddEvent(day);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-100 text-blue-600 rounded transition-all transform hover:scale-110"
                        title="Adicionar Agendamento"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    {day.events.slice(0, 5).map((event) => (
                      <EventItem key={event.id} event={event} onClick={onEventClick} />
                    ))}
                    {day.events.length > 5 && (
                      <div className="text-[10px] text-gray-400 font-medium pl-1 mt-1 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                        <span>+{day.events.length - 5} mais</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};