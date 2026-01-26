import React, { useRef } from 'react';
import { X, Printer, PackageCheck } from 'lucide-react';

interface DonationReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        id: string;
        beneficiary: string;
        date: string;
        destination: string;
        items: {
            productName: string;
            quantity: number;
            unit: string;
        }[];
        notes?: string;
    };
}

const DonationReceiptModal: React.FC<DonationReceiptModalProps> = ({ isOpen, onClose, data }) => {
    const receiptRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 print:p-0">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] print:shadow-none print:w-full print:max-w-none print:h-auto print:max-h-none print:rounded-none">

                {/* Header - Hidden in Print */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <PackageCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Comprovante de Doação</h2>
                            <p className="text-sm text-slate-500">Recibo gerado automaticamente</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Printable Area */}
                <div className="flex-1 overflow-auto p-8 print:p-0 print:overflow-visible" ref={receiptRef}>
                    <div className="print-content space-y-6 text-slate-800">
                        {/* Organization Header (Placeholder for Logo) */}
                        <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
                            <h1 className="text-2xl font-bold uppercase tracking-wide">ORGANIZAÇÃO SOCIAL</h1>
                            <p className="text-sm text-slate-600">Comprovante de Entrega de Doação</p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div>
                                <span className="block font-bold text-slate-400 uppercase text-xs">Beneficiário / Assistido</span>
                                <span className="font-semibold text-lg">{data.beneficiary}</span>
                            </div>
                            <div>
                                <span className="block font-bold text-slate-400 uppercase text-xs">Data da Entrega</span>
                                <span className="font-semibold text-lg">{new Date(data.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div>
                                <span className="block font-bold text-slate-400 uppercase text-xs">Local / Destino</span>
                                <span className="font-medium">{data.destination}</span>
                            </div>
                            <div>
                                <span className="block font-bold text-slate-400 uppercase text-xs">Recibo Nº</span>
                                <span className="font-medium font-mono">{data.id}</span>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mt-8">
                            <h3 className="font-bold text-sm uppercase border-b border-slate-300 pb-2 mb-2">Itens Entregues</h3>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500">
                                        <th className="py-2">Item</th>
                                        <th className="py-2 text-right">Qtd.</th>
                                        <th className="py-2 pl-4">Unidade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-2 font-medium">{item.productName}</td>
                                            <td className="py-2 text-right font-bold">{item.quantity}</td>
                                            <td className="py-2 pl-4 text-slate-500 text-xs">{item.unit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Signatures */}
                        <div className="mt-16 grid grid-cols-2 gap-12 pt-12">
                            <div className="text-center">
                                <div className="border-t border-slate-400 w-full mb-2"></div>
                                <p className="text-xs uppercase text-slate-500 font-bold">Assinatura do Responsável</p>
                            </div>
                            <div className="text-center">
                                <div className="border-t border-slate-400 w-full mb-2"></div>
                                <p className="text-xs uppercase text-slate-500 font-bold">Assinatura do Beneficiário</p>
                            </div>
                        </div>

                        {data.notes && (
                            <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 italic">
                                Observações: {data.notes}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions - Hidden in Print */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3 print:hidden">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-bold hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-900/20 flex items-center gap-2"
                    >
                        <Printer size={18} /> Imprimir Comprovante
                    </button>
                </div>

                {/* Print Styles */}
                <style>{`
            @media print {
                body * {
                    visibility: hidden;
                }
                .fixed.inset-0.z-\\[80\\] {
                    position: absolute;
                    inset: 0;
                    padding: 0;
                    background: white;
                    display: block;
                    visibility: visible;
                }
                .print-content, .print-content * {
                    visibility: visible;
                }
                .print-content {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 20px;
                }
                /* Hide everything else */
                nav, aside, header, footer {
                    display: none !important;
                }
            }
        `}</style>
            </div>
        </div>
    );
};

export default DonationReceiptModal;
