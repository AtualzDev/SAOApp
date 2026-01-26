import React, { useState } from 'react';
import { Save, Gavel, Upload, FileText, X } from 'lucide-react';
import { supabase } from '../../services/supabase';
import SuccessFeedbackModal from '../common/SuccessFeedbackModal';

interface BeneficiaryJudicializationProps {
    beneficiaryId: string;
    data: any;
    onRefresh: () => void;
}

const BeneficiaryJudicialization: React.FC<BeneficiaryJudicializationProps> = ({ beneficiaryId, data, onRefresh }) => {
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [processNumber, setProcessNumber] = useState(data?.processo_judicial_numero || '');
    const [proofUrl, setProofUrl] = useState(data?.processo_judicial_comprovante_url || '');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) return;

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `judicial_${Math.random()}.${fileExt}`;
            const filePath = `${beneficiaryId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('beneficiary-documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('beneficiary-documents')
                .getPublicUrl(filePath);

            setProofUrl(urlData.publicUrl);
        } catch (error) {
            alert('Erro ao enviar arquivo!');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('assistidos')
                .update({
                    processo_judicial_numero: processNumber,
                    processo_judicial_comprovante_url: proofUrl
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
                message="Dados de judicialização atualizados."
                title="Alterações Salvas"
            />

            <div className="p-6 md:p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <Gavel size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Judicialização</h3>
                </div>

                <div className="space-y-1.5 group">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wide">Nº do Processo</label>
                    <input
                        type="text"
                        value={processNumber}
                        onChange={(e) => setProcessNumber(e.target.value)}
                        placeholder="Ex: 0000000-00.0000.0.00.0000"
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-400 transition-all placeholder:text-slate-300"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wide">Comprovante</label>

                    {!proofUrl ? (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group relative">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                            <div className={`p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ${uploading ? 'animate-pulse' : ''}`}>
                                <Upload size={24} className="text-amber-500" />
                            </div>
                            <p className="text-sm font-bold text-slate-600">
                                {uploading ? 'Enviando...' : 'Clique aqui e escolha os arquivos'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">PDF, Imagens (max 5MB)</p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <FileText size={20} className="flex-shrink-0" />
                                <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold truncate hover:underline">
                                    Ver Comprovante Anexado
                                </a>
                            </div>
                            <button
                                onClick={() => setProofUrl('')}
                                className="p-1.5 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}
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

export default BeneficiaryJudicialization;
