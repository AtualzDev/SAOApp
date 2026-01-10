
import React from 'react';
import { User, Save, X, Info, Phone, CreditCard, Shield } from 'lucide-react';

interface BeneficiaryFormProps {
  onCancel: () => void;
}

const BeneficiaryForm: React.FC<BeneficiaryFormProps> = ({ onCancel }) => {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Novo Cadastro de Assistido</h1>
            <p className="text-xs text-slate-400">Insira as informações do novo beneficiário no sistema</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado Esquerdo - Dados Pessoais */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
               <Info size={16} className="text-blue-500" /> Identificação Pessoal
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase">Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Ex: Maria Soares da Silva" 
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">CPF</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      placeholder="000.000.000-00" 
                      className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Data de Nascimento</label>
                  <input 
                    type="date" 
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Celular / Contato</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      placeholder="(00) 0 0000-0000" 
                      className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Status Inicial</label>
                  <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium cursor-pointer">
                    <option>Assistido</option>
                    <option>Desativado</option>
                    <option>Em Triagem</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
               Patologias e Condições Médicas
            </h3>
            <textarea 
              rows={4} 
              placeholder="Descreva patologias, alergias ou observações médicas importantes..." 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all resize-none font-medium"
            />
          </div>
        </div>

        {/* Lado Direito - Foto e Documentação */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
               <User className="text-slate-300 group-hover:text-blue-400 transition-colors" size={32} />
               <span className="text-[9px] font-black text-slate-400 group-hover:text-blue-500 uppercase tracking-widest">Add Foto</span>
            </div>
            <p className="mt-4 text-[10px] text-slate-400 font-medium">Capture ou faça upload de uma foto nítida do assistido.</p>
          </div>

          <div className="bg-blue-900 text-white p-6 rounded-[24px] shadow-xl shadow-blue-200">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
               <Shield size={16} className="text-blue-300" /> Segurança de Dados
            </h3>
            <p className="text-[11px] text-blue-100 leading-relaxed font-medium">
              As informações cadastrais de assistidos são protegidas por criptografia e acessíveis apenas por gestores autorizados.
            </p>
            <div className="mt-6 flex items-center gap-2 p-3 bg-white/10 rounded-xl border border-white/10">
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-wider">Conformidade LGPD Ativa</span>
            </div>
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
        <button className="px-12 py-3 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-blue-800 shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
          <Save size={18} /> Salvar Cadastro
        </button>
      </div>
    </div>
  );
};

export default BeneficiaryForm;
