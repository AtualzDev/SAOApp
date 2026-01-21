
import React from 'react';
import { Map, Save, X, Info, Users, Box } from 'lucide-react';

interface SectorFormProps {
  onCancel: () => void;
}

const SectorForm: React.FC<SectorFormProps> = ({ onCancel }) => {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Map size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Novo Setor de Estoque</h1>
            <p className="text-xs text-slate-400">Defina um novo local físico para armazenamento de itens</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
               <Info size={16} className="text-indigo-500" /> Identificação do Setor
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Nome do Setor</label>
                <input 
                  type="text" 
                  placeholder="Ex: Almoxarifado Central" 
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Localização Geográfica (Bloco / Sala)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Bloco B - 2º Andar" 
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
               <Users size={16} className="text-indigo-500" /> Responsabilidade
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Responsável Principal</label>
                <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all cursor-pointer font-medium">
                  <option>Selecione um colaborador</option>
                  <option>Maria Silva</option>
                  <option>Ricardo Santos</option>
                  <option>Ana Oliveira</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Status Operacional</label>
                <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all cursor-pointer font-medium">
                  <option>Ativo</option>
                  <option>Inativo</option>
                  <option>Em Manutenção</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-[24px] shadow-xl shadow-indigo-200">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Box size={16} className="text-indigo-300" /> Capacidade
            </h3>
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-indigo-300 uppercase">Capacidade Estimada (Itens)</label>
                <input 
                  type="number" 
                  defaultValue="1000" 
                  className="w-full h-11 px-4 bg-white/10 border border-white/20 rounded-xl text-sm outline-none focus:bg-white/20 focus:border-white/40 transition-all font-bold"
                />
            </div>
            <p className="text-[10px] text-indigo-300 mt-4 leading-relaxed font-medium">
              Este valor é utilizado apenas para controle estatístico e alertas de lotação do setor.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-[24px] space-y-3">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Observações</h4>
             <textarea 
               rows={4}
               placeholder="Notas sobre o acesso ou restrições do setor..."
               className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all resize-none font-medium"
             />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <button 
          onClick={onCancel}
          className="px-8 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button className="px-12 py-3 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-indigo-800 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
          <Save size={18} /> Salvar Setor
        </button>
      </div>
    </div>
  );
};

export default SectorForm;
