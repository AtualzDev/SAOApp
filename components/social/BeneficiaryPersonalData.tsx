import React, { useState, useEffect } from 'react';
import { User, FileText, Heart, Home, Gavel, History, Users, Shield, Stethoscope, Pill, Wrench, Activity, AlertCircle, ChevronRight, Share2, Printer, Ban, Upload, Camera, Menu, X, Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '../../services/supabase';
import SuccessFeedbackModal from '../common/SuccessFeedbackModal';

interface BeneficiaryPersonalDataProps {
    beneficiaryId: string;
    data: any;
    setData: any;
    loading: boolean;
    onRefresh: () => void;
}

const BeneficiaryPersonalData: React.FC<BeneficiaryPersonalDataProps> = ({ beneficiaryId, data, setData, loading, onRefresh }) => {
    const [saving, setSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [residents, setResidents] = useState<any[]>(data?.moradores || []);

    useEffect(() => {
        if (data?.moradores) {
            setResidents(data.moradores);
        }
    }, [data]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('assistidos')
                .update({
                    ...data,
                    moradores: residents
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

    const handleChange = (field: string, value: any) => {
        setData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleAddressChange = (field: string, value: any) => {
        handleChange(field, value);
    };

    // Residents Logic
    const addResident = () => {
        setResidents([...residents, { nome: '', parentesco: '', renda: '' }]);
    };

    const removeResident = (index: number) => {
        const newResidents = [...residents];
        newResidents.splice(index, 1);
        setResidents(newResidents);
    };

    const updateResident = (index: number, field: string, value: string) => {
        const newResidents = [...residents];
        newResidents[index] = { ...newResidents[index], [field]: value };
        setResidents(newResidents);
    };

    // Helper Input Component
    const FormInput = ({ label, value, onChange, type = "text", placeholder = "", readOnly = false, className = "" }: any) => (
        <div className={`space-y-1.5 group ${className}`}>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide group-hover:text-blue-500 transition-colors">{label}</label>
            <div className={`relative transition-all duration-200 ${!readOnly ? 'focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-400' : ''}`}>
                <input
                    type={type}
                    value={value || ''}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    className={`w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 ${readOnly ? 'cursor-default text-slate-500' : 'hover:bg-blue-50/20'}`}
                />
            </div>
        </div>
    );

    const FormSelect = ({ label, value, onChange, options }: any) => (
        <div className="space-y-1.5 group">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide group-hover:text-blue-500 transition-colors">{label}</label>
            <div className="relative">
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none hover:bg-blue-50/20 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                >
                    <option value="">Selecione...</option>
                    {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight size={16} className="rotate-90" />
                </div>
            </div>
        </div>
    );

    if (!data) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <SuccessFeedbackModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message="Os dados do beneficiário foram atualizados com sucesso."
                title="Alterações Salvas"
            />

            <div className="p-6 md:p-8 space-y-12">

                {/* 1. Identificação Pessoal */}
                <section>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} strokeWidth={2.5} /></div>
                        <h3 className="text-lg font-bold text-slate-800">Identificação Pessoal</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="md:col-span-2 lg:col-span-1">
                            <FormInput label="Nome Completo" value={data.nome} onChange={(v: string) => handleChange('nome', v)} />
                        </div>
                        <FormInput label="Data de Nascimento" type="date" value={data.data_nascimento} onChange={(v: string) => handleChange('data_nascimento', v)} />

                        <div className="space-y-1.5 group">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide group-hover:text-blue-500 transition-colors">Sexo</label>
                            <div className="flex gap-4 h-11 items-center px-2">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                                    <input type="radio" name="sexo" value="Masculino" checked={data.sexo === 'Masculino'} onChange={(e) => handleChange('sexo', e.target.value)} className="w-4 h-4 text-blue-600" />
                                    Masculino
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                                    <input type="radio" name="sexo" value="Feminino" checked={data.sexo === 'Feminino'} onChange={(e) => handleChange('sexo', e.target.value)} className="w-4 h-4 text-pink-500" />
                                    Feminino
                                </label>
                            </div>
                        </div>

                        <FormInput label="RG" value={data.rg} onChange={(v: string) => handleChange('rg', v)} />
                        <FormInput label="CPF" value={data.cpf} onChange={(v: string) => handleChange('cpf', v)} />
                        <FormSelect label="Estado Civil" value={data.estado_civil} onChange={(v: string) => handleChange('estado_civil', v)} options={['Solteiro(a)', 'Casado(a)', 'Viúvo(a)', 'Divorciado(a)', 'Separado(a)']} />

                        <FormInput label="Profissão" value={data.profissao} onChange={(v: string) => handleChange('profissao', v)} />
                        <FormInput label="Naturalidade" value={data.naturalidade} onChange={(v: string) => handleChange('naturalidade', v)} />
                    </div>
                </section>

                {/* 2. Filiação */}
                <section>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Users size={20} strokeWidth={2.5} /></div>
                        <h3 className="text-lg font-bold text-slate-800">Filiação</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Nome da Mãe" value={data.nome_mae} onChange={(v: string) => handleChange('nome_mae', v)} />
                        <FormInput label="Nome do Pai" value={data.nome_pai} onChange={(v: string) => handleChange('nome_pai', v)} />
                    </div>
                </section>

                {/* 3. Contatos & Endereço */}
                <section>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Share2 size={20} strokeWidth={2.5} /></div>
                        <h3 className="text-lg font-bold text-slate-800">Contatos e Endereço</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <FormInput label="Contato 01" value={data.telefone} onChange={(v: string) => handleChange('telefone', v)} />
                        <FormInput label="Contato 02" value={data.telefone_2} onChange={(v: string) => handleChange('telefone_2', v)} />
                        <FormInput label="E-mail" value={data.email} onChange={(v: string) => handleChange('email', v)} />
                        <FormInput label="Telefone Comercial" value={data.telefone_comercial} onChange={(v: string) => handleChange('telefone_comercial', v)} />
                        <FormInput label="Nome da Empresa" value={data.empresa} onChange={(v: string) => handleChange('empresa', v)} placeholder="" />
                    </div>

                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Endereço Residencial</h4>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-3">
                                <FormInput label="CEP" value={data.cep} onChange={(v: string) => handleAddressChange('cep', v)} />
                            </div>
                            <div className="md:col-span-7">
                                <FormInput label="Endereço" value={data.endereco} onChange={(v: string) => handleAddressChange('endereco', v)} />
                            </div>
                            <div className="md:col-span-2">
                                <FormInput label="Número" value={data.numero} onChange={(v: string) => handleAddressChange('numero', v)} />
                            </div>
                            <div className="md:col-span-4">
                                <FormInput label="Bairro" value={data.bairro} onChange={(v: string) => handleAddressChange('bairro', v)} />
                            </div>
                            <div className="md:col-span-4">
                                <FormInput label="Cidade" value={data.cidade} onChange={(v: string) => handleAddressChange('cidade', v)} />
                            </div>
                            <div className="md:col-span-2">
                                <FormInput label="Estado" value={data.estado} onChange={(v: string) => handleAddressChange('estado', v)} />
                            </div>
                            <div className="md:col-span-2">
                                <FormInput label="Complemento" value={data.complemento} onChange={(v: string) => handleAddressChange('complemento', v)} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Moradia e Moradores */}
                <section>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Home size={20} strokeWidth={2.5} /></div>
                        <h3 className="text-lg font-bold text-slate-800">Moradia e Benefícios</h3>
                    </div>

                    {/* Moradores List */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-slate-600">Composição Familiar (Moradores)</h4>
                            <button onClick={addResident} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1">
                                <Plus size={14} /> Add Morador
                            </button>
                        </div>
                        <div className="space-y-3">
                            {residents.map((res: any, idx: number) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-3 items-end p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex-1 w-full">
                                        <label className="text-[10px] uppercase font-bold text-slate-400">Nome Completo</label>
                                        <input type="text" value={res.nome} onChange={(e) => updateResident(idx, 'nome', e.target.value)} className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm" />
                                    </div>
                                    <div className="w-full md:w-40">
                                        <label className="text-[10px] uppercase font-bold text-slate-400">Parentesco</label>
                                        <select value={res.parentesco} onChange={(e) => updateResident(idx, 'parentesco', e.target.value)} className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm">
                                            <option value="">Selecione</option>
                                            <option value="Conjugue">Cônjuge</option>
                                            <option value="Filho(a)">Filho(a)</option>
                                            <option value="Pala(a)">Pai/Mãe</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                    <div className="w-full md:w-32">
                                        <label className="text-[10px] uppercase font-bold text-slate-400">Renda (R$)</label>
                                        <input type="text" value={res.renda} onChange={(e) => updateResident(idx, 'renda', e.target.value)} className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm" />
                                    </div>
                                    <button onClick={() => removeResident(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {residents.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">Nenhum morador adicionado.</p>}
                        </div>
                    </div>

                    {/* Benefícios */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-600 mb-3 block">Algum membro da família recebe benefícios?</h4>
                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                                <input type="radio" checked={data.recebe_beneficios === true} onChange={() => handleChange('recebe_beneficios', true)} className="w-4 h-4 text-green-600" />
                                Sim
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                                <input type="radio" checked={data.recebe_beneficios === false} onChange={() => handleChange('recebe_beneficios', false)} className="w-4 h-4 text-slate-400" />
                                Não
                            </label>
                        </div>
                        {data.recebe_beneficios && (
                            <div className="flex flex-col gap-2 p-4 bg-green-50/50 rounded-xl border border-green-100">
                                {['Bolsa Família', 'BPC - Idoso', 'BPC - Deficiência', 'Renda Mensal/Vitalícia', 'Auxílio Reabilitação'].map(ben => (
                                    <label key={ben} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.lista_beneficios?.includes(ben)}
                                            onChange={(e) => {
                                                const current = data.lista_beneficios || [];
                                                const newVal = e.target.checked ? [...current, ben] : current.filter((b: string) => b !== ben);
                                                handleChange('lista_beneficios', newVal);
                                            }}
                                            className="w-4 h-4 rounded text-green-600"
                                        />
                                        {ben}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* 5. Outras Informações */}
                <section>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Activity size={20} strokeWidth={2.5} /></div>
                        <h3 className="text-lg font-bold text-slate-800">Outras Informações</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-bold text-slate-600 mb-2">É Fumante?</h4>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                                    <input type="radio" checked={data.fumante === true} onChange={() => handleChange('fumante', true)} className="w-4 h-4 text-purple-600" />
                                    Sim
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                                    <input type="radio" checked={data.fumante === false} onChange={() => handleChange('fumante', false)} className="w-4 h-4 text-slate-400" />
                                    Não
                                </label>
                            </div>
                        </div>

                        <div className="max-w-xl">
                            <FormInput label="Utiliza algum entorpecente?" placeholder="Se sim, especifique..." value={data.usa_entorpecentes} onChange={(v: string) => handleChange('usa_entorpecentes', v)} />
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-600 mb-2">Possui Deficiência?</h4>
                            <div className="flex gap-4 mb-3">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                                    <input type="radio" checked={data.possui_deficiencia === true} onChange={() => handleChange('possui_deficiencia', true)} className="w-4 h-4 text-purple-600" />
                                    Sim
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                                    <input type="radio" checked={data.possui_deficiencia === false} onChange={() => handleChange('possui_deficiencia', false)} className="w-4 h-4 text-slate-400" />
                                    Não
                                </label>
                            </div>
                            {data.possui_deficiencia && (
                                <FormInput label="Qual deficiência?" value={data.deficiencia_descricao} onChange={(v: string) => handleChange('deficiencia_descricao', v)} />
                            )}
                        </div>
                    </div>
                </section>

            </div>

            {/* Footer Form Action */}
            <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 z-20">
                <p className="text-xs text-slate-400 mr-auto font-medium hidden sm:block">
                    Última alteração em {new Date().toLocaleDateString()}
                </p>
                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                    Cancelar
                </button>
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

export default BeneficiaryPersonalData;
