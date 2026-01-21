
import React, { useState } from 'react';
import { PackageMinus, Save, X, Search, Plus, Trash2, Info, AlertCircle } from 'lucide-react';

interface ExitFormProps {
  onCancel: () => void;
}

const ExitForm: React.FC<ExitFormProps> = ({ onCancel }) => {
  const [items, setItems] = useState([{ id: 1, name: '', qty: 1, unit: 'un' }]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', qty: 1, unit: 'un' }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <PackageMinus size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Nova Saída de Estoque</h1>
            <p className="text-xs text-slate-400">Registre a baixa ou transferência de itens do inventário</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lado Esquerdo - Dados Gerais */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
               Informações do Destino
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Tipo de Saída</label>
                <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-medium cursor-pointer">
                  <option>Consumo Interno</option>
                  <option>Transferência entre Unidades</option>
                  <option>Descarte / Vencimento</option>
                  <option>Doação Externa</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Data da Saída</label>
                <input 
                  type="date" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Destino (Setor/Unidade)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Cozinha Central" 
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Responsável / Solicitante</label>
                <input 
                  type="text" 
                  placeholder="Nome do colaborador" 
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                 Itens para Baixa
              </h3>
              <button 
                onClick={addItem}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
              >
                <Plus size={14} /> Adicionar outro item
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-end bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="col-span-12 md:col-span-6 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Produto</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input 
                        type="text" 
                        placeholder="Buscar produto no estoque..." 
                        className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-400 transition-all"
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Quantidade</label>
                    <input 
                      type="number" 
                      defaultValue="1" 
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Unidade</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="kg" 
                      className="w-full h-10 px-3 bg-slate-100 border border-slate-100 rounded-lg text-xs text-slate-400 font-bold"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex justify-center pb-1">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito - Resumo e Alertas */}
        <div className="space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-[24px] shadow-xl shadow-indigo-200 relative overflow-hidden">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
               <Info size={16} className="text-indigo-300" /> Resumo da Operação
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-xs text-indigo-300">Total de Itens</span>
                <span className="text-sm font-bold">{items.length}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-xs text-indigo-300">Unidade Destino</span>
                <span className="text-sm font-bold">Cozinha Central</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-xs text-indigo-300">Valor Estimado</span>
                <span className="text-lg font-black">R$ 450,00</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[24px] space-y-3">
            <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
               <AlertCircle size={16} /> Atenção
            </h3>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Ao salvar, a quantidade será subtraída automaticamente do estoque atual. Verifique se os dados estão corretos antes de confirmar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase">Observações Adicionais</label>
            <textarea 
              rows={4} 
              placeholder="Justificativa da saída..." 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all resize-none"
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
        <button className="px-12 py-3 bg-[#E11D48] text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-all active:scale-95 flex items-center gap-2">
          <Save size={18} /> Confirmar Saída
        </button>
      </div>
    </div>
  );
};

export default ExitForm;
