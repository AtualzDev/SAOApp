
import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Clock, 
  Bed, 
  Stethoscope, 
  Scale, 
  Search, 
  AlertCircle,
  ChevronRight,
  Info,
  Calendar
} from 'lucide-react';

interface SocialRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  mode?: 'create' | 'edit';
  initialData?: any;
}

type RequestType = 'doacao' | 'emprestimo' | 'hospedagem' | 'exame' | 'juridico';

const SocialRequestModal: React.FC<SocialRequestModalProps> = ({ isOpen, onClose, onSave, mode = 'create', initialData }) => {
  const [activeType, setActiveType] = useState<RequestType>('doacao');
  const [searchBeneficiary, setSearchBeneficiary] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setSearchBeneficiary(initialData.beneficiary || '');
      // Mapear tipos baseados no initialData (simulação)
      if (initialData.items?.toLowerCase().includes('cadeira')) setActiveType('emprestimo');
      else setActiveType('doacao');
    } else if (isOpen) {
      // Reset para criação
      setSearchBeneficiary('');
      setActiveType('doacao');
      setIsUrgent(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const categories = [
    { id: 'doacao', label: 'Doação', icon: <ShoppingBag size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'emprestimo', label: 'Empréstimo', icon: <Clock size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'hospedagem', label: 'Hospedagem', icon: <Bed size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'exame', label: 'Solicitar Exame', icon: <Stethoscope size={20} />, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'juridico', label: 'Apoio Jurídico', icon: <Scale size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {mode === 'edit' ? 'Editar Solicitação Social' : 'Nova Solicitação Social'}
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              {mode === 'edit' ? 'Atualize as informações do auxílio' : 'Selecione o tipo de auxílio para o assistido'}
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[500px]">
          <div className="w-full lg:w-72 bg-slate-50/50 p-6 space-y-2 border-r border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Categorias</p>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveType(cat.id as RequestType)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm ${
                  activeType === cat.id 
                    ? 'bg-white text-slate-800 shadow-md shadow-slate-200/50' 
                    : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-xl ${activeType === cat.id ? cat.bg + ' ' + cat.color : 'bg-slate-100 text-slate-300'}`}>
                  {cat.icon}
                </div>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-8 space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Assistido Beneficiário</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Pesquisar por nome ou CPF..."
                  value={searchBeneficiary}
                  onChange={(e) => setSearchBeneficiary(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {activeType === 'doacao' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase">Item Solicitado</label>
                      <select className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none cursor-pointer">
                        <option>Cesta Básica Familiar</option>
                        <option>Kit Higiene Pessoal</option>
                        <option>Leite Especial</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase">Quantidade</label>
                      <input type="number" defaultValue="1" className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" />
                    </div>
                  </div>
                </div>
              )}
              {/* Outros tipos seguem o mesmo padrão... */}
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Justificativa Social / Observações</label>
                <textarea 
                  rows={3}
                  placeholder="Descreva a necessidade do assistido..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none resize-none focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" checked={isUrgent} onChange={() => setIsUrgent(!isUrgent)} />
                    <div className={`w-10 h-6 rounded-full transition-all ${isUrgent ? 'bg-rose-500' : 'bg-slate-200'}`} />
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isUrgent ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className={`text-sm font-bold ${isUrgent ? 'text-rose-600' : 'text-slate-500'}`}>Solicitação Urgente</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button onClick={onClose} className="px-10 py-3 text-slate-400 font-bold hover:text-slate-600 transition-all">Cancelar</button>
              <button onClick={() => onSave({})} className="px-14 py-3 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
                {mode === 'edit' ? 'Salvar Alterações' : 'Gerar Solicitação'} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialRequestModal;
