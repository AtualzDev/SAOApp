
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  History, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Printer,
  MoreVertical
} from 'lucide-react';

interface Appointment {
  id: string;
  time: string; // Formato HH:mm
  patient: string;
  type: 'blue' | 'yellow' | 'black' | 'red' | 'indigo';
  date: Date;
}

const Agenda: React.FC = () => {
  const [view, setView] = useState<'year' | 'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualiza o indicador de hora atual a cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock de dados baseado em datas reais relativas a hoje
  const appointments: Appointment[] = useMemo(() => {
    const today = new Date();
    return [
      { id: '1', time: '08:00', patient: 'Daiany Fernanda Costa', type: 'blue', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
      { id: '2', time: '11:30', patient: 'Adolfo de Deus Vieira', type: 'yellow', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
      { id: '3', time: '14:00', patient: 'Terezinha Candida', type: 'yellow', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
      { id: '4', time: '09:00', patient: 'Rodrigo Mesquita', type: 'black', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
      { id: '5', time: '14:00', patient: 'Terezinha Candida', type: 'yellow', date: new Date(today.getFullYear(), today.getMonth(), 5) },
      { id: '6', time: '17:30', patient: 'Iraci Maria Silva', type: 'red', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
      { id: '7', time: '09:00', patient: 'Rodrigo Mesquita', type: 'black', date: new Date(today.getFullYear(), today.getMonth(), 6) },
      { id: '8', time: '12:30', patient: 'Bernadete Araujo', type: 'blue', date: new Date(today.getFullYear(), today.getMonth(), 6) },
      { id: '9', time: '15:00', patient: 'Ricardo de Almeida', type: 'blue', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
    ];
  }, []);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'blue': return 'bg-[#E0F2FE] text-[#0369A1] border-l-4 border-[#0EA5E9]';
      case 'yellow': return 'bg-[#FEF9C3] text-[#A16207] border-l-4 border-[#EAB308]';
      case 'black': return 'bg-[#1E293B] text-white border-l-4 border-[#64748B]';
      case 'red': return 'bg-[#FFE4E6] text-[#BE123C] border-l-4 border-[#FB7185]';
      case 'indigo': return 'bg-[#E0E7FF] text-[#4338CA] border-l-4 border-[#6366F1]';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const fullDaysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const shortDaysOfWeek = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

  const next = () => {
    const newDate = new Date(currentDate);
    if (view === 'year') newDate.setFullYear(currentDate.getFullYear() + 1);
    else if (view === 'month') newDate.setMonth(currentDate.getMonth() + 1);
    else if (view === 'week') newDate.setDate(currentDate.getDate() + 7);
    else newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const prev = () => {
    const newDate = new Date(currentDate);
    if (view === 'year') newDate.setFullYear(currentDate.getFullYear() - 1);
    else if (view === 'month') newDate.setMonth(currentDate.getMonth() - 1);
    else if (view === 'week') newDate.setDate(currentDate.getDate() - 7);
    else newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());

  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    for (let i = 0; i < firstDayIndex; i++) days.push(null);
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) days.push(i);
    return days;
  };

  const renderYearView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {monthNames.map((month, idx) => {
        const days = getDaysInMonth(idx, currentDate.getFullYear());
        return (
          <div key={month} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
            const d = new Date(currentDate);
            d.setMonth(idx);
            setCurrentDate(d);
            setView('month');
          }}>
            <h3 className="text-center font-bold text-slate-800 mb-4">{month}</h3>
            <div className="grid grid-cols-7 gap-y-2 text-center">
              {shortDaysOfWeek.map((d, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-300">{d}</span>
              ))}
              {days.map((day, i) => (
                <span key={i} className={`text-[10px] py-1 ${day ? 'text-slate-600 font-medium' : ''}`}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const totalSlots = Math.ceil(days.length / 7) * 7;
    while(days.length < totalSlots) days.push(null);

    return (
      <div className="grid grid-cols-7 border-l border-slate-200">
        {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'].map(day => (
          <div key={day} className="bg-white py-3 px-4 text-center text-[10px] font-black text-slate-400 border-r border-b border-slate-200 tracking-widest uppercase">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const isToday = day === new Date().getDate() && 
                          currentDate.getMonth() === new Date().getMonth() && 
                          currentDate.getFullYear() === new Date().getFullYear();
          return (
            <div key={i} className={`min-h-[140px] bg-white border-r border-b border-slate-200 p-2 transition-all hover:bg-slate-50/50 ${day ? 'cursor-pointer' : 'bg-slate-50/20'}`}>
              {day && (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-black ${isToday ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {appointments
                      .filter(app => app.date.getDate() === day && app.date.getMonth() === currentDate.getMonth())
                      .map(app => (
                        <div key={app.id} className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 truncate shadow-sm transition-transform hover:scale-[1.02] ${getTypeStyles(app.type)}`}>
                          <span className="opacity-70 whitespace-nowrap">{app.time}</span>
                          <span className="truncate">{app.patient}</span>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - (day === 0 ? 6 : day - 1);
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDays.push(d);
    }

    return (
      <div className="grid grid-cols-7 border-l border-slate-200 h-full min-h-[600px]">
        {weekDays.map((d, i) => (
          <div key={i} className="bg-white border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fullDaysOfWeek[d.getDay() === 0 ? 0 : d.getDay()].substring(0, 3)}</span>
              <span className={`text-xl font-black ${d.getDate() === new Date().getDate() && d.getMonth() === new Date().getMonth() ? 'text-indigo-600' : 'text-slate-700'}`}>{d.getDate()}</span>
            </div>
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {appointments
                .filter(app => app.date.getDate() === d.getDate() && app.date.getMonth() === d.getMonth())
                .map(app => (
                  <div key={app.id} className={`p-2 rounded-xl text-xs font-bold flex flex-col gap-1 shadow-sm border ${getTypeStyles(app.type)}`}>
                    <div className="flex items-center gap-1 opacity-80">
                      <Clock size={12} /> {app.time}
                    </div>
                    <div className="truncate">{app.patient}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizador da Visão de Dia (Layout Timeline Detalhado)
  const renderDayView = () => {
    const dayApps = appointments.filter(app => 
      app.date.getDate() === currentDate.getDate() && 
      app.date.getMonth() === currentDate.getMonth() &&
      app.date.getFullYear() === currentDate.getFullYear()
    );

    const hours = Array.from({ length: 18 }, (_, i) => i + 5); // Das 05:00 às 22:00
    
    // Cálculo da linha vermelha (indicador de tempo real)
    const isToday = currentDate.toDateString() === new Date().toDateString();
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    
    const calculateRedLineTop = () => {
      if (!isToday || currentHour < 5 || currentHour >= 23) return -1;
      const hourIndex = currentHour - 5;
      const minutePercent = (currentMinutes / 60) * 80; // 80px é a altura de cada bloco de hora
      return (hourIndex * 80) + minutePercent;
    };

    const redLineTop = calculateRedLineTop();

    return (
      <div className="flex flex-col bg-white h-full overflow-hidden">
        {/* Day View Header */}
        <div className="px-8 py-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              {fullDaysOfWeek[currentDate.getDay()]}, {currentDate.getDate()} de {monthNames[currentDate.getMonth()]}
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">Programação diária detalhada</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
               <Printer size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
               <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth scrollbar-hide">
          <div className="relative min-w-[800px] h-[1440px]"> {/* 18 horas * 80px */}
            
            {/* Hour Grid Lines */}
            {hours.map((hour) => (
              <div key={hour} className="flex h-20 border-b border-slate-50 relative group">
                <div className="w-20 flex-shrink-0 flex items-start justify-center pt-2">
                  <span className="text-[10px] font-bold text-slate-300">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
                <div className="flex-1 border-l border-slate-100 bg-white group-hover:bg-slate-50/30 transition-colors" />
              </div>
            ))}

            {/* Current Time Indicator (Red Line) */}
            {redLineTop !== -1 && (
              <div 
                className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                style={{ top: `${redLineTop}px` }}
              >
                <div className="w-20 flex justify-end pr-2">
                  <span className="text-[10px] font-bold text-red-500 bg-white px-1">
                    {currentTime.getHours().toString().padStart(2, '0')}:{currentTime.getMinutes().toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1 h-px bg-red-500 relative">
                  <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                </div>
              </div>
            )}

            {/* Appointments Overlay */}
            <div className="absolute top-0 left-20 right-0 bottom-0 pointer-events-none">
              {dayApps.map(app => {
                const [h, m] = app.time.split(':').map(Number);
                const appTop = ((h - 5) * 80) + ((m / 60) * 80);
                
                return (
                  <div 
                    key={app.id}
                    className={`absolute left-4 right-10 p-3 rounded-xl border shadow-sm pointer-events-auto cursor-pointer hover:shadow-md transition-all group ${getTypeStyles(app.type)}`}
                    style={{ top: `${appTop}px`, minHeight: '60px' }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black mb-0.5">
                          <Clock size={12} className="opacity-60" /> {app.time}
                        </div>
                        <h4 className="text-xs font-bold truncate">{app.patient}</h4>
                        <p className="text-[9px] opacity-70 mt-1 flex items-center gap-1">
                           <MapPin size={10} /> Unidade Principal
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <MoreVertical size={14} className="text-slate-400" />
                      </div>
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

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] animate-in fade-in duration-500 overflow-hidden">
      {/* Top Header */}
      <header className="p-6 md:px-8 flex items-center justify-between bg-white border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Agenda</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#EEF2FF] text-[#4338CA] px-2 py-0.5 rounded-md text-[10px] font-bold">7372</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">agendamentos totais</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
            <History size={18} /> Histórico Completo
          </button>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">MA</div>
            <span className="text-xs font-bold text-slate-600">Márcio Andrei</span>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="p-4 md:px-8 flex flex-wrap items-center justify-between gap-4 bg-white/50 border-b border-slate-100 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={goToToday}
            className="px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-all shadow-sm"
          >
            Hoje
          </button>
          <div className="flex items-center gap-1 ml-2">
            <button onClick={prev} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <h2 className="text-lg font-bold text-slate-800 ml-4">
            {view === 'year' ? currentDate.getFullYear() : 
             view === 'month' ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` :
             view === 'week' ? `Semana de ${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}` :
             `${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </h2>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-2xl justify-end">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
            {(['year', 'month', 'week', 'day'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                  view === v ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {v === 'year' ? 'Ano' : v === 'month' ? 'Mês' : v === 'week' ? 'Semana' : 'Dia'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Scrollable */}
      <div className="flex-1 overflow-y-auto bg-slate-50 scrollbar-hide">
        {view === 'year' && renderYearView()}
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>
    </div>
  );
};

export default Agenda;
