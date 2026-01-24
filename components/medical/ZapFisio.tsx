import React, { useState, useEffect } from 'react';
import { CheckCircle2, PlayCircle, Edit2, LogOut, RefreshCw, Calendar, Send, ChevronLeft, ChevronRight, Smartphone, MessageSquare, Clock, Eye, AlertCircle, List, ArrowRight, Activity, Search, Save, Copy, CalendarClock, Plus, Trash2, X, QrCode, Loader2, AlertTriangle } from 'lucide-react';

type ZapTab = 'painel' | 'agendadas' | 'enviadas' | 'conexoes' | 'modelos';
type ConnectionStatus = 'disconnected' | 'qr_code' | 'connecting' | 'connected';

interface ScheduledMessage {
  id: number;
  patient: string;
  phone: string;
  date: string;
  message: string;
  status: 'Pendente';
}

interface SentMessage {
    id: number;
    date: string;
    patient: string;
    phone: string;
    status: 'Enviada' | 'Falha' | 'Aguardando';
}

// --- Internal Component for Pagination ---
const PaginationFooter = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 7;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="p-6 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                <ChevronLeft size={16} /> Anterior
            </button>
            
            <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={page === '...'}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                            page === currentPage 
                            ? 'bg-[#7B61FF] text-white shadow-md' 
                            : page === '...' 
                                ? 'text-gray-400 cursor-default' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                Próximo <ChevronRight size={16} />
            </button>
        </div>
    );
};

export const ZapFisio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ZapTab>('painel');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const ITEMS_PER_PAGE = 20;
  
  // --- Sent Messages State ---
  const [sentPage, setSentPage] = useState(1);
  const [sentSearchTerm, setSentSearchTerm] = useState('');

  // --- Scheduled Messages State (CRUD) ---
  const [schedulePage, setSchedulePage] = useState(1);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([
    { id: 1, patient: 'Roberto Carlos', phone: '(11) 99999-8888', date: '20/11/2025 09:00', message: 'Olá Roberto, lembrete da sua consulta amanhã.', status: 'Pendente' },
    { id: 2, patient: 'Ana Maria', phone: '(11) 97777-6666', date: '21/11/2025 14:00', message: 'Feliz aniversário Ana! Muita saúde.', status: 'Pendente' },
    { id: 3, patient: 'Carlos Eduardo', phone: '(11) 95555-4444', date: '22/11/2025 10:30', message: 'Olá Carlos, favor confirmar presença.', status: 'Pendente' },
    // Adding more mock data for pagination testing
    ...Array.from({ length: 25 }).map((_, i) => ({
        id: i + 4,
        patient: `Paciente Teste ${i + 1}`,
        phone: '(11) 90000-0000',
        date: '25/11/2025 10:00',
        message: 'Mensagem automática de teste de paginação.',
        status: 'Pendente' as const
    }))
  ]);
  
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDeleteScheduleModalOpen, setIsDeleteScheduleModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<ScheduledMessage | null>(null);
  
  // Form Data for Scheduling
  const [scheduleForm, setScheduleForm] = useState({
    patient: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });

  // --- Sent Messages Mock Data ---
  const generateMockMessages = (): SentMessage[] => {
    const baseData: SentMessage[] = [
      { id: 1, date: '16/10/25 - 18:00', patient: 'Sheila Santana', phone: '(11) 95462-0906', status: 'Enviada' },
      { id: 2, date: '16/10/25 - 18:00', patient: 'Amanda Trintrin Moraes', phone: '(11) 98378-4460', status: 'Enviada' },
      { id: 3, date: '16/10/25 - 18:00', patient: 'Vanilde da Piedade', phone: '(11) 97042-8377', status: 'Enviada' },
      { id: 4, date: '16/10/25 - 18:00', patient: 'Valeria Oliveira Marques', phone: '(11) 96608-0174', status: 'Enviada' },
      { id: 5, date: '16/10/25 - 17:00', patient: 'Marianny Loryn Pereira', phone: '(11) 93094-3833', status: 'Enviada' },
      { id: 6, date: '16/10/25 - 17:00', patient: 'Rosemeire Barreto', phone: '(11) 98121-9301', status: 'Falha' },
      { id: 7, date: '16/10/25 - 17:00', patient: 'Rebeca Resende', phone: '(11) 91149-4594', status: 'Enviada' },
      { id: 8, date: '16/10/25 - 17:00', patient: 'Mariluce Ferreira', phone: '(11) 98762-9486', status: 'Enviada' },
      { id: 9, date: '16/10/25 - 16:00', patient: 'Patrícia Costa Silva', phone: '(11) 98365-2791', status: 'Aguardando' },
      { id: 10, date: '16/10/25 - 15:30', patient: 'João da Silva', phone: '(11) 91234-5678', status: 'Enviada' },
      { id: 11, date: '16/10/25 - 15:00', patient: 'Maria Oliveira', phone: '(11) 98765-4321', status: 'Enviada' },
    ];

    // Multiply data to reach > 40 items for pagination testing
    let fullList = [...baseData];
    for (let i = 0; i < 6; i++) {
        const chunk = baseData.map(item => ({
            ...item, 
            id: item.id + (100 * (i + 1)),
            date: '15/10/25 - 14:30'
        }));
        fullList = [...fullList, ...chunk];
    }
    return fullList;
  };

  const [sentMessages] = useState<SentMessage[]>(() => generateMockMessages());

  // --- Logic: Sent Messages Pagination ---
  const filteredSentMessages = sentMessages.filter(msg => 
    msg.patient.toLowerCase().includes(sentSearchTerm.toLowerCase()) ||
    msg.phone.includes(sentSearchTerm)
  );
  const totalSentPages = Math.ceil(filteredSentMessages.length / ITEMS_PER_PAGE);
  const currentSentMessages = filteredSentMessages.slice((sentPage - 1) * ITEMS_PER_PAGE, sentPage * ITEMS_PER_PAGE);
  
  const handleSentPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalSentPages) setSentPage(newPage);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSentSearchTerm(e.target.value);
      setSentPage(1);
  };

  // --- Logic: Scheduled Messages Pagination ---
  const totalSchedulePages = Math.ceil(scheduledMessages.length / ITEMS_PER_PAGE);
  const currentScheduledMessages = scheduledMessages.slice((schedulePage - 1) * ITEMS_PER_PAGE, schedulePage * ITEMS_PER_PAGE);

  const handleSchedulePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalSchedulePages) setSchedulePage(newPage);
  };

  // --- Logic: Connection Flow ---
  const handleStartConnection = () => {
    setConnectionStatus('qr_code');
  };

  const handleDisconnect = () => {
    // In a real app, API call here
    setConnectionStatus('disconnected');
  };

  const simulateScan = () => {
    setConnectionStatus('connecting');
    // Simulate API delay
    setTimeout(() => {
        setConnectionStatus('connected');
    }, 3000);
  };

  const handleCancelConnection = () => {
      setConnectionStatus('disconnected');
  };

  // --- Logic: Dashboard Preview ---
  const previewMessages = sentMessages.slice(0, 10);

  const getStatusStyle = (status: string) => {
    switch (status) {
        case 'Enviada': return 'bg-emerald-100 text-emerald-700';
        case 'Falha': return 'bg-red-100 text-red-700';
        case 'Aguardando': return 'bg-gray-100 text-gray-600';
        case 'Pendente': return 'bg-amber-100 text-amber-700';
        default: return 'bg-gray-100 text-gray-600';
    }
  };

  // --- CRUD Handlers for Scheduled Messages ---

  const handleOpenScheduleCreate = () => {
    setCurrentSchedule(null);
    setScheduleForm({ patient: '', phone: '', date: '', time: '', message: '' });
    setIsScheduleModalOpen(true);
  };

  const handleOpenScheduleEdit = (msg: ScheduledMessage) => {
    const [datePart, timePart] = msg.date.split(' ');
    setCurrentSchedule(msg);
    setScheduleForm({
        patient: msg.patient,
        phone: msg.phone,
        date: datePart, 
        time: timePart,
        message: msg.message
    });
    setIsScheduleModalOpen(true);
  };

  const handleOpenScheduleDelete = (msg: ScheduledMessage) => {
      setCurrentSchedule(msg);
      setIsDeleteScheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    if (!scheduleForm.patient || !scheduleForm.date) return;

    const fullDateTime = `${scheduleForm.date} ${scheduleForm.time}`;

    if (currentSchedule) {
        // Edit
        setScheduledMessages(prev => prev.map(item => 
            item.id === currentSchedule.id 
            ? { ...item, patient: scheduleForm.patient, phone: scheduleForm.phone, date: fullDateTime, message: scheduleForm.message }
            : item
        ));
    } else {
        // Create
        const newItem: ScheduledMessage = {
            id: Date.now(),
            patient: scheduleForm.patient,
            phone: scheduleForm.phone,
            date: fullDateTime,
            message: scheduleForm.message,
            status: 'Pendente'
        };
        setScheduledMessages([newItem, ...scheduledMessages]);
    }
    setIsScheduleModalOpen(false);
  };

  const handleDeleteSchedule = () => {
      if (currentSchedule) {
          setScheduledMessages(prev => prev.filter(item => item.id !== currentSchedule.id));
          setIsDeleteScheduleModalOpen(false);
          setCurrentSchedule(null);
          // Adjust page if deletion empties current page
          const remaining = scheduledMessages.length - 1;
          const newMaxPages = Math.ceil(remaining / ITEMS_PER_PAGE);
          if (schedulePage > newMaxPages && newMaxPages > 0) setSchedulePage(newMaxPages);
      }
  };

  return (
    <div className="flex flex-col animate-fadeIn pb-10">
      
      {/* Header Area with Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
        <div>
             {/* Title is handled by App.tsx */}
             <p className="text-gray-500">Gerencie a automação de mensagens do WhatsApp</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow-sm transition-colors
            ${connectionStatus === 'connected' ? 'border-emerald-100' : connectionStatus === 'disconnected' ? 'border-red-100' : 'border-amber-100'}
        `}>
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                ${connectionStatus === 'connected' ? 'bg-emerald-400' : connectionStatus === 'disconnected' ? 'bg-red-400' : 'bg-amber-400'}
            `}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3
                ${connectionStatus === 'connected' ? 'bg-emerald-500' : connectionStatus === 'disconnected' ? 'bg-red-500' : 'bg-amber-500'}
            `}></span>
          </span>
          <span className={`font-bold text-sm
              ${connectionStatus === 'connected' ? 'text-emerald-700' : connectionStatus === 'disconnected' ? 'text-red-700' : 'text-amber-700'}
          `}>
              {connectionStatus === 'connected' ? 'Sistema Conectado' : 
               connectionStatus === 'disconnected' ? 'Desconectado' : 'Conectando...'}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto shrink-0 pb-1">
        <button 
          onClick={() => setActiveTab('painel')}
          className={`px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'painel' ? 'border-[#7B61FF] text-[#7B61FF] bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
           <Activity size={18} /> Painel Geral
        </button>
        <button 
          onClick={() => setActiveTab('agendadas')}
          className={`px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'agendadas' ? 'border-[#7B61FF] text-[#7B61FF] bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
           <CalendarClock size={18} /> Agendadas
        </button>
        <button 
          onClick={() => setActiveTab('enviadas')}
          className={`px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'enviadas' ? 'border-[#7B61FF] text-[#7B61FF] bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
           <List size={18} /> Enviadas
        </button>
        <button 
          onClick={() => setActiveTab('conexoes')}
          className={`px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'conexoes' ? 'border-[#7B61FF] text-[#7B61FF] bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
           <Smartphone size={18} /> Conexões
        </button>
        <button 
          onClick={() => setActiveTab('modelos')}
          className={`px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'modelos' ? 'border-[#7B61FF] text-[#7B61FF] bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
           <MessageSquare size={18} /> Modelos
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        
        {/* === TAB: PAINEL === */}
        {activeTab === 'painel' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard 
                 title="Dispositivos" 
                 value={connectionStatus === 'connected' ? "1" : "0"} 
                 subValue={connectionStatus === 'connected' ? "Conectado" : "Offline"}
                 icon={<Smartphone size={24} className="text-white" />} 
                 color={connectionStatus === 'connected' ? "bg-emerald-500" : "bg-red-400"}
                 actionLabel="Gerenciar"
                 onClick={() => setActiveTab('conexoes')}
              />
              <StatsCard 
                 title="Mensagens Enviadas" 
                 value="4.776" 
                 subValue="Total histórico" 
                 icon={<Send size={24} className="text-white" />} 
                 color="bg-[#7B61FF]"
                 actionLabel="Ver histórico completo"
                 onClick={() => setActiveTab('enviadas')}
              />
              <StatsCard 
                 title="Agendamentos" 
                 value={`${scheduledMessages.length}`} 
                 subValue="Mensagens futuras" 
                 icon={<Calendar size={24} className="text-white" />} 
                 color="bg-blue-500"
                 actionLabel="Ver agendadas"
                 onClick={() => setActiveTab('agendadas')}
              />
            </div>

            {/* Recent Activity Preview - Updated to show 10 items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Últimas Atividades</h3>
                        <p className="text-sm text-gray-500">As 10 últimas mensagens enviadas</p>
                    </div>
                    <button 
                        onClick={() => setActiveTab('enviadas')}
                        className="text-sm font-bold text-[#7B61FF] hover:underline flex items-center gap-1"
                    >
                        Ver tudo <ArrowRight size={16} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Data/Hora</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {previewMessages.map((msg) => (
                                <tr key={`preview-${msg.id}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Clock size={16} className="text-gray-400" />
                                            {msg.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-800">{msg.patient}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(msg.status)}`}>
                                            {msg.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {/* === TAB: AGENDADAS === */}
        {activeTab === 'agendadas' && (
           <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Mensagens Agendadas</h3>
                    <p className="text-sm text-gray-500">Gerencie os envios futuros</p>
                 </div>
                 <button 
                    onClick={handleOpenScheduleCreate}
                    className="bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                 >
                    <Plus size={18} /> Nova Mensagem
                 </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Data de Envio</th>
                          <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
                          <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Conteúdo</th>
                          <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentScheduledMessages.length > 0 ? (
                            currentScheduledMessages.map((msg) => (
                          <tr key={msg.id} className="hover:bg-gray-50 transition-colors group">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <CalendarClock size={16} className="text-[#7B61FF]" />
                                    {msg.date}
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{msg.patient}</p>
                                    <p className="text-xs text-gray-400">{msg.phone}</p>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <p className="text-sm text-gray-600 truncate max-w-[250px]" title={msg.message}>
                                    {msg.message}
                                </p>
                             </td>
                             <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(msg.status)}`}>
                                    <Clock size={12} /> {msg.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => handleOpenScheduleEdit(msg)}
                                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleOpenScheduleDelete(msg)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                             </td>
                          </tr>
                        ))
                        ) : (
                             <tr>
                                <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <CalendarClock size={48} className="text-gray-200 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-600">Nenhum agendamento</h3>
                                        <p className="text-sm text-gray-400 mb-6">Crie mensagens para serem enviadas automaticamente no futuro.</p>
                                        <button 
                                            onClick={handleOpenScheduleCreate}
                                            className="text-[#7B61FF] font-bold text-sm hover:underline"
                                        >
                                            Criar primeira mensagem
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <PaginationFooter 
                    currentPage={schedulePage} 
                    totalPages={totalSchedulePages} 
                    onPageChange={handleSchedulePageChange} 
                  />
              </div>
           </div>
        )}

        {/* === TAB: MENSAGENS ENVIADAS (Updated Layout & Pagination) === */}
        {activeTab === 'enviadas' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                 <h3 className="text-xl font-bold text-gray-800">Histórico de Envios</h3>
                 <p className="text-sm text-gray-500">Acompanhe o status de entrega de todas as mensagens</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                 <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Buscar por paciente ou telefone..." 
                        value={sentSearchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#7B61FF] focus:outline-none shadow-sm" 
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 </div>
              </div>
            </div>

            {/* Table with Clean Design */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Data/Hora</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentSentMessages.length > 0 ? (
                        currentSentMessages.map((msg) => (
                        <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-600 font-medium">
                                    {msg.date}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-bold text-gray-800">{msg.patient}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{msg.phone}</td>
                            <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(msg.status)}`}>
                                {msg.status}
                            </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100 hover:bg-red-50">
                                        <Trash2 size={18} />
                                    </button>
                                    <button className="text-gray-400 hover:text-[#7B61FF] p-1.5 rounded-lg transition-colors border border-transparent hover:border-indigo-100 hover:bg-indigo-50">
                                        <Eye size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                <div className="flex flex-col items-center justify-center">
                                    <Search size={32} className="mb-2 opacity-30" />
                                    <p>Nenhuma mensagem encontrada para a busca.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <PaginationFooter 
                currentPage={sentPage} 
                totalPages={totalSentPages} 
                onPageChange={handleSentPageChange} 
              />
            </div>
          </div>
        )}

        {/* === TAB: CONEXÕES (With Flow Logic) === */}
        {activeTab === 'conexoes' && (
          <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
             <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 max-w-2xl w-full text-center relative overflow-hidden">
                
                {/* 1. DISCONNECTED STATE */}
                {connectionStatus === 'disconnected' && (
                    <div className="animate-fadeIn">
                         <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                            <Smartphone size={40} className="text-gray-400" />
                            <div className="absolute top-0 right-0 p-1 bg-white rounded-full">
                                <AlertTriangle size={20} className="text-red-500 fill-current" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-2">WhatsApp Desconectado</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                            Conecte seu WhatsApp para habilitar o envio automático de lembretes, confirmações e mensagens de aniversário.
                        </p>

                        <button 
                            onClick={handleStartConnection}
                            className="bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1"
                        >
                            Conectar WhatsApp
                        </button>
                    </div>
                )}

                {/* 2. QR CODE STATE */}
                {connectionStatus === 'qr_code' && (
                     <div className="animate-fadeIn">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Escaneie o QR Code</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Abra o WhatsApp no seu celular {'>'} Configurações {'>'} Aparelhos Conectados {'>'} Conectar Aparelho
                        </p>
                        
                        <div 
                            className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-2xl w-64 h-64 mx-auto mb-6 flex items-center justify-center cursor-pointer hover:border-[#7B61FF] transition-colors group relative"
                            onClick={simulateScan}
                            title="Clique para simular a leitura"
                        >
                            {/* Fake QR Code Visual */}
                            <QrCode size={180} className="text-gray-800 group-hover:opacity-50 transition-opacity" />
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-[#7B61FF] shadow-sm">
                                    Simular Leitura
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleCancelConnection}
                            className="text-gray-400 hover:text-gray-600 font-bold text-sm"
                        >
                            Cancelar
                        </button>
                     </div>
                )}

                {/* 3. CONNECTING STATE */}
                {connectionStatus === 'connecting' && (
                    <div className="animate-fadeIn py-10">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                             <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                             <div className="absolute inset-0 border-4 border-[#7B61FF] border-t-transparent rounded-full animate-spin"></div>
                             <Smartphone size={24} className="absolute inset-0 m-auto text-[#7B61FF]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Sincronizando conversas...</h3>
                        <p className="text-gray-500 text-sm">Por favor, aguarde alguns segundos.</p>
                    </div>
                )}

                {/* 4. CONNECTED STATE */}
                {connectionStatus === 'connected' && (
                    <div className="animate-fadeIn">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

                        <div className="mb-8 relative inline-block">
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center relative z-10">
                                <Smartphone size={40} className="text-emerald-500" />
                            </div>
                            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-50 z-0"></div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-2">WhatsApp Conectado</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                            Seu dispositivo está sincronizado e enviando mensagens automaticamente. Para manter a conexão estável, abra o WhatsApp no seu celular ocasionalmente.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                                <RefreshCw size={18} /> Sincronizar Agora
                            </button>
                            <button 
                                onClick={handleDisconnect}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 font-bold rounded-xl hover:bg-red-100 transition-all"
                            >
                                <LogOut size={18} /> Desconectar
                            </button>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wide">
                            <CheckCircle2 size={14} className="text-emerald-500" /> Última sincronização: Hoje às 14:30
                        </div>
                    </div>
                )}

             </div>
          </div>
        )}

        {/* === TAB: MODELOS === */}
        {activeTab === 'modelos' && (
          <div className="animate-fadeIn">
             <div className="flex justify-between items-end mb-6">
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Modelos de Mensagem</h3>
                    <p className="text-sm text-gray-500">Personalize os textos enviados automaticamente</p>
                 </div>
                 <button className="text-[#7B61FF] font-bold text-sm hover:underline flex items-center gap-1">
                    <PlayCircle size={16} /> Como configurar
                 </button>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <MessageTemplate 
                title="Confirmação de Agendamento" 
                defaultContent={`🤩 Olá Sr(a) [Paciente]!!
🚨 Não se esqueça do seu atendimento!
Data: [Data]  Horário: [Horário]
Fisioterapeuta: Dra. [Profissional]
Local:  Cachoeira do Campo Grande 44

➡ Não esqueça de confirmar sua presença!!

Digite: 1-Sim
        2-Não`}
                variables={['Paciente', 'Profissional', 'Data', 'Horário']}
                color="border-l-4 border-l-[#7B61FF]"
                />
                
                <MessageTemplate 
                title="Lembrete de Pagamento" 
                defaultContent="Olá [Paciente], identificamos uma pendência no valor de [Valor] referente ao serviço prestado. Por favor, entre em contato para regularização."
                variables={['Paciente', 'Valor', 'DataVencimento', 'Profissional']}
                color="border-l-4 border-l-amber-500"
                />

                <MessageTemplate 
                title="Feliz Aniversário" 
                defaultContent={`Feliz Aniversário, Sr(a) [Paciente]! 🎈🎂🥳

Desejo a você um aniversário cheio de alegrias e momentos especiais. Conte sempre com a Fisionline!`}
                variables={['Paciente']}
                color="border-l-4 border-l-pink-500"
                />

                <MessageTemplate 
                title="Pós-Atendimento" 
                defaultContent={`Olá [Paciente], como você está se sentindo após a sessão de hoje?

Qualquer dúvida ou desconforto, estou à disposição!`}
                variables={['Paciente', 'Profissional']}
                color="border-l-4 border-l-emerald-500"
                />
             </div>
          </div>
        )}

      </div>

      {/* --- CREATE/EDIT SCHEDULE MODAL --- */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsScheduleModalOpen(false)}></div>
           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <h3 className="font-bold text-gray-800 text-lg">
                    {currentSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
                 </h3>
                 <button onClick={() => setIsScheduleModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                 </button>
              </div>
              
              <div className="p-6 space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Paciente</label>
                    <input 
                      type="text" 
                      value={scheduleForm.patient}
                      onChange={(e) => setScheduleForm({...scheduleForm, patient: e.target.value})}
                      placeholder="Nome do paciente"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Telefone</label>
                    <input 
                      type="text" 
                      value={scheduleForm.phone}
                      onChange={(e) => setScheduleForm({...scheduleForm, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Data de Envio</label>
                        <input 
                          type="text" 
                          value={scheduleForm.date}
                          onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                          placeholder="DD/MM/AAAA"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Horário</label>
                        <input 
                          type="text" 
                          value={scheduleForm.time}
                          onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                          placeholder="HH:MM"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                        />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Mensagem</label>
                    <textarea 
                      rows={4}
                      value={scheduleForm.message}
                      onChange={(e) => setScheduleForm({...scheduleForm, message: e.target.value})}
                      placeholder="Digite a mensagem..."
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] resize-none"
                    />
                 </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                 <button 
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200/50 rounded-lg transition-colors"
                 >
                    Cancelar
                 </button>
                 <button 
                    onClick={handleSaveSchedule}
                    className="px-6 py-2 bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold rounded-lg shadow-md transition-all"
                 >
                    Salvar
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- DELETE SCHEDULE MODAL --- */}
      {isDeleteScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDeleteScheduleModalOpen(false)}></div>
           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fadeIn text-center p-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertCircle size={32} />
              </div>
              <h3 className="font-bold text-gray-800 text-xl mb-2">Excluir Agendamento?</h3>
              <p className="text-gray-500 text-sm mb-6">
                 Deseja realmente cancelar o envio para <strong>{currentSchedule?.patient}</strong>?
              </p>
              
              <div className="flex gap-3 justify-center">
                 <button 
                    onClick={() => setIsDeleteScheduleModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                 >
                    Cancelar
                 </button>
                 <button 
                    onClick={handleDeleteSchedule}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-colors"
                 >
                    Sim, excluir
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

// --- Sub-components for Cleaner Code ---

const StatsCard = ({ title, value, subValue, icon, color, actionLabel, onClick }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl shadow-lg shadow-gray-200 ${color}`}>
                {icon}
            </div>
            {actionLabel && (
                <button 
                    onClick={onClick}
                    className="text-xs font-bold text-gray-400 hover:text-[#7B61FF] uppercase tracking-wide transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
        <div>
            <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
            <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-gray-800">{value}</span>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{subValue}</span>
            </div>
        </div>
    </div>
);

const MessageTemplate = ({ title, defaultContent, variables, color }: any) => {
    const [content, setContent] = useState(defaultContent);

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${color} flex flex-col`}>
            <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-400" />
                    {title}
                </h4>
                <div className="flex gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-[#7B61FF] rounded hover:bg-gray-100" title="Copiar">
                        <Copy size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-emerald-500 rounded hover:bg-gray-100" title="Salvar">
                        <Save size={16} />
                    </button>
                </div>
            </div>
            <div className="p-5">
                <textarea 
                    className="w-full text-sm text-gray-600 leading-relaxed bg-white border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] resize-none min-h-[160px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="mt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Variáveis Disponíveis</p>
                    <div className="flex flex-wrap gap-2">
                        {variables.map((v: string) => (
                            <span key={v} className="text-xs font-bold text-[#7B61FF] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md cursor-pointer hover:bg-indigo-100 transition-colors">
                                [{v}]
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};