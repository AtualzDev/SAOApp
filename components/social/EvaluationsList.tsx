import React, { useState } from 'react';
import { ClipboardList, Plus, Search, Filter, Calendar, X, User, Activity } from 'lucide-react';
import { mockEvaluations } from '../../utils/mockData';
import { Evaluation } from '../../types';

export const EvaluationsList: React.FC = () => {
   const [evaluations, setEvaluations] = useState<Evaluation[]>(mockEvaluations);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');

   // Form State
   const [formData, setFormData] = useState({
      patientName: '',
      type: 'Ortopédica',
      date: new Date().toLocaleDateString('pt-BR'),
      professional: 'Márcio Andrei',
      status: 'Pendente' as 'Pendente' | 'Concluída'
   });

   const handleSave = () => {
      if (!formData.patientName) return;

      const newEvaluation: Evaluation = {
         id: Math.random().toString(36).substr(2, 9),
         patientName: formData.patientName,
         type: formData.type,
         date: formData.date,
         professional: formData.professional,
         status: formData.status
      };

      setEvaluations([newEvaluation, ...evaluations]);
      setIsModalOpen(false);

      // Reset form
      setFormData({
         patientName: '',
         type: 'Ortopédica',
         date: new Date().toLocaleDateString('pt-BR'),
         professional: 'Márcio Andrei',
         status: 'Pendente'
      });
   };

   const filteredEvaluations = evaluations.filter(ev =>
      ev.patientName.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="flex flex-col h-full animate-fadeIn pb-10 overflow-y-auto">

         {/* Header */}
         <div className="flex justify-between items-center mb-6 shrink-0">
            <h2 className="text-2xl font-bold text-gray-800">Avaliações</h2>
            <button
               onClick={() => setIsModalOpen(true)}
               className="bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-medium px-5 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
               <Plus size={18} /> <span className="hidden md:inline">Nova Avaliação</span>
            </button>
         </div>

         {/* Filters & Search */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
            <div className="relative w-full md:w-80">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                  type="text"
                  placeholder="Buscar por paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
               />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
               <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Filter size={16} /> Filtrar
               </button>
               <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Calendar size={16} /> Data
               </button>
            </div>
         </div>

         {/* List */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-[400px]">
            <div className="overflow-x-auto overflow-y-auto flex-1">
               <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                     <tr className="border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Paciente</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tipo</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Data</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Profissional</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredEvaluations.map((evaluation) => (
                        <tr key={evaluation.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                           <td className="px-6 py-4 font-semibold text-gray-800 group-hover:text-[#7B61FF] transition-colors">
                              {evaluation.patientName}
                           </td>
                           <td className="px-6 py-4 text-sm text-gray-600">{evaluation.type}</td>
                           <td className="px-6 py-4 text-sm text-gray-600">{evaluation.date}</td>
                           <td className="px-6 py-4 text-sm text-gray-600">{evaluation.professional}</td>
                           <td className="px-6 py-4 text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border
                            ${evaluation.status === 'Concluída'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                    : 'bg-amber-50 text-amber-600 border-amber-200'}
                            `}>
                                 {evaluation.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                     {filteredEvaluations.length === 0 && (
                        <tr>
                           <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                              <ClipboardList size={40} className="mx-auto mb-2 opacity-30" />
                              Nenhuma avaliação encontrada.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Create Modal */}
         {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
               <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <h3 className="font-bold text-gray-800 text-lg">Nova Avaliação</h3>
                     <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                     </button>
                  </div>

                  <div className="p-6 space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                           <User size={16} className="text-gray-400" /> Nome do Paciente
                        </label>
                        <input
                           type="text"
                           value={formData.patientName}
                           onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                           placeholder="Ex: João da Silva"
                           className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                           autoFocus
                        />
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                           <Activity size={16} className="text-gray-400" /> Tipo de Avaliação
                        </label>
                        <select
                           value={formData.type}
                           onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                           className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                        >
                           <option>Ortopédica</option>
                           <option>Neurológica</option>
                           <option>Respiratória</option>
                           <option>Pilates</option>
                           <option>Geriátrica</option>
                        </select>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-sm font-bold text-gray-700">Data</label>
                           <input
                              type="text"
                              value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-sm font-bold text-gray-700">Status</label>
                           <select
                              value={formData.status}
                              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Pendente' | 'Concluída' })}
                              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                           >
                              <option>Pendente</option>
                              <option>Concluída</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Profissional</label>
                        <input
                           type="text"
                           value={formData.professional}
                           onChange={(e) => setFormData({ ...formData, professional: e.target.value })}
                           className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
                        />
                     </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                     <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200/50 rounded-lg transition-colors"
                     >
                        Cancelar
                     </button>
                     <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold rounded-lg shadow-md transition-all"
                     >
                        Salvar
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};