import React, { useState } from 'react';
import { Save, Activity } from 'lucide-react';
import { supabase } from '../../services/supabase';
import SuccessFeedbackModal from '../common/SuccessFeedbackModal';

interface BeneficiaryBenefitsProps {
    beneficiaryId: string;
    data: any;
    onRefresh: () => void;
}

const BeneficiaryBenefits: React.FC<BeneficiaryBenefitsProps> = ({ beneficiaryId, data, onRefresh }) => {
    const [saving, setSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [services, setServices] = useState<string[]>(data?.servicos_saude || []);

    const healthServicesOptions = [
        'Não precisa',
        'Fisioterapia',
        'Terapia ocupacional',
        'Psicologia',
        'Fonoaudiologia',
        'Outros'
    ];

    const handleToggle = (service: string) => {
        if (services.includes(service)) {
            setServices(services.filter(s => s !== service));
        } else {
            setServices([...services, service]);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('assistidos')
                .update({ servicos_saude: services })
                .eq('id', beneficiaryId);

            if (error) throw error;
            setShowSuccessModal(true);
            onRefresh();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Erro ao salvar dados.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
            <SuccessFeedbackModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message="Benefícios de saúde atualizados com sucesso."
                title="Alterações Salvas"
            />

            <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                        <Activity size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Identificação do beneficiário (Saúde)</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {healthServicesOptions.map((option) => (
                        <label
                            key={option}
                            className={`
                            flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                            ${services.includes(option)
                                    ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm'
                                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}
                        `}
                        >
                            <input
                                type="checkbox"
                                checked={services.includes(option)}
                                onChange={() => handleToggle(option)}
                                className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                            />
                            <span className="font-semibold text-sm">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-[#0000B3] text-white font-bold text-sm rounded-xl hover:bg-[#000090] transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {saving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
                </button>
            </div>
        </div>
    );
};

export default BeneficiaryBenefits;
