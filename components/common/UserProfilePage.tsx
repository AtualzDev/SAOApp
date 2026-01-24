import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { translateError } from '../../services/errorTranslator';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  FileSignature,
  Camera,
  X,
  ChevronRight,
  Phone,
  MapPin,
  HelpCircle
} from 'lucide-react';

type ProfileTab = 'acesso' | 'gerais' | 'profissionais';

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('acesso');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // User Data State
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Dados Gerais
  const [phone, setPhone] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Dados Profissionais
  const [role, setRole] = useState('');
  const [profession, setProfession] = useState('');
  const [council, setCouncil] = useState('');
  const [councilNumber, setCouncilNumber] = useState('');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      alert("Preencha a nova senha.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("As senhas não conferem.");
      return;
    }
    if (newPassword.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert("Senha atualizada com sucesso!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      alert("Erro ao atualizar senha: " + translateError(err.message));
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'signature') => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${type}_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setSaving(true);

      // Upload to 'images' bucket (or 'avatars' if you prefer, I'll use a generic 'public-assets' or similar that user might have, 
      // but actually 'avatars' is standard starter. I will try 'avatars').
      // If it fails, we handle.

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        // Cast to any because 'error' property or statusCode might not be on the standard type but is commonly returned
        if ((uploadError as any).error === 'Bucket not found' || (uploadError as any).statusCode === '404' || (uploadError as any).message?.includes('Bucket not found')) {
          alert("Erro: O bucket 'avatars' não foi encontrado. Por favor, crie um bucket público chamado 'avatars' no painel do Supabase.");
        } else {
          alert('Erro ao fazer upload: ' + uploadError.message);
        }
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      if (type === 'avatar') {
        setAvatarUrl(publicUrl);
        // Save immediately
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId);
        await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      } else {
        setSignatureUrl(publicUrl);
        await supabase.auth.updateUser({ data: { signature_url: publicUrl } });
      }

      alert('Upload concluído!');

    } catch (error: any) {
      alert('Erro ao fazer upload: ' + error.message);
    } finally {
      setSaving(false);
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);

  // Phone Formatter
  const formatPhoneNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');

    // Limit to 11 digits
    const limited = digits.substring(0, 11);

    // Format
    if (limited.length <= 10) {
      // (XX) XXXX-XXXX
      return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      // (XX) XXXXX-XXXX
      return limited.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  // CEP Handling
  const [cepError, setCepError] = useState(false);

  const formatCEP = (value: string) => {
    return value.replace(/\D/g, '').replace(/^(\d{5})(\d{3})?$/, "$1-$2");
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const formattedCep = formatCEP(value);
    setCep(formattedCep);
    setCepError(false);

    const cleanCep = formattedCep.replace(/\D/g, '');

    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (data.erro) {
          setCepError(true);
        } else {
          setAddress(data.logradouro);
          setNeighborhood(data.bairro);
          setCity(data.localidade);
          setState(data.uf);
          setCepError(false);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        setCepError(true);
      }
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Use getUser to ensure fresh data for metadata
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setEmail(user.email || '');

        // Load from User Metadata (Auth) - Prioritize this for extended fields
        const meta = user.user_metadata || {};

        if (meta) {
          setFullName(meta.full_name || '');
          // Only set if not empty to capture updates
          if (meta.cargo) setRole(meta.cargo);
          // If 'role' is used instead of 'cargo' in some places:
          if (meta.role && !meta.cargo) setRole(meta.role);

          setPhone(meta.phone || '');
          setPersonalEmail(meta.personal_email || '');
          setCep(meta.cep || '');
          setAddress(meta.address || '');
          setNumber(meta.number || '');
          setNeighborhood(meta.neighborhood || '');
          setCity(meta.city || '');
          setState(meta.state || '');
          setProfession(meta.profession || '');
          setCouncil(meta.council || '');
          setCouncilNumber(meta.council_number || '');
          if (meta.avatar_url) setAvatarUrl(meta.avatar_url);
          if (meta.signature_url) setSignatureUrl(meta.signature_url);
        }

        // Fetch from 'profiles' table mainly for 'full_name' and 'avatar_url' if maintained there
        // But be careful not to overwrite valid metadata with nulls if profile is partial
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          if (data.full_name) setFullName(data.full_name);
          // If avatar is in profiles, use it, but metadata might be newer? 
          // Usually profiles input triggers metadata update, so they should be sync.
          // Let's trust profiles for base data if present.
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
          if (data.cargo) setRole(data.cargo);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // 1. Update basic profile info in 'profiles' table
      const profileUpdates = {
        full_name: fullName,
        // role: role, // 'role' column might be protected or named 'role'/'cargo' depending on schema. 
        // Using 'cargo' as per previous context if that's the column name, or just metadata.
        // If 'profiles' has 'cargo' column:
        cargo: role,
        // If 'avatar_url' is managed here (it is updated via upload, but we can set it if text changed?)
        // avatar_url: avatarUrl 
      };

      // We only update fields that definitely exist in the 'profiles' table to avoid errors.
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId);

      if (profileError) {
        // Log but don't stop if it's just a column missing issue, unless critical
        console.warn('Erro ao atualizar tabela profiles:', profileError);
        // If the error is strict, we might want to throw, but for "metadata" missing, we proceed to auth.updateUser
      }

      // 2. Update extended metadata in Supabase Auth (User Metadata)
      // This is the source of truth for fields not in 'profiles' table yet (phone, address, etc)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          role: role,
          cargo: role,
          phone,
          personal_email: personalEmail,
          cep,
          address,
          number,
          neighborhood,
          city,
          state,
          profession,
          council,
          council_number: councilNumber
          // Note: avatar_url and signature_url should be updated when file is uploaded
        }
      });

      if (authError) throw authError;

      alert('Perfil atualizado com sucesso!');

    } catch (error: any) {
      alert('Erro ao atualizar perfil: ' + translateError(error.message));
    } finally {
      setSaving(false);
    }
  };




  const tabs = [
    { id: 'acesso', label: 'Dados de acesso' },
    { id: 'gerais', label: 'Dados gerais' },
    { id: 'profissionais', label: 'Dados profissionais' },
  ];

  const primaryBlue = '#1E40AF';

  return (
    <div className="flex-1 bg-white animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      {/* Tab Navigation - Responsive with horizontal scroll */}
      <div className="px-4 md:px-8 pt-6 md:pt-8 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 md:gap-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`pb-4 text-xs md:text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E40AF] animate-in slide-in-from-left-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl p-4 md:p-8 space-y-8 md:space-y-12">
        {activeTab === 'acesso' && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Foto de Perfil Section - Responsive Flex */}
            <section className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 md:gap-8">
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                    Dados de acesso
                  </h3>
                  <div className="flex items-center gap-2 pt-4">
                    <span className="text-sm font-bold text-slate-600">Foto de perfil*</span>
                    <HelpCircle size={14} className="text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    A foto deve ser apenas do rosto. Evite fotos de óculos escuros e prefira locais bem iluminados.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-100 border-2 border-white shadow-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-slate-300" />
                    )}
                  </div>
                  <label className="w-full lg:w-96 min-h-[96px] border-2 border-dashed border-[#1E40AF]/20 bg-slate-50/30 rounded-2xl flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:bg-blue-50/30 transition-all group relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadImage(e, 'avatar')}
                    />
                    <div className="w-10 h-10 bg-white text-slate-400 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 group-hover:text-blue-600 transition-all">
                      <Upload size={18} />
                    </div>
                    <p className="text-xs font-medium text-slate-400 text-center">
                      <span className="text-[#1E40AF] font-bold">Clique para carregar</span> ou arraste e solte
                    </p>
                    <p className="text-[10px] text-slate-300 font-bold uppercase">PNG ou JPG (min. 800x400px)</p>
                  </label>
                </div>
              </div>

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ID Usuário</label>
                  <input
                    type="text"
                    readOnly
                    value={userId}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Nome de usuário*</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
                </div>
                <div className="md:col-start-2 space-y-2">
                  <label className="text-sm font-bold text-slate-600">Email*</label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-70"
                >
                  <CheckCircle2 size={18} /> {saving ? 'Salvando...' : 'Salvar informações'}
                </button>
              </div>
            </section>

            {/* Senha Section */}
            <section className="space-y-6 border-t border-slate-50 pt-8">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Alterar Senha</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Senha atual*</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Senha atual"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all pr-12"
                    />
                    <button onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                      {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 md:col-start-2">
                  <label className="text-sm font-bold text-slate-600">Nova senha*</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nova senha"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all pr-12"
                    />
                    <button onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 md:col-start-2">
                  <label className="text-sm font-bold text-slate-600">Confirmar nova senha*</label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirme a nova senha"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all pr-12"
                    />
                    <button onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                      {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleUpdatePassword}
                  disabled={saving}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#1E40AF]/10 text-[#1E40AF] rounded-xl font-bold text-sm border border-[#1E40AF]/20 transition-all hover:bg-[#1E40AF]/20 disabled:opacity-70"
                >
                  <CheckCircle2 size={18} /> {saving ? 'Salvando...' : 'Salvar nova senha'}
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'gerais' && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-[#1E40AF] rounded-2xl">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Informações Pessoais</h3>
                  <p className="text-xs text-slate-400 font-medium">Dados de contato e localização do usuário.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Nome Completo*</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Telefone*</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="text"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(00) 0 0000-0000"
                      className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-500/5 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-600">Email Secundário/Pessoal</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="email"
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-500/5 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Seção de Endereço */}
              <div className="space-y-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#1E40AF]" />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[11px]">Endereço Residencial</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-bold text-slate-600">CEP</label>
                    <input
                      type="text"
                      value={cep}
                      onChange={handleCepChange}
                      placeholder="00000-000"
                      maxLength={9}
                      className={`w-full h-12 px-4 bg-white border ${cepError ? 'border-red-500 text-red-600' : 'border-slate-200'} rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all`}
                    />
                    {cepError && <span className="text-[10px] font-bold text-red-500">CEP inválido ou não encontrado.</span>}
                  </div>
                  <div className="md:col-span-9 space-y-2">
                    <label className="text-sm font-bold text-slate-600">Logradouro (Rua/Avenida)*</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Endereço"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-bold text-slate-600">Número*</label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Nº"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all"
                    />
                  </div>
                  <div className="md:col-span-5 space-y-2">
                    <label className="text-sm font-bold text-slate-600">Bairro*</label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Bairro"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-bold text-slate-600">Cidade*</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cidade"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all"
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-sm font-bold text-slate-600 text-center">UF*</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="UF"
                      maxLength={2}
                      className="w-full h-12 px-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-12 py-4 bg-[#1E40AF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 hover:bg-blue-800 disabled:opacity-70"
                >
                  {saving ? 'Salvando...' : 'Salvar Dados Gerais'} <CheckCircle2 size={18} />
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'profissionais' && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-[#1E40AF] rounded-2xl">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Atuação Profissional</h3>
                  <p className="text-xs text-slate-400 font-medium">Dados relativos à sua função na ONG e registro de conselho.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Cargo na ONG*</label>
                  <select
                    value={role}
                    disabled
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none text-slate-500 cursor-not-allowed transition-all"
                  >
                    <option value="">Selecione o cargo</option>
                    <option value="Assistente Social">Assistente Social</option>
                    <option value="Gestão">Gestão</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Operacional">Operacional</option>
                    <option value="TI">TI</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Profissão*</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="Sua formação acadêmica"
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Conselho (Sigla)*</label>
                  <input
                    type="text"
                    value={council}
                    onChange={(e) => setCouncil(e.target.value)}
                    placeholder="Ex: CRESS"
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Número do Conselho*</label>
                  <input
                    type="text"
                    value={councilNumber}
                    onChange={(e) => setCouncilNumber(e.target.value)}
                    placeholder="00.000-0"
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all"
                  />
                </div>
              </div>

              {/* Assinatura Digital Section */}
              <div className="space-y-4 pt-6">
                <div className="flex items-center gap-2">
                  <FileSignature size={18} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[11px]">Assinatura Digital</span>
                </div>
                <label className="w-full h-40 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white hover:border-blue-300 transition-all group relative">
                  <input type="file" accept="image/png" className="hidden" onChange={(e) => uploadImage(e, 'signature')} />
                  {!signatureUrl ? (
                    <>
                      <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                        <Upload size={24} />
                      </div>
                      <p className="text-xs font-bold text-slate-400">Carregar arquivo de assinatura (.png transparente)</p>
                    </>
                  ) : (
                    <img src={signatureUrl} className="h-full w-auto object-contain p-2" alt="Assinatura" />
                  )}
                </label>
              </div>

              <div className="flex justify-end pt-8">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-12 py-4 bg-[#1E40AF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 hover:bg-blue-800 disabled:opacity-70"
                >
                  {saving ? 'Salvando...' : 'Salvar Perfil Profissional'} <ChevronRight size={18} />
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-6 md:p-8 border-t border-slate-50">
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
          <ShieldCheck size={16} className="text-blue-500" />
          <span>Informações protegidas por criptografia e acessíveis apenas pela sua unidade administrativa.</span>
        </div>
      </div>
    </div>
  );
};
export default UserProfilePage;
