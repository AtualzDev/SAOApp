import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, User, Phone, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';
import { DayData } from '../../types';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: DayData | null;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, selectedDate }) => {
    const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
    const [isMonthly, setIsMonthly] = useState(false);

    if (!isOpen) return null;

    const formattedDate = selectedDate
        ? `Dia ${String(selectedDate.day).padStart(2, '0')}/11/2025` // Hardcoded month/year for mock context
        : 'Novo Agendamento';

    const dayOfWeek = selectedDate ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][new Date(2025, 10, selectedDate.day).getDay()] : 'Seg';
    const fullDateString = selectedDate ? `${dayOfWeek}, ${selectedDate.day}/11/2025` : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn scale-100 transition-all">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
                    <h2 className="text-xl font-bold text-[#7B61FF] tracking-tight">{formattedDate}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-6 pb-2 shrink-0">
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
                    ${activeTab === 'new'
                                    ? 'bg-[#7B61FF] text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                        >
                            <Plus size={16} strokeWidth={3} />
                            <span className="hidden sm:inline">NOVO AGENDAMENTO</span>
                            <span className="sm:hidden">NOVO</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
                    ${activeTab === 'list'
                                    ? 'bg-[#7B61FF] text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                        >
                            <FileText size={16} />
                            <span className="hidden sm:inline">AGENDAMENTOS</span>
                            <span className="sm:hidden">LISTA</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {activeTab === 'new' ? (
                        <div className="space-y-5">

                            {/* Date & Time Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Data</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            readOnly
                                            value={fullDateString}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Horário</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            defaultValue="08:00"
                                            className="w-full pl-10 pr-2 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Patient Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Nome do Paciente</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Buscar ou adicionar paciente..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                                    />
                                </div>
                            </div>

                            {/* Procedure */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-gray-700 uppercase">Procedimento</label>
                                    <button className="text-[#7B61FF] hover:bg-[#7B61FF]/10 rounded p-0.5 transition-colors">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] appearance-none">
                                    <option>Selecione o procedimento</option>
                                    <option>Fisioterapia Geral</option>
                                    <option>Pilates</option>
                                    <option>RPG</option>
                                </select>
                            </div>

                            {/* Monthly Toggle */}
                            <div className="flex items-center gap-3 py-1">
                                <div
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${isMonthly ? 'bg-[#7B61FF]' : 'bg-gray-300'}`}
                                    onClick={() => setIsMonthly(!isMonthly)}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isMonthly ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {isMonthly ? 'Recorrência Mensal' : 'Atendimento Avulso'}
                                </span>
                            </div>

                            {/* Patient Phone */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Celular do Paciente</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="(00) 00000-0000"
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                                    />
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase flex items-center gap-1">
                                    Notificar por ZapFisio
                                    <MessageCircle size={14} className="text-green-500 fill-current" />
                                </label>
                                <select className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]">
                                    <option>Não notificar</option>
                                    <option>Notificar 24h antes</option>
                                    <option>Notificar 2h antes</option>
                                </select>
                            </div>

                            {/* Repeat Checkbox */}
                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer w-5 h-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-[#7B61FF] checked:border-transparent transition-all bg-white" />
                                        <CheckCircle2 size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#7B61FF] transition-colors">Quero repetir este atendimento</span>
                                </label>
                                <p className="text-xs text-orange-600 pl-8">
                                    Selecione um paciente e um procedimento para habilitar a repetição.
                                </p>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Lista de agendamentos para este dia...</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0">
                    <button className="w-full bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold text-sm uppercase tracking-wide py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                        Criar Agendamento
                    </button>
                </div>

            </div>
        </div>
    );
};