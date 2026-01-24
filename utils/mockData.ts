import { DayData, CalendarEvent, Patient, Procedure, Evaluation } from '../types';

const NAMES = [
  "Roseli Oliveira Araujo", "Adair Pires", "Marta Lucia", "Isabel Cristina Ludovico",
  "Daiany Fernanda Costa", "Adolfo de Deus Vieira", "Terezinha Candida",
  "Iraci Maria Silva", "Rodrigo Mesquita", "Bernadete Araujo", "Ivair Vieira Cardoso",
  "Lucimar Furtado Silva", "Ricardo de Almeida", "Natalia de Paula Siqueira",
  "Eide Maria Pires", "Maria de Fatima Borges", "Edvan Inácio Rabelo",
  "Zulmira Barreira", "Solange Dias de Sousa", "Umbelina Dias", "Lucilene Alves Pimenta"
];

const PROCEDURES = [
  "Fisioterapia Geral", "Pacote musculação pilates", "RPG - Reeducação Postural", 
  "Acupuntura", "Fisioterapia Respiratória", "Drenagem Linfática"
];

const COMPLAINTS = [
  "dor e peso no pescoço", "dor na lombar ao agachar", "recuperação pós-cirúrgica joelho",
  "tendinite no ombro direito", "tensão muscular crônica", "hérnia de disco"
];

const COLORS: Array<'yellow' | 'red' | 'black' | 'cyan' | 'gray'> = ['yellow', 'red', 'black', 'cyan', 'gray'];

const generateRandomEvents = (count: number, seed: string, dateContext: Date): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  // Simple pseudo-random generator to make events consistent for specific days
  let pseudoRandom = 0;
  for(let i=0; i<seed.length; i++) pseudoRandom += seed.charCodeAt(i);
  
  for (let i = 0; i < count; i++) {
    const randomVal = pseudoRandom + i;
    const hour = 7 + (randomVal * 3) % 11; // 7am to 18pm
    const min = (randomVal) % 2 === 0 ? '00' : '30';
    
    // Determine color/status mapping
    const color = COLORS[randomVal % COLORS.length];
    let status: 'realizado' | 'pendente' | 'cancelado' | 'confirmado' = 'pendente';
    
    if (color === 'yellow') status = 'pendente';
    else if (color === 'red') status = 'cancelado';
    else if (color === 'cyan') status = 'confirmado';
    else status = 'realizado';

    events.push({
      id: `evt-${seed}-${i}`,
      time: `${hour}:${min}`,
      patientName: NAMES[randomVal % NAMES.length],
      color: color,
      procedure: PROCEDURES[randomVal % PROCEDURES.length],
      complaint: COMPLAINTS[randomVal % COMPLAINTS.length],
      sessionNumber: (randomVal % 20) + 1,
      totalSessions: (randomVal % 20) + 10 + (randomVal % 10), // Ensure total > current
      status: status,
      date: dateContext
    });
  }
  return events.sort((a, b) => {
    const timeA = parseInt(a.time.replace(':', ''));
    const timeB = parseInt(b.time.replace(':', ''));
    return timeA - timeB;
  });
};

export const getCalendarData = (year: number, month: number): DayData[] => {
  const days: DayData[] = [];
  
  // Create Date objects for calculations
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const startDayOfWeek = firstDayOfMonth.getDay(); 
  
  // Our calendar starts on Monday (index 1).
  const daysFromPrevMonth = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const prevMonthLastDate = new Date(year, month, 0).getDate();

  // 1. Add Previous Month Days
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const dayNum = prevMonthLastDate - daysFromPrevMonth + i + 1;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    
    const seed = `prev-${year}-${month}-${dayNum}`;
    const hasEvents = (dayNum + i) % 5 === 0; 
    
    days.push({
      day: dayNum,
      month: 'prev',
      events: hasEvents ? generateRandomEvents(1, seed, prevMonthDate) : [],
      dateObj: prevMonthDate
    });
  }

  // 2. Add Current Month Days
  const totalDays = lastDayOfMonth.getDate();
  const today = new Date();
  const isCurrentRealMonth = today.getMonth() === month && today.getFullYear() === year;

  for (let i = 1; i <= totalDays; i++) {
    const isToday = isCurrentRealMonth && i === today.getDate();
    const date = new Date(year, month, i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    // Generate random events
    let events: CalendarEvent[] = [];
    if (!isWeekend) { 
       const seed = `curr-${year}-${month}-${i}`;
       const count = (i * 7 + 3) % 7; 
       
       events = generateRandomEvents(count, seed, date);
       
       if (count > 4) {
           events.push({
               id: `more-${seed}`,
               time: '',
               patientName: '',
               color: 'gray',
               isMore: true,
               moreCount: 10 + (i % 10)
           });
       }
    }

    days.push({
      day: i,
      month: 'current',
      events,
      isToday,
      dateObj: date
    });
  }

  // 3. Add Next Month Days
  const totalSlots = 42; 
  const currentSlots = days.length;
  const remainingSlots = totalSlots - currentSlots;

  for (let i = 1; i <= remainingSlots; i++) {
      const nextMonthDate = new Date(year, month + 1, i);
      const seed = `next-${year}-${month}-${i}`;
      days.push({
          day: i,
          month: 'next',
          events: [],
          dateObj: nextMonthDate
      });
  }

  return days;
};

export const getMockNovember2025 = () => getCalendarData(2025, 10);


// --- Mock Data for Patients List ---

export const mockPatients: Patient[] = [
  { id: '1', name: 'Ademar Soares', secondaryInfo: 'Dor 9', lastVisit: '13/01', status: 'Inativo' },
  { id: '2', name: 'Ademir Marcos /Sogro', status: 'Inativo' },
  { id: '3', name: 'Adenilse', status: 'Ativo' },
  { id: '4', name: 'Adonis da Silva Coelho', lastVisit: '08/07', status: 'Ativo', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: '5', name: 'Adriana Goreti de Moura de Golveia', lastVisit: '08/03', status: 'Inativo' },
  { id: '6', name: 'Adriana / Izabel', status: 'Inativo' },
  { id: '7', name: 'Adriana / Izabel / Ana', status: 'Inativo' },
  { id: '8', name: 'Adriana Nascimento da Silva', lastVisit: '14/06', status: 'Ativo', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '9', name: 'Adriano Montenegro da Trindade', lastVisit: '04/06', status: 'Ativo' },
  { id: '10', name: 'Adrielle Lais Lisboa Gonçalves', lastVisit: '17/01', status: 'Inativo' },
  { id: '11', name: 'Aila da Silva Santos', lastVisit: '09/02', status: 'Ativo' },
  { id: '12', name: 'Alexandre Fonseca de Lima', secondaryInfo: 'Dor grau 10', lastVisit: '16/10', status: 'Inativo' },
];

// --- Mock Data for Procedures List ---

export const mockProcedures: Procedure[] = [
  { id: '1', name: 'Palestra', price: 0, type: 'individual', colorClass: 'border-gray-300', customColor: '#d1d5db', description: 'Palestras educativas sobre saúde e bem-estar.', professionalPercentage: 0 },
  { id: '2', name: 'Fisio Domiciliar', price: 150.00, type: 'individual', colorClass: 'border-emerald-500', customColor: '#10B981', description: 'Atendimento de fisioterapia no conforto do seu lar.', professionalPercentage: 50 },
  { id: '3', name: 'Fisioterapia', price: 65.00, type: 'individual', colorClass: 'border-teal-500', customColor: '#14b8a6', description: 'Sessão de fisioterapia convencional na clínica.', professionalPercentage: 40 },
  { id: '4', name: 'Acupuntura', price: 65.00, type: 'individual', colorClass: 'border-orange-500', customColor: '#f97316', description: 'Técnica de medicina tradicional chinesa para alívio de dor e equilíbrio.', professionalPercentage: 45 },
  { id: '5', name: 'Ventosaterapia', price: 85.00, type: 'individual', colorClass: 'border-red-500', customColor: '#ef4444', description: 'Terapia para melhorar a circulação sanguínea e aliviar tensão muscular.', professionalPercentage: 50 },
  { id: '6', name: 'Avaliação', price: 50.00, type: 'individual', colorClass: 'border-yellow-400', customColor: '#facc15', description: 'Avaliação inicial para diagnóstico e plano de tratamento.', professionalPercentage: 100 },
  { id: '7', name: 'Auriculoterapia', price: 20.00, type: 'individual', colorClass: 'border-gray-800', customColor: '#1f2937', description: 'Estimulação de pontos na orelha para tratar diversas condições.', professionalPercentage: 40 },
  { id: '8', name: 'Pacote 10 Sessões', price: 600.00, type: 'pacote', colorClass: 'border-purple-600', customColor: '#9333ea', description: 'Pacote promocional com 10 sessões de fisioterapia.', sessions: 10, professionalPercentage: 35 }, 
  { id: '9', name: 'LASER', price: 100.00, type: 'individual', colorClass: 'border-fuchsia-500', customColor: '#d946ef', description: 'Terapia com laser de baixa intensidade para reparação tecidual.', professionalPercentage: 40 },
  { id: '10', name: 'Dry Needling', price: 102.00, type: 'individual', colorClass: 'border-blue-600', customColor: '#2563eb', description: 'Agulhamento a seco para tratamento de pontos gatilho miofasciais.', professionalPercentage: 50 },
  { id: '11', name: 'Aula Experimental Pilates', price: 0.00, type: 'individual', colorClass: 'border-black', customColor: '#000000', description: 'Aula gratuita para conhecer o método Pilates.', professionalPercentage: 0 },
  { id: '12', name: 'Mensalidade Pilates 1x', price: 280.00, type: 'mensal', colorClass: 'border-red-600', customColor: '#dc2626', description: 'Plano mensal de Pilates com 1 aula por semana.', professionalPercentage: 40 },
  { id: '13', name: 'Mensalidade Pilates 2x', price: 450.00, type: 'mensal', colorClass: 'border-purple-600', customColor: '#9333ea', description: 'Plano mensal de Pilates com 2 aulas por semana.', professionalPercentage: 40 },
  { id: '14', name: 'Falta 50% Fisioterapia', price: 32.50, type: 'individual', colorClass: 'border-blue-500', customColor: '#3b82f6', description: 'Taxa referente a falta não justificada.', professionalPercentage: 0 },
  { id: '15', name: 'Drenagem Linfatica', price: 100.00, type: 'individual', colorClass: 'border-transparent', customColor: '#ec4899', description: 'Massagem terapêutica para estimular o sistema linfático.', professionalPercentage: 50 },
];

// --- Mock Data for Evaluations List ---

export const mockEvaluations: Evaluation[] = [
  { id: '1', patientName: 'Ademar Soares', date: '15/10/2025', type: 'Ortopédica', status: 'Concluída', professional: 'Márcio Andrei' },
  { id: '2', patientName: 'Adenilse', date: '20/10/2025', type: 'Neurológica', status: 'Pendente', professional: 'Bernadete A.' },
  { id: '3', patientName: 'Adonis da Silva Coelho', date: '22/10/2025', type: 'Respiratória', status: 'Concluída', professional: 'Márcio Andrei' },
  { id: '4', patientName: 'Adriana Nascimento', date: '25/10/2025', type: 'Pilates', status: 'Pendente', professional: 'Natalia P.' },
];