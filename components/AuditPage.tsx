
import React, { useState } from 'react';
import { Search, RotateCcw, CheckCircle, Trash2, ClipboardCheck, Info } from 'lucide-react';

interface Batch {
  id: string;
  codigoLancamento: string;
  vencimento: string;
  status: string;
  quantidade: number;
  valorUnit: number;
}

interface ProductAudit {
  id: string;
  nome: string;
  quantidadeTotal: number;
  categoria: string;
  setor: string;
  lotes: Batch[];
}

const MOCK_AUDIT_DATA: ProductAudit[] = [
  {
    id: '1',
    nome: 'Arroz 1 kg',
    quantidadeTotal: 16,
    categoria: '--',
    setor: '--',
    lotes: [
      { id: 'b1', codigoLancamento: '#TYZ4AWW0', vencimento: '09/02/25', status: '', quantidade: 3, valorUnit: 15.00 },
      { id: 'b2', codigoLancamento: '#FZDRXC4H', vencimento: '30/06/26', status: 'Em Dia', quantidade: 3, valorUnit: 5.49 },
      { id: 'b3', codigoLancamento: '#9O5K9D3Z', vencimento: '31/07/26', status: 'Em Dia', quantidade: 8, valorUnit: 5.49 },
      { id: 'b4', codigoLancamento: '#BXSAZTHO', vencimento: '31/08/26', status: 'Em Dia', quantidade: 2, valorUnit: 5.49 },
    ]
  }
];

const AuditPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('Arroz 1 kg');
  const [selectedProduct, setSelectedProduct] = useState<ProductAudit | null>(MOCK_AUDIT_DATA[0]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      {/* Header Superior */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Auditoria</h1>
        <button className="px-8 py-2.5 bg-[#4338CA] hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
          Salva Auditoria
        </button>
      </div>

      {/* Seção de Busca */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-3 min-w-[150px]">
            <h2 className="text-lg font-bold text-slate-700 whitespace-nowrap">Lista de itens</h2>
            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
              {selectedProduct ? '1 itens' : '0 itens'}
            </span>
          </div>

          <div className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Arroz 1 kg|"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
              />
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2">
              Resetar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Resultado de Busca */}
      {selectedProduct && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/30">
                  <th className="px-8 py-4">NOME DO ITEM</th>
                  <th className="px-8 py-4 text-center">QUANTIDADE</th>
                  <th className="px-8 py-4 text-center">CATEGORIA</th>
                  <th className="px-8 py-4 text-center">SETOR</th>
                  <th className="px-8 py-4 text-right">AÇÃO</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-50">
                  <td className="px-8 py-6 text-sm font-bold text-slate-700">{selectedProduct.nome}</td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-600 text-center">{selectedProduct.quantidadeTotal}</td>
                  <td className="px-8 py-6 text-sm text-slate-400 text-center">{selectedProduct.categoria}</td>
                  <td className="px-8 py-6 text-sm text-slate-400 text-center">{selectedProduct.setor}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="px-6 py-2 bg-slate-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 border border-slate-100 transition-all">
                      Confirmar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sub-tabela de Lotes Detalhados */}
          <div className="p-8 bg-slate-50/30">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">NOME DO ITEM</th>
                    <th className="px-6 py-4">LANÇAMENTO</th>
                    <th className="px-6 py-4">VENCIMENTO</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4 text-center">QUANT.</th>
                    <th className="px-6 py-4 text-right">VALOR UNIT.</th>
                    <th className="px-6 py-4 text-right">TOTAL</th>
                    <th className="px-6 py-4 text-center">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedProduct.lotes.map((lote) => (
                    <tr key={lote.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{selectedProduct.nome}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">{lote.codigoLancamento}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{lote.vencimento}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-500">
                        {lote.status && (
                          <span className="text-slate-500">{lote.status}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-slate-700">{lote.quantidade}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-slate-500">
                        {formatCurrency(lote.valorUnit)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-700">
                        {formatCurrency(lote.quantidade * lote.valorUnit)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button className="text-blue-600 hover:text-blue-800 text-xs font-black underline decoration-2 underline-offset-4">
                            Auditar
                          </button>
                          <button className="text-red-500 hover:text-red-700 text-xs font-black underline decoration-2 underline-offset-4">
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!selectedProduct && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <ClipboardCheck size={48} className="text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium text-sm">Pesquise um produto para iniciar a auditoria de lotes.</p>
        </div>
      )}

      {/* Nota Informativa */}
      <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl max-w-2xl">
        <Info size={18} className="text-indigo-500 flex-shrink-0" />
        <p className="text-xs text-indigo-700 font-medium leading-relaxed">
          O módulo de auditoria permite verificar fisicamente se a quantidade em estoque condiz com o sistema, lote por lote, garantindo a integridade do inventário.
        </p>
      </div>
    </div>
  );
};

export default AuditPage;
