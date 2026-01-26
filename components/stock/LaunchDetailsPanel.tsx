
import React from 'react';
import { X, Printer, Pencil } from 'lucide-react';
import { Transaction } from '../../services/inventoryService';

interface LaunchDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

const LaunchDetailsPanel: React.FC<LaunchDetailsPanelProps> = ({ isOpen, onClose, transaction }) => {
    if (!isOpen || !transaction) return null;

    const totalValue = transaction.items?.reduce((acc, item) => acc + (Number(item.quantidade) * Number(item.valor_unitario)), 0) || 0;

    const isExit = transaction.category === 'exit' || ['Doação', 'Perda', 'Uso Interno', 'Troca', 'Saída'].includes(transaction.tipo);

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-2xl bg-[#F8FAFC] h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">

                {/* Header */}
                <div className="bg-white px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-800">
                        {isExit ? 'Detalhes desta Saída' : 'Detalhes do Lançamento'}
                    </h2>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                            <Printer size={16} /> Imprimir
                        </button>
                        {!isExit && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                                <Pencil size={16} /> Editar
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">

                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-100">
                            <span className="text-xs font-semibold text-slate-400 block mb-1">Tipo de lançamento</span>
                            <span className={`text-base font-bold ${transaction.tipo === 'Compra' ? 'text-green-500' : 'text-blue-600'}`}>
                                {transaction.tipo}
                            </span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100">
                            <span className="text-xs font-semibold text-slate-400 block mb-1">Nota</span>
                            <span className="text-base font-bold text-slate-700">
                                {transaction.numero_nota || 'Sem nota'}
                            </span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100">
                            <span className="text-xs font-semibold text-slate-400 block mb-1">
                                {isExit ? 'Data de Saída' : 'Recebimento'}
                            </span>
                            <span className="text-base font-bold text-slate-700">
                                {new Date(transaction.data_recebimento || transaction.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Entities Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Fornecedor / Solicitante */}
                        <div className="bg-white p-5 rounded-xl border border-slate-100">
                            <span className="text-xs font-semibold text-slate-400 block mb-1">
                                {isExit ? (transaction.tipo === 'Doação' ? 'Assistido' : 'Solicitante') : 'Fornecedor'}
                            </span>
                            <h3 className="font-bold text-slate-700 mb-1 text-lg">{transaction.fornecedor || 'Não informado'}</h3>
                        </div>

                        {/* Instituição / Destino */}
                        <div className="bg-white p-5 rounded-xl border border-slate-100">
                            <span className="text-xs font-semibold text-slate-400 block mb-1">
                                {isExit ? 'Destino' : 'Instituição'}
                            </span>
                            <h3 className="font-bold text-slate-700 mb-1 text-lg">{transaction.instituicao_beneficiada || 'Não informado'}</h3>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-700">Lista de itens</h3>
                        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">#</th>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase w-full">NOME DO ITEM</th>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">CATEGORIA</th>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase text-center">QUANTIDADE</th>
                                        {!isExit && <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase text-right">VALOR TOTAL</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {transaction.items?.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <td className="px-6 py-4 text-sm text-slate-400 font-medium">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.produto?.nome}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">Geral</td>
                                            <td className="px-6 py-4 text-sm text-slate-700 font-bold text-center">{item.quantidade}</td>
                                            {!isExit && (
                                                <td className="px-6 py-4 text-sm text-slate-700 font-bold text-right text-nowrap">
                                                    R$ {(Number(item.quantidade) * Number(item.valor_unitario)).toFixed(2)}
                                                </td>
                                            )}
                                        </tr>
                                    )) || (
                                            <tr>
                                                <td colSpan={isExit ? 4 : 5} className="p-6 text-center text-slate-400">Nenhum item encontrado neste lançamento.</td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Footer Total - Only for Entries */}
                {!isExit && (
                    <div className="bg-white p-8 border-t border-slate-100 flex items-center justify-end gap-6 sticky bottom-0">
                        <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total</span>
                        <span className="text-3xl font-bold text-slate-800">R$ {totalValue.toFixed(2)}</span>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LaunchDetailsPanel;
