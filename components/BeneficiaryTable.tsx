
import React, { useEffect, useState } from 'react';
import { Search, ChevronRight, User } from 'lucide-react';
import { supabase } from '../services/supabase';

export interface Beneficiary {
  id: string;
  nome: string;
  status: string;
  cpf: string;
  telefone: string;
  foto_url?: string;
}

interface BeneficiaryTableProps {
  onNew: () => void;
}

const BeneficiaryTable: React.FC<BeneficiaryTableProps> = ({ onNew }) => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBeneficiaries();
  }, [filterStatus]);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('ASSISTIDOS')
        .select('*')
        .order('nome', { ascending: true });

      if (filterStatus !== 'TODOS') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar assistidos:', error);
      } else {
        setBeneficiaries(data || []);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter(ben =>
    ben.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ben.cpf?.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500 max-w-full">
      {/* Header com Título e Botão Novo */}
      <div className="p-4 md:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Lista de assistidos</h1>
          <p className="text-sm text-slate-400 font-medium">Assistidos cadastrados {filteredBeneficiaries.length}</p>
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-blue-400 transition-all appearance-none cursor-pointer"
          >
            <option value="TODOS">TODOS</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Assistido">Assistido</option>
            <option value="Desativado">Desativado</option>
          </select>
        </div>
        <div className="lg:col-span-4 space-y-1.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar assistido"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-300 outline-none focus:border-blue-400 transition-all"
            />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-1.5">
          <div className="relative">
            {/* Search by pathology functionality could be added here if needed in backend query */}
            <input
              type="text"
              placeholder="Buscar por Patologias"
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-300 outline-none focus:border-blue-400 transition-all"
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          <button
            onClick={() => { setFilterStatus('TODOS'); setSearchTerm(''); }}
            className="w-full h-11 flex items-center justify-center gap-2 bg-[#D1D5DB] hover:bg-slate-400 text-white rounded-lg text-sm font-bold whitespace-nowrap transition-colors"
          >
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
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">Carregando assistidos...</td>
              </tr>
            ) : filteredBeneficiaries.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">Nenhum assistido encontrado.</td>
              </tr>
            ) : (
              filteredBeneficiaries.map((ben) => (
                <tr key={ben.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 md:px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 border border-slate-200 overflow-hidden flex items-center justify-center">
                        {ben.foto_url ? (
                          <img src={ben.foto_url} alt={ben.nome} className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} className="text-slate-300" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-600 truncate max-w-[200px] md:max-w-[280px]">{ben.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-4">
                    <span className={`text-sm font-bold ${ben.status === 'Assistido' || ben.status === 'Ativo' ? 'text-[#3B82F6]' : 'text-[#EF4444]'}`}>
                      {ben.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-8 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">
                    {ben.cpf}
                  </td>
                  <td className="px-4 md:px-8 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">
                    {ben.telefone}
                  </td>
                  <td className="px-4 md:px-8 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3B82F6] hover:underline transition-all">
                      Detalhes <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Paginação (Estático por enquanto, pode ser implementado depois) */}
      <div className="p-4 md:p-8 border-t border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400 font-medium tracking-tight text-center sm:text-left">
          Monitorando o cadastro de beneficiários ativos.
        </p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-400 hover:bg-white transition-colors" disabled>Anterior</button>
          <button className="px-4 py-2 rounded-lg bg-[#1E40AF] text-white text-xs font-bold shadow-md">1</button>
          <button className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white transition-colors">Próximo</button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryTable;
