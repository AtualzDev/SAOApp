import React, { useState } from 'react';
import { Save, Stethoscope } from 'lucide-react';
import { supabase } from '../../services/supabase';
import SuccessFeedbackModal from '../common/SuccessFeedbackModal';

interface BeneficiaryTreatmentProps {
    beneficiaryId: string;
    data: any;
    onRefresh: () => void;
}

const BeneficiaryTreatment: React.FC<BeneficiaryTreatmentProps> = ({ beneficiaryId, data, onRefresh }) => {
    const [saving, setSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [hasOtherDiseases, setHasOtherDiseases] = useState(data?.possui_outras_doencas || false);
    const [hasOncology, setHasOncology] = useState(data?.tratamento_oncologico || false);

    const handleSave = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('assistidos')
                .update({
                    possui_outras_doencas: hasOtherDiseases,
                    tratamento_oncologico: hasOncology
                })
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
                message="Dados de tratamento atualizados."
                title="Alterações Salvas"
            />

            <div className="p-6 md:p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                        <Stethoscope size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Tratamento</h3>
                </div>

                <div className="space-y-6">
                    <div className="text-sm text-slate-600 font-medium pb-2 border-b border-slate-50">
                        Tipo de tratamento a qual está sendo submetido
                    </div>

                    {/* Question 1 */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700">Possui outras doenças?</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                                <input type="radio" checked={hasOtherDiseases === true} onChange={() => setHasOtherDiseases(true)} className="w-4 h-4 text-teal-600" />
                                <span className="text-sm font-medium text-slate-600">Sim</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                                <input type="radio" checked={hasOtherDiseases === false} onChange={() => setHasOtherDiseases(false)} className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-600">Não</span>
                            </label>
                        </div>
                    </div>

                    {/* Question 2 */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700">Tratamento oncológico?</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                                <input type="radio" checked={hasOncology === true} onChange={() => setHasOncology(true)} className="w-4 h-4 text-teal-600" />
                                <span className="text-sm font-medium text-slate-600">Sim</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                                <input type="radio" checked={hasOncology === false} onChange={() => setHasOncology(false)} className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-600">Não</span>
                            </label>
                        </div>
                    </div>
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

export default BeneficiaryTreatment;
