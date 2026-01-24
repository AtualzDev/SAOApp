
import React, { useState } from 'react';
import { User, Save, X, Info, Phone, CreditCard, Shield, Stethoscope, MapPin, Upload, Calendar, DollarSign, FileText } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { translateError } from '../../services/errorTranslator';

interface BeneficiaryFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

const BeneficiaryForm: React.FC<BeneficiaryFormProps> = ({ onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pessoal' | 'endereco' | 'medico'>('pessoal');

  // Dados Pessoais
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Ativo');

  // Endereço
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [complemento, setComplemento] = useState('');

  // Médicos / Sociais
  const [tipoDoenca, setTipoDoenca] = useState('');
  const [rendaMensal, setRendaMensal] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [dataDiagnostico, setDataDiagnostico] = useState('');
  const [cadastroUnico, setCadastroUnico] = useState('');
  const [numeroNis, setNumeroNis] = useState('');
  const [hospital, setHospital] = useState('');
  const [patologiaDescricao, setPatologiaDescricao] = useState('');

  // Foto
  const [fotoUrl, setFotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // --- Helpers ---
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.substring(0, 11);
    if (limited.length <= 10) {
      return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      return limited.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };

  const formatCEP = (value: string) => {
    return value.replace(/\D/g, '').replace(/^(\d{5})(\d{3})?$/, "$1-$2");
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const formattedCep = formatCEP(value);
    setCep(formattedCep);

    const cleanCep = formattedCep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEndereco(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `beneficiaries/${fileName}`; // Assuming a folder structure

      // Upload to 'avatars' bucket (or create a new 'beneficiaries' bucket if preferred, keeping it simple with avatars or company-assets)
      // Trying 'company-assets' as it's public.
      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('company-assets').getPublicUrl(filePath);
      setFotoUrl(data.publicUrl);

    } catch (error: any) {
      alert('Erro ao fazer upload da foto: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!nome) {
      alert('O campo Nome é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      // Get current user's org id
      const { data: { user } } = await supabase.auth.getUser();
      let organization_id = null;
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
        organization_id = profile?.organization_id;
      }

      const { error } = await supabase
        .from('ASSISTIDOS')
        .insert({
          nome,
          cpf,
          data_nascimento: dataNascimento || null,
          telefone,
          email,
          status,
          cep,
          endereco,
          numero,
          bairro,
          cidade,
          estado,
          complemento,
          tipo_doenca: tipoDoenca,
          renda_mensal: rendaMensal,
          diagnostico,
          data_diagnostico: dataDiagnostico || null,
          cadastro_unico: cadastroUnico,
          numero_nis: numeroNis,
          hospital,
          patologia_descricao: patologiaDescricao,
          foto_url: fotoUrl,
          organization_id
        });

      if (error) throw error;

      alert('Assistido cadastrado com sucesso!');
      if (onSuccess) onSuccess();
      onCancel();

    } catch (error: any) {
      alert('Erro ao salvar assistido: ' + translateError(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Novo Cadastro de Assistido</h1>
            <p className="text-xs text-slate-400">Insira as informações do novo beneficiário no sistema</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Column: Navigation & Photo */}
        <div className="lg:col-span-1 space-y-6">
          {/* Photo Uploader */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className={`w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all overflow-hidden ${fotoUrl ? 'border-none' : ''} relative`}>
              {fotoUrl ? (
                <img src={fotoUrl} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <>
                  <User className="text-slate-300 group-hover:text-blue-400 transition-colors" size={32} />
                  <span className="text-[9px] font-black text-slate-400 group-hover:text-blue-500 uppercase tracking-widest">{uploading ? 'Enviando...' : 'Add Foto'}</span>
                </>
              )}
              <input type="file" onChange={handleUploadPhoto} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="mt-4 text-[10px] text-slate-400 font-medium">Capture ou faça upload de uma foto nítida do assistido.</p>
          </div>

          {/* Navigation Tabs (Vertical on Large screens) */}
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            <button
              onClick={() => setActiveTab('pessoal')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'pessoal' ? 'bg-[#1E40AF] text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
            >
              <User size={18} /> Dados Pessoais
            </button>
            <button
              onClick={() => setActiveTab('endereco')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'endereco' ? 'bg-[#1E40AF] text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
            >
              <MapPin size={18} /> Endereço
            </button>
            <button
              onClick={() => setActiveTab('medico')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'medico' ? 'bg-[#1E40AF] text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
            >
              <Stethoscope size={18} /> Saúde e Social
            </button>
          </nav>
        </div>

        {/* Right Column: Content Forms */}
        <div className="lg:col-span-3 space-y-6">

          {/* Tab: Dados Pessoais */}
          {activeTab === 'pessoal' && (
            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider border-b border-slate-50 pb-4">
                <Info size={16} className="text-blue-500" /> Identificação Pessoal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Nome Completo *</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome completo do assistido"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">CPF</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    maxLength={14}
                    placeholder="000.000.000-00"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Data de Nascimento</label>
                  <input
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium text-slate-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Celular / Telefone</label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(formatPhone(e.target.value))}
                    maxLength={15}
                    placeholder="(00) 00000-0000"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Email (Opcional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Status Inicial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium cursor-pointer"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Assistido">Assistido</option>
                    <option value="Em Triagem">Em Triagem</option>
                    <option value="Desativado">Desativado</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Endereço */}
          {activeTab === 'endereco' && (
            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider border-b border-slate-50 pb-4">
                <MapPin size={16} className="text-blue-500" /> Endereço Residencial
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">CEP</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={handleCepChange}
                    maxLength={9}
                    placeholder="00000-000"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-1">
                  {/* Empty column for layout balance or maybe verify CEP button */}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Logradouro</label>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Número</label>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Bairro</label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Cidade</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Estado</label>
                  <input
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Complemento</label>
                  <input
                    type="text"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Saúde e Social */}
          {activeTab === 'medico' && (
            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider border-b border-slate-50 pb-4">
                <Stethoscope size={16} className="text-blue-500" /> Dados Médicos e Sociais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Tipo de Doença</label>
                  <input
                    type="text"
                    value={tipoDoenca}
                    onChange={(e) => setTipoDoenca(e.target.value)}
                    placeholder="Ex: Doença Renal Crônica"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Renda Mensal Familiar</label>
                  <input
                    type="text"
                    value={rendaMensal}
                    onChange={(e) => setRendaMensal(e.target.value)}
                    placeholder="Digite a renda mensal"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Data do Diagnóstico</label>
                  <input
                    type="date"
                    value={dataDiagnostico}
                    onChange={(e) => setDataDiagnostico(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium text-slate-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Cadastro Único</label>
                  <input
                    type="text"
                    value={cadastroUnico}
                    onChange={(e) => setCadastroUnico(e.target.value)}
                    placeholder="Sim / Não / Pendente"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Número do NIS</label>
                  <input
                    type="text"
                    value={numeroNis}
                    onChange={(e) => setNumeroNis(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Hospital de Tratamento</label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Diagnóstico Detalhado / Observações</label>
                  <textarea
                    rows={4}
                    value={patologiaDescricao}
                    onChange={(e) => setPatologiaDescricao(e.target.value)}
                    placeholder="Descreva aqui..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all resize-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={onCancel}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-12 py-3 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-blue-800 shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Finalizar Cadastro'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BeneficiaryForm;
