import React from 'react';
import { getCalendarData } from '../../utils/mockData';
import { DayData, CalendarEvent } from '../../types';

interface WeekViewProps {
  currentDate: Date;
  onSelectDay: (date: Date) => void;
  onAddEvent: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ currentDate, onSelectDay, onAddEvent, onEventClick }) => {
  // Calculate start of the week (Sunday or Monday based on preference, using Monday here)
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  startOfWeek.setDate(diff);

  // Generate 7 days
  const weekDaysDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDaysDates.push(d);
  }

  const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 07:00 - 21:00

  // Helper to get events for a specific date object
  const getEventsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const data = getCalendarData(year, month);
    const dayData = data.find(d => d.day === day && d.month === 'current');
    return dayData?.events || [];
  };

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full animate-fadeIn">
      <div className="overflow-x-auto flex-1 flex flex-col">
        <div className="min-w-[800px] flex-1 flex flex-col">
          {/* Header Grid */}
          <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
            <div className="p-3 border-r border-gray-200 text-center text-xs text-gray-400 font-bold uppercase py-4">
              Horário
            </div>
            {weekDaysDates.map((date, index) => {
              const isToday = new Date().toDateString() === date.toDateString();
              return (
                <div
                  key={index}
                  className={`p-2 text-center border-r border-gray-100 last:border-0 cursor-pointer hover:bg-blue-50/50 transition-colors ${isToday ? 'bg-blue-50/30' : ''}`}
                  onClick={() => onSelectDay(date)}
                >
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">{weekDays[index]}</div>
                  <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-bold ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700'}`}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Body Grid */}
          <div className="flex-1">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 min-h-[80px] border-b border-gray-100">
                {/* Time Column */}
                <div className="border-r border-gray-100 bg-gray-50/20 text-xs text-gray-400 font-medium p-2 text-center -mt-2.5">
                  {String(hour).padStart(2, '0')}:00
                </div>

                {/* Day Columns */}
                {weekDaysDates.map((date, index) => {
                  const events = getEventsForDate(date).filter(e => parseInt(e.time.split(':')[0]) === hour);

                  return (
                    <div
                      key={`${hour}-${index}`}
                      className="border-r border-gray-100 last:border-0 p-1 relative group hover:bg-gray-50 transition-colors"
                      onClick={() => onAddEvent(date)}
                    >
                      {events.map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEventClick) onEventClick(event);
                          }}
                          className={`
                                            text-[10px] p-1 rounded mb-1 border-l-2 truncate shadow-sm cursor-pointer hover:scale-105 transition-transform
                                            ${event.color === 'yellow' ? 'bg-amber-100 border-amber-400 text-amber-900' :
                              event.color === 'red' ? 'bg-red-100 border-red-500 text-red-900' :
                                event.color === 'cyan' ? 'bg-cyan-100 border-cyan-400 text-cyan-900' :
                                  'bg-emerald-100 border-emerald-500 text-emerald-900'}
                                        `}
                          title={`${event.time} - ${event.patientName}`}
                        >
                          <span className="font-bold mr-1">{event.time}</span>
                          {event.patientName}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};