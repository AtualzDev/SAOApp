import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Package, Activity, Calendar, X, AlertCircle, ChevronLeft, ChevronRight, Layers, Palette, Check } from 'lucide-react';
import { mockProcedures } from '../../utils/mockData';
import { Procedure, ProcedureType } from '../../types';

export const ProceduresList: React.FC = () => {
  const [procedures, setProcedures] = useState<Procedure[]>(mockProcedures);
  const [filterType, setFilterType] = useState<ProcedureType>('individual');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProcedure, setCurrentProcedure] = useState<Procedure | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    type: 'individual' as ProcedureType,
    description: '',
    sessions: '',
    professionalPercentage: '',
    color: '#7B61FF' // Default color
  });

  // Calculated shares for display
  const [shares, setShares] = useState({ professional: 0, clinic: 0 });

  // Update calculations whenever price or percentage changes
  useEffect(() => {
    const price = parseFloat(formData.price) || 0;
    const percentage = parseFloat(formData.professionalPercentage) || 0;

    const professionalShare = price * (percentage / 100);
    const clinicShare = price - professionalShare;

    setShares({
      professional: professionalShare,
      clinic: clinicShare
    });
  }, [formData.price, formData.professionalPercentage]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const PRESET_COLORS = [
    '#7B61FF', // Primary Purple
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#8B5CF6', // Violet
    '#1F2937', // Gray/Black
  ];

  const handleOpenCreate = () => {
    setCurrentProcedure(null);
    setFormData({
      name: '',
      price: '',
      type: filterType,
      description: '',
      sessions: '',
      professionalPercentage: '',
      color: '#7B61FF'
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (proc: Procedure) => {
    setCurrentProcedure(proc);
    setFormData({
      name: proc.name,
      price: proc.price.toString(),
      type: proc.type,
      description: proc.description || '',
      sessions: proc.sessions ? proc.sessions.toString() : '',
      professionalPercentage: proc.professionalPercentage ? proc.professionalPercentage.toString() : '',
      color: proc.customColor || '#7B61FF'
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (proc: Procedure) => {
    setCurrentProcedure(proc);
    setIsDeleteModalOpen(true);
  };

  const handleSave = () => {
    const priceValue = parseFloat(formData.price.replace(',', '.')) || 0;
    const sessionsValue = formData.type === 'pacote' ? parseInt(formData.sessions) || 0 : undefined;
    const percentageValue = parseFloat(formData.professionalPercentage) || 0;

    if (currentProcedure) {
      // Edit
      setProcedures(procedures.map(p =>
        p.id === currentProcedure.id
          ? {
            ...p,
            name: formData.name,
            price: priceValue,
            type: formData.type,
            description: formData.description,
            sessions: sessionsValue,
            professionalPercentage: percentageValue,
            customColor: formData.color
          }
          : p
      ));
    } else {
      // Create
      const newProc: Procedure = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        price: priceValue,
        type: formData.type,
        colorClass: 'border-gray-200', // Default fallback
        customColor: formData.color,
        description: formData.description,
        sessions: sessionsValue,
        professionalPercentage: percentageValue
      };
      setProcedures([...procedures, newProc]);
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (currentProcedure) {
      setProcedures(procedures.filter(p => p.id !== currentProcedure.id));
      setIsDeleteModalOpen(false);
      // Adjust current page if necessary after deletion
      const remainingCount = procedures.filter(p => p.type === filterType).length - 1;
      const maxPages = Math.ceil(remainingCount / ITEMS_PER_PAGE);
      if (currentPage > maxPages && maxPages > 0) {
        setCurrentPage(maxPages);
      }
    }
  };

  // Filter Logic
  const filteredProcedures = procedures.filter(p => p.type === filterType);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProcedures.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredProcedures.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (type: ProcedureType) => {
    setFilterType(type);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // UI Helpers
  const getIcon = (type: ProcedureType) => {
    switch (type) {
      case 'pacote': return <Package size={22} />;
      case 'mensal': return <Calendar size={22} />;
      default: return <Activity size={22} />;
    }
  };

  // Helper to get hex with transparency for backgrounds
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn pb-10">

      {/* Toolbar: Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 shrink-0">

        {/* Type Filter Tabs */}
        <div className="flex p-1.5 bg-white border border-gray-200 rounded-xl w-full md:w-auto overflow-x-auto shadow-sm">
          <button
            onClick={() => handleFilterChange('individual')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${filterType === 'individual' ? 'bg-[#7B61FF] text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <Activity size={16} />
            Individuais
          </button>
          <button
            onClick={() => handleFilterChange('pacote')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${filterType === 'pacote' ? 'bg-[#7B61FF] text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <Package size={16} />
            Pacotes
          </button>
          <button
            onClick={() => handleFilterChange('mensal')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${filterType === 'mensal' ? 'bg-[#7B61FF] text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <Calendar size={16} />
            Mensais
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={handleOpenCreate}
          className="bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 w-full md:w-auto justify-center whitespace-nowrap"
        >
          <Plus size={20} strokeWidth={2.5} />
          Novo Procedimento
        </button>
      </div>

      {/* Grid Content */}
      <div className="flex-1">
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {currentItems.map((procedure) => {
              // Use custom color if available, otherwise fallback (though we now set defaults)
              const displayColor = procedure.customColor || '#7B61FF';

              return (
                <div
                  key={procedure.id}
                  className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col relative overflow-hidden"
                  style={{ borderColor: hexToRgba(displayColor, 0.3) }}
                >
                  {/* Decorative Corner */}
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 opacity-30 transition-opacity group-hover:opacity-60"
                    style={{ background: `linear-gradient(to bottom left, ${displayColor}, transparent)` }}
                  ></div>

                  {/* Header */}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div
                      className="p-3.5 rounded-2xl shadow-sm"
                      style={{ backgroundColor: hexToRgba(displayColor, 0.1), color: displayColor }}
                    >
                      {getIcon(procedure.type)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-100 px-2 py-1 rounded-full bg-gray-50">
                      {procedure.type}
                    </span>
                  </div>

                  {/* Body */}
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1 pr-4">
                    {procedure.name}
                  </h3>

                  <div className="mb-6 flex-1">
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {procedure.description || 'Sem descrição definida para este procedimento.'}
                    </p>
                    {procedure.type === 'pacote' && procedure.sessions && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md w-fit">
                        <Layers size={12} />
                        {procedure.sessions} Sessões
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-end justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wide block mb-0.5">Valor</span>
                      <span className="text-xl font-bold text-gray-800 tracking-tight">
                        {formatPrice(procedure.price)}
                      </span>
                    </div>

                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(procedure)}
                        className="p-2 text-gray-400 hover:bg-indigo-50 rounded-lg transition-colors"
                        style={{ color: displayColor }}
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(procedure)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-gray-400 bg-white rounded-2xl border border-gray-200 border-dashed">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Activity size={32} className="opacity-30" />
            </div>
            <h3 className="font-bold text-gray-600 text-lg">Nenhum procedimento encontrado</h3>
            <p className="text-sm text-gray-500 mt-1">Não há itens cadastrados na categoria <strong>{filterType}</strong>.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-6 text-[#7B61FF] font-bold hover:underline"
            >
              Cadastrar o primeiro
            </button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredProcedures.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            Página <span className="text-gray-900 font-bold">{currentPage}</span> de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* --- Create/Edit Modal --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md shrink-0">
              <h3 className="font-bold text-gray-800 text-lg">
                {currentProcedure ? 'Editar Procedimento' : 'Novo Procedimento'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Color Picker Section */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Palette size={16} className="text-[#7B61FF]" /> Cor do Procedimento
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center
                                    ${formData.color === color ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                    >
                      {formData.color === color && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                  {/* Custom Color Input Wrapper */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-colors ml-1" title="Cor Personalizada">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Nome do Procedimento</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Fisioterapia Respiratória"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição do procedimento..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-sm font-bold text-gray-700">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ProcedureType })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                  >
                    <option value="individual">Individual</option>
                    <option value="pacote">Pacote</option>
                    <option value="mensal">Mensal</option>
                  </select>
                </div>

                {/* Sessions Count - Only for Packages */}
                {formData.type === 'pacote' && (
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <label className="text-sm font-bold text-gray-700">Qtd. Sessões</label>
                    <input
                      type="number"
                      value={formData.sessions}
                      onChange={(e) => setFormData({ ...formData, sessions: e.target.value })}
                      placeholder="10"
                      min="1"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                    />
                  </div>
                )}
              </div>

              {/* Financial Section */}
              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Configuração Financeira</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Valor (R$)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Comissão Prof. (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.professionalPercentage}
                        onChange={(e) => setFormData({ ...formData, professionalPercentage: e.target.value })}
                        placeholder="0"
                        max="100"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                    </div>
                  </div>
                </div>

                {/* Automatic Split Visualizer */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-center">
                    <p className="text-xs text-gray-500 font-medium mb-1">Parte da Clínica</p>
                    <p className="text-sm font-bold text-emerald-600">{formatPrice(shares.clinic)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-center">
                    <p className="text-xs text-gray-500 font-medium mb-1">Parte do Profissional</p>
                    <p className="text-sm font-bold text-indigo-600">{formatPrice(shares.professional)}</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 sticky bottom-0 z-10 backdrop-blur-md shrink-0">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200/50 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name || !formData.price || (formData.type === 'pacote' && !formData.sessions)}
                className="px-6 py-2 bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Modal --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fadeIn text-center p-6">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="font-bold text-gray-800 text-xl mb-2">Excluir Procedimento?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Tem certeza que deseja excluir <strong>{currentProcedure?.name}</strong>? Essa ação não pode ser desfeita.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
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