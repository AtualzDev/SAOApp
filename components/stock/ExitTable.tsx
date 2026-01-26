import React, { useEffect, useState } from 'react';
import { inventoryService, Transaction } from '../../services/inventoryService';
import { Search, Filter, Eye, Pencil, RefreshCw, Trash2, ArrowUpRight } from 'lucide-react';
import LaunchDetailsPanel from './LaunchDetailsPanel';

interface ExitTableProps {
  onEdit?: (transaction: Transaction) => void;
}

const ExitTable: React.FC<ExitTableProps> = ({ onEdit }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const EXIT_TYPES = ['Perda', 'Uso Interno', 'Troca', 'Doação (Saída)', 'Saída', 'Doação'];

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.listTransactions();
      // Filter for exits (using category provided by backend)
      const exits = data.filter((t: Transaction) => t.category === 'exit');
      setTransactions(exits);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'concluído': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pendente': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelado': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-700">Histórico de Saídas</h2>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
            {transactions.length} registros
          </span>
          <button onClick={fetchTransactions} title="Atualizar" className="p-1 text-slate-400 hover:text-blue-600">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por código ou destino..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
            Filtrar <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CÓDIGO / DATA</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">DESTINO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SOLICITANTE</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ITENS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">STATUS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={6} className="p-12 text-center text-slate-500">Carregando histórico...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={6} className="p-12 text-center text-red-500">Erro: {error}</td></tr>
            )}
            {!loading && !error && transactions.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center text-slate-400">Nenhuma saída registrada.</td></tr>
            )}
            {!loading && !error && transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">#{t.id.slice(0, 8).toUpperCase()}</span>
                    <span className="text-xs text-slate-400">{new Date(t.data_recebimento || t.created_at).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight size={14} className="text-slate-300" />
                    <span className="text-sm font-bold text-slate-700">{t.instituicao_beneficiada || '-'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {t.fornecedor || '-'}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-700">{t.items?.length || 0}</span>
                  <span className="text-xs text-slate-400 ml-1">unidades</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusColor(t.status || 'Concluído')}`}>
                    {t.status?.toUpperCase() || 'CONCLUÍDO'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      title="Visualizar"
                      onClick={() => setSelectedTransaction(t)}
                      className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Eye size={18} />
                    </button>
                    {/* Assuming we might want to edit or delete exits too */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (Static for now) */}
      {transactions.length > 0 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-end">
          <button className="text-xs font-bold text-slate-500 hover:text-rose-600">Exportar Relatório</button>
        </div>
      )}

      <LaunchDetailsPanel
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default ExitTable;
