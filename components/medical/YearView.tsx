import React from 'react';
import { getCalendarData } from '../../utils/mockData';

interface YearViewProps {
   currentYear: number;
   onSelectMonth: (monthIndex: number) => void;
}

export const YearView: React.FC<YearViewProps> = ({ currentYear, onSelectMonth }) => {
   const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
   ];

   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeIn h-full overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {months.map((monthName, index) => {
               // Get simple data for this month to render mini grid
               // We only need the number of days and start day
               const firstDay = new Date(currentYear, index, 1);
               const daysInMonth = new Date(currentYear, index + 1, 0).getDate();
               const startDay = firstDay.getDay(); // 0-6
               // Adjust for Monday start: Mon=1 -> 0, Sun=0 -> 6
               const offset = startDay === 0 ? 6 : startDay - 1;

               const blanks = Array.from({ length: offset });
               const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

               return (
                  <div
                     key={monthName}
                     className="border border-gray-100 rounded-lg p-4 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer bg-gray-50/30"
                     onClick={() => onSelectMonth(index)}
                  >
                     <h3 className="text-lg font-bold text-gray-800 mb-3 capitalize text-center">{monthName}</h3>

                     <div className="grid grid-cols-7 text-center gap-y-2">
                        {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                           <div key={i} className="text-[10px] font-bold text-gray-400">{d}</div>
                        ))}

                        {blanks.map((_, i) => <div key={`blank-${i}`} />)}

                        {days.map(d => (
                           <div key={d} className={`text-xs p-1 rounded-full ${d === new Date().getDate() && index === new Date().getMonth() && currentYear === new Date().getFullYear() ? 'bg-indigo-600 text-white font-bold' : 'text-gray-600 hover:bg-indigo-50'}`}>
                              {d}
                           </div>
                        ))}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
};