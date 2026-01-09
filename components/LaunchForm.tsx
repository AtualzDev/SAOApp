
import React, { useState } from 'react';
import { Pencil, Plus, Trash2, SquarePlus } from 'lucide-react';
import UnitSelectionModal from './UnitSelectionModal';
import AddCategoryModal from './AddCategoryModal';

interface LaunchFormProps {
  onCancel: () => void;
}

const LaunchForm: React.FC<LaunchFormProps> = ({ onCancel }) => {
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState({ name: 'CAPEC 2' });

  const handleSelectUnit = (unit: any) => {
    setSelectedUnit(unit);
    setIsUnitModalOpen(false);
  };

  const handleSaveCategory = (data: any) => {
    console.log('Nova categoria adicionada:', data);
    // Logica de salvamento aqui
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full bg-[#F8FAFC]">
      {/* Header do Formulário */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-700">Novo lançamento</h1>
        <span className="text-slate-400 text-sm font-medium">ID: #UZ41YYLW</span>
      </div>

      {/* Grid Principal de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tipo de lançamento */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-500">Tipo de lançamento</label>
          <div className="relative">
            <select className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all appearance-none cursor-pointer">
              <option>Doação</option>
              <option>Compra</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-500">Status</label>
          <div className="relative">
            <select className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all appearance-none cursor-pointer">
              <option>Com nota</option>
              <option>Sem nota</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Data da Emissão */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-500">Data da Emissão</label>
          <input 
            type="text" 
            placeholder="06/01/2026" 
            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Data do recebimento */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-500">Data do recebimento</label>
          <input 
            type="text" 
            placeholder="06/01/2026" 
            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Seção de Cards (Instituição e Fornecedor) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-600">Instituição beneficiada</h3>
            <button 
              onClick={() => setIsUnitModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-blue-600 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors"
            >
              <Pencil size={14} /> Editar
            </button>
          </div>
          <p className="text-lg font-bold text-slate-700">{selectedUnit.name}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-600">Fornecedor:</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-blue-600 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
              Add Fornecedor
            </button>
          </div>
          <div className="h-7"></div>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700">Lista de itens</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3 w-8 text-center">#</th>
                  <th className="px-4 py-3 min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span>Item</span>
                      <button className="flex items-center gap-1 text-blue-600 font-bold normal-case hover:underline">
                        Add item <SquarePlus size={14} className="border-2 border-dashed border-blue-600 rounded-sm" />
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-3">VALIDADE</th>
                  <th className="px-4 py-3">SETOR</th>
                  <th className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span>CATEGORIA</span>
                      <button 
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="flex items-center gap-1 text-blue-600 font-bold normal-case hover:underline"
                      >
                        Add <SquarePlus size={14} className="border-2 border-dashed border-blue-600 rounded-sm" />
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-3">QUANT.</th>
                  <th className="px-4 py-3">UNI. MEDIDA</th>
                  <th className="px-4 py-3">VALOR UNIT</th>
                  <th className="px-4 py-3">VALOR TOTAL</th>
                  <th className="px-4 py-3 text-center">AÇÃO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 text-slate-400 font-medium text-center">1</td>
                  <td className="px-4 py-3">
                    <input 
                      type="text" 
                      className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-slate-600 placeholder:text-slate-300 focus:border-blue-400 outline-none transition-all" 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="text" 
                      placeholder="Ex: 00/00/0000" 
                      className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-slate-600 placeholder:text-slate-300 focus:border-blue-400 outline-none transition-all" 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select className="w-full h-10 bg-white border border-slate-200 rounded-lg px-2 text-slate-500 focus:border-blue-400 outline-none transition-all cursor-pointer">
                      <option>Setor</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select className="w-full h-10 bg-white border border-slate-200 rounded-lg px-2 text-slate-500 focus:border-blue-400 outline-none transition-all cursor-pointer">
                      <option>Alimentação</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="text" 
                      defaultValue="1" 
                      className="w-full h-10 bg-white border border-slate-200 rounded-lg px-2 text-center text-slate-600 focus:border-blue-400 outline-none transition-all" 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select className="w-full h-10 bg-white border border-slate-200 rounded-lg px-2 text-slate-500 focus:border-blue-400 outline-none transition-all cursor-pointer">
                      <option>Ex: Caixa</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="text" 
                      placeholder="Ex: R$ 12,45" 
                      className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-slate-600 placeholder:text-slate-300 focus:border-blue-400 outline-none transition-all" 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="text" 
                      placeholder="Ex: R$ 12,45" 
                      className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-slate-400 placeholder:text-slate-300 cursor-not-allowed outline-none" 
                      readOnly 
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-orange-400 hover:text-orange-600 transition-colors p-2 hover:bg-orange-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Botão Add Novo Item */}
        <button className="flex items-center gap-2 px-5 py-2.5 border border-dashed border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all">
          <Plus size={18} /> Add novo item
        </button>

        {/* Totalizador */}
        <div className="flex flex-col items-end gap-1 mt-6">
          <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total</span>
          <span className="text-3xl font-bold text-slate-800">R$ 0,00</span>
        </div>
      </div>

      {/* Anotações */}
      <div className="space-y-1.5 pt-4">
        <label className="text-sm font-bold text-slate-600">Anotações</label>
        <textarea 
          placeholder="Observações" 
          rows={4}
          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-600 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 resize-none transition-all"
        ></textarea>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6">
        <button 
          onClick={onCancel}
          className="px-10 py-3 border border-slate-200 text-slate-500 rounded-lg font-bold hover:bg-slate-50 hover:text-slate-700 transition-all"
        >
          Cancelar
        </button>
        <button className="px-14 py-3 bg-[#1E40AF] text-white rounded-lg font-bold hover:bg-blue-800 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
          Salvar
        </button>
      </div>

      {/* Modais */}
      <UnitSelectionModal 
        isOpen={isUnitModalOpen} 
        onClose={() => setIsUnitModalOpen(false)} 
        onSelect={handleSelectUnit}
      />
      
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default LaunchForm;
