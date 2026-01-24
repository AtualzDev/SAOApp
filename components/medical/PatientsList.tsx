import React, { useState } from 'react';
import { Search, ChevronRight, User, ChevronLeft } from 'lucide-react';
import { mockPatients } from '../../utils/mockData';

interface PatientsListProps {
    onPatientClick?: (patientId: string) => void;
}

export const PatientsList: React.FC<PatientsListProps> = ({ onPatientClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const filteredPatients = mockPatients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'Todos' || patient.status === filter;
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredPatients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleOpenProntuario = (patientId: string) => {
        if (onPatientClick) {
            onPatientClick(patientId);
        }
    };

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

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full animate-fadeIn overflow-hidden">
            {/* Header Toolbar */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800">Pacientes Cadastrados</h2>

                <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar paciente"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <select
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                    </select>

                    {/* Add Button */}
                    <button className="bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold text-sm px-6 py-2 rounded-lg transition-colors shadow-md shadow-indigo-200 whitespace-nowrap">
                        Add novo paciente
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {currentItems.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {currentItems.map((patient) => (
                            <div
                                key={patient.id}
                                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                                onClick={() => handleOpenProntuario(patient.id)}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                        {patient.image ? (
                                            <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="text-gray-400" size={20} />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#7B61FF] transition-colors truncate pr-2">{patient.name}</h3>
                                        {patient.secondaryInfo && (
                                            <p className="text-xs text-gray-500 truncate">{patient.secondaryInfo}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 md:gap-12 shrink-0">
                                    {/* Date */}
                                    <span className="hidden md:block text-sm font-medium text-gray-600 w-12 text-center">
                                        {patient.lastVisit || '-'}
                                    </span>

                                    {/* Status */}
                                    <div className="w-16 text-right">
                                        <span className={`text-sm font-semibold ${patient.status === 'Ativo' ? 'text-blue-600' : 'text-red-500'}`}>
                                            {patient.status}
                                        </span>
                                    </div>

                                    {/* Arrow Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenProntuario(patient.id);
                                        }}
                                        className="p-2 hover:bg-indigo-50 rounded-full transition-colors group-hover:text-[#7B61FF] text-gray-300"
                                        title="Abrir Prontuário"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <User size={48} className="mb-2 opacity-50" />
                        <p>Nenhum paciente encontrado.</p>
                    </div>
                )}
            </div>

            {/* Pagination Footer - Updated Layout */}
            {totalPages > 0 && (
                <div className="p-6 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronLeft size={16} /> Anterior
                    </button>

                    <div className="flex items-center gap-2">
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' && handlePageChange(page)}
                                disabled={page === '...'}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${page === currentPage
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
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        Próximo <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};