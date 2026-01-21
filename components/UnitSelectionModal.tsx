
import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import AddUnitModal from './AddUnitModal';

interface Unit {
  id: string;
  name: string;
  description: string;
}

interface UnitSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (unit: Unit) => void;
}

const MOCK_UNITS: Unit[] = [
  { id: '1', name: 'CAPEC SEDE', description: 'Capec sede' },
  { id: '2', name: 'CAPEC 2', description: 'Unidade secundária' },
  { id: '3', name: 'UNIDADE NORTE', description: 'Distribuição regional norte' },
];

const UnitSelectionModal: React.FC<UnitSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!isOpen) return null;

  const filteredUnits = MOCK_UNITS.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewUnit = (data: any) => {
    console.log('Nova unidade cadastrada:', data);
    // Aqui você adicionaria à lista real. Por ora, apenas fecha.
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay com desfoque conforme a imagem */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
        
        {/* Modal Container */}
        <div className="relative bg-white w-full max-w-xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header do Modal */}
          <div className="p-6 pb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Selecione Unidade</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-blue-600 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all"
            >
              <Plus size={16} /> Add Unidade
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="px-6 py-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar Unidade"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* Lista de Unidades */}
          <div className="p-6 pt-4 space-y-3 max-h-[400px] overflow-y-auto">
            {filteredUnits.length > 0 ? (
              filteredUnits.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => onSelect(unit)}
                  className="w-full text-left p-5 border border-slate-100 rounded-[20px] hover:border-blue-400 hover:bg-blue-50/30 transition-all group shadow-sm hover:shadow-md"
                >
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {unit.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {unit.description}
                  </p>
                </button>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 text-sm">Nenhuma unidade encontrada.</p>
              </div>
            )}
          </div>

          {/* Botão de Fechar Mobile */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 md:hidden"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Segundo Modal: Add Nova Unidade */}
      <AddUnitModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddNewUnit} 
      />
    </>
  );
};

export default UnitSelectionModal;
