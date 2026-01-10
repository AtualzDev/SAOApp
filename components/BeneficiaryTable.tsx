
import React from 'react';
import { Search, ChevronRight, User, FilterX } from 'lucide-react';

export interface Beneficiary {
  id: string;
  nome: string;
  status: 'Assistido' | 'Desativado';
  cpf: string;
  contato: string;
  foto?: string;
}

const MOCK_BENEFICIARIES: Beneficiary[] = [
  { id: '1', nome: 'ADRIANA SOARES ASSUNÇÃO', status: 'Assistido', cpf: '745.659.076-15', contato: '(31) 9 9846.5342', foto: 'https://i.pravatar.cc/150?u=adriana1' },
  { id: '2', nome: 'ADRIANA SOARES ASSUNÇÃO SS', status: 'Desativado', cpf: '745.659.076-15', contato: '(31) 9 8934.6933' },
  { id: '3', nome: 'ALISSON FILIPE NEVES DOS SANTOS', status: 'Assistido', cpf: '018.326.476-2', contato: '31 998205606', foto: 'https://i.pravatar.cc/150?u=alisson' },
  { id: '4', nome: 'AMARILDO SANTIAGO PALMERINI', status: 'Desativado', cpf: '972.465.226-20', contato: '(31) 92358-593' },
  { id: '5', nome: 'ANASTÁCIO RIBEIRO DA SILVA', status: 'Desativado', cpf: '200.874.706-91', contato: '(31) 9 2421.993' },
  { id: '6', nome: 'ANDREA ALCANTARA DE SOUSA', status: 'Assistido', cpf: '902.799.566-49', contato: '31984509391', foto: 'https://i.pravatar.cc/150?u=andrea' },
  { id: '7', nome: 'ANTONIO CARLOS DA SILVA', status: 'Assistido', cpf: '475.412.705-34', contato: '31 998710727', foto: 'https://i.pravatar.cc/150?u=antonio' },
];

interface BeneficiaryTableProps {
  onNew: () => void;
}

const BeneficiaryTable: React.FC<BeneficiaryTableProps> = ({ onNew }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500 max-w-full">
      {/* Header com Título e Botão Novo */}
      <div className="p-4 md:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Lista de assistidos</h1>
          <p className="text-sm text-slate-400 font-medium">Assistidos cadastrados 81</p>
        </div>
        <button 
          onClick={onNew}
          className="w-full sm:w-auto px-10 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-lg font-bold shadow-lg shadow-blue-500/10 transition-all active:scale-95"
        >
          Novo
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="px-4 md:px-6 lg:px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end border-b border-slate-100">
        <div className="lg:col-span-2 space-y-1.5">
          <select className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-blue-400 transition-all appearance-none cursor-pointer">
            <option>TODOS</option>
            <option>Assistido</option>
            <option>Desativado</option>
          </select>
        </div>
        <div className="lg:col-span-4 space-y-1.5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar assistido" 
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-300 outline-none focus:border-blue-400 transition-all"
            />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-1.5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar por Patologias" 
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-300 outline-none focus:border-blue-400 transition-all"
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          <button className="w-full h-11 flex items-center justify-center gap-2 bg-[#D1D5DB] text-white rounded-lg text-sm font-bold cursor-not-allowed opacity-80 whitespace-nowrap">
            Resetar Filtros
          </button>
        </div>
      </div>

      {/* Tabela com scroll horizontal interno apenas para os dados */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-4 md:px-8 py-5">ASSISTIDO</th>
              <th className="px-4 md:px-8 py-5">STATUS</th>
              <th className="px-4 md:px-8 py-5">CPF</th>
              <th className="px-4 md:px-8 py-5">CONTATO</th>
              <th className="px-4 md:px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_BENEFICIARIES.map((ben) => (
              <tr key={ben.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 md:px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 border border-slate-200 overflow-hidden flex items-center justify-center">
                      {ben.foto ? (
                        <img src={ben.foto} alt={ben.nome} className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} className="text-slate-300" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-600 truncate max-w-[200px] md:max-w-[280px]">{ben.nome}</span>
                  </div>
                </td>
                <td className="px-4 md:px-8 py-4">
                  <span className={`text-sm font-bold ${ben.status === 'Assistido' ? 'text-[#3B82F6]' : 'text-[#EF4444]'}`}>
                    {ben.status}
                  </span>
                </td>
                <td className="px-4 md:px-8 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">
                  {ben.cpf}
                </td>
                <td className="px-4 md:px-8 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">
                  {ben.contato}
                </td>
                <td className="px-4 md:px-8 py-4 text-right">
                  <button className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3B82F6] hover:underline transition-all">
                    Detalhes <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Paginação */}
      <div className="p-4 md:p-8 border-t border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400 font-medium tracking-tight text-center sm:text-left">
          Monitorando o cadastro de beneficiários ativos.
        </p>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-400 hover:bg-white transition-colors">Anterior</button>
           <button className="px-4 py-2 rounded-lg bg-[#1E40AF] text-white text-xs font-bold shadow-md">1</button>
           <button className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white transition-colors">Próximo</button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryTable;
