
import React, { useEffect, useState } from 'react';
import { inventoryService, Transaction } from '../../services/inventoryService';
import { Search, Filter, Eye, Pencil, RefreshCw } from 'lucide-react';
import LaunchDetailsPanel from './LaunchDetailsPanel';

interface LaunchTableProps {
  launches?: any[];
  onEdit?: (transaction: Transaction) => void;
}

const LaunchTable: React.FC<LaunchTableProps> = ({ onEdit }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Fetch only ENTRIES (Lançamentos/Entradas)
      const data = await inventoryService.listEntries();
      setTransactions(data);
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-700">Lista de lançamentos</h2>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
            {transactions.length} lançamentos
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
              placeholder="Buscar por item..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
            Filtrar por <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CÓDIGO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">RECEBIMENTO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">FORNECEDOR</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">QUANTIDADE</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">NOTA FISCAL</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">TIPO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={7} className="p-4 text-center text-slate-500">Carregando...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={7} className="p-4 text-center text-red-500">{error}</td></tr>
            )}
            {!loading && !error && transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                  #{t.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(t.data_recebimento || t.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700 max-w-[200px] truncate">
                  {t.fornecedor || t.instituicao_beneficiada || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 font-bold text-center">
                  {t.items?.length || 0}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600 text-right">
                  {t.numero_nota || 'Sem nota'}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-center">
                  <span className={`${t.tipo === 'Compra' ? 'text-green-500' : 'text-blue-600'}`}>
                    {t.tipo}
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
                    <button
                      title="Editar"
                      onClick={() => onEdit && onEdit(t)}
                      className="p-2 text-slate-300 hover:text-[#1E40AF] hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
        <p className="text-xs text-slate-400">Mostrando {transactions.length} registros</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded border border-slate-200 text-xs text-slate-400 disabled:opacity-30" disabled>Anterior</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-bold">1</button>
          <button className="px-3 py-1 rounded border border-slate-200 text-xs text-slate-500 disabled:opacity-30" disabled>Próximo</button>
        </div>
      </div>

      <LaunchDetailsPanel
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default LaunchTable;
