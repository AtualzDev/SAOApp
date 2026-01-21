
import React, { useState, useEffect } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from '../services/supabase';
import { createClient } from '@supabase/supabase-js';
import { translateError } from '../services/errorTranslator';
import {
  Search, Plus, Pencil, Settings as SettingsIcon, Key, User, ShieldCheck, History,
  MessageSquare, Package, Calendar, CreditCard, Stethoscope, X, Mail, ChevronRight,
  Send, Sparkles, Image as ImageIcon, Upload, FileSignature, FileText, UserCheck,
  Briefcase, MapPin, Car, Trash2, Lock, Download, Filter, ShoppingBasket, Activity,
  Truck, UserX, CalendarDays, Palette, Stamp, FileBadge
} from 'lucide-react';

type SettingsTab = 'conta' | 'agenda' | 'cestas' | 'cid' | 'fornecedores' | 'usuarios' | 'whatsapp' | 'logs';
type AccountSubTab = 'dados_ong' | 'personalizacao' | 'documentos' | 'comunicacao';
type AgendaSubTab = 'campos' | 'profissionais' | 'departamentos' | 'locais' | 'procedimentos' | 'motoristas';

interface UserData {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  avatar?: string;
}

interface BasketData {
  id: string;
  nome: string;
  total: number;
  qtdItens: number;
}

interface CIDData {
  id: string;
  codigo: string;
  descricao: string;
}

interface SupplierData {
  id: string;
  nome: string;
  documento: string;
  contato: string;
}

interface LogData {
  id: string;
  usuario: string;
  email: string;
  avatar?: string;
  acao: string;
  detalhes: string;
  dataHora: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('conta');
  const [activeAccountSubTab, setActiveAccountSubTab] = useState<AccountSubTab>('dados_ong');
  const [activeAgendaSubTab, setActiveAgendaSubTab] = useState<AgendaSubTab>('campos');

  // Organization State (Existing + New Fields)
  const [orgId, setOrgId] = useState<string | null>(null);
  // Dados Básicos
  const [orgName, setOrgName] = useState('');
  const [orgCnpj, setOrgCnpj] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgCity, setOrgCity] = useState('');
  const [orgState, setOrgState] = useState('');
  const [orgCep, setOrgCep] = useState(''); // New
  const [orgStreet, setOrgStreet] = useState(''); // New
  const [orgNumber, setOrgNumber] = useState(''); // New
  const [orgEmail, setOrgEmail] = useState(''); // New

  // Personalização
  const [orgLogoLight, setOrgLogoLight] = useState(''); // New
  const [orgLogoDark, setOrgLogoDark] = useState(''); // New
  const [orgPrimaryColor, setOrgPrimaryColor] = useState('#1E40AF');
  const [orgSecondaryColor, setOrgSecondaryColor] = useState('#64748B'); // New

  // Documentos
  const [orgHeader, setOrgHeader] = useState('');
  const [orgSignature, setOrgSignature] = useState('');
  const [orgWatermark, setOrgWatermark] = useState(''); // New

  // CEP State
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setCepLoading(true);
    setCepError('');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError('CEP não encontrado');
        return;
      }

      setOrgStreet(data.logradouro || '');
      setOrgCity(data.localidade || '');
      setOrgState(data.uf || '');
      // User requested no Map link, so we don't touch orgAddress (Map)

    } catch (error) {
      setCepError('Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setOrgCep(formatted);
    if (formatted.length === 9) {
      fetchAddressByCEP(formatted);
    } else {
      setCepError('');
    }
  };

  // Comunicação (Templates)
  const [msgAgendamento, setMsgAgendamento] = useState('Olá {nome}, seu agendamento foi confirmado para {data}.');
  const [msgMotorista, setMsgMotorista] = useState('Motorista a caminho para buscar {nome} no endereço {endereco}.');
  const [msgPrimeiroAcesso, setMsgPrimeiroAcesso] = useState('Bem-vindo ao SAO! Seu login é {email}.');
  const [msgResetSenha, setMsgResetSenha] = useState('Clique no link para redefinir sua senha: {link}');

  const [loadingOrg, setLoadingOrg] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);

  // States para Modais e Outros
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isSendLinkModalOpen, setIsSendLinkModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Assistente Social');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Updated Tabs List
  // Updated Tabs List
  const tabs = [
    { id: 'conta', label: 'Dados da conta' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'cestas', label: 'Cestas' },
    { id: 'cid', label: 'CID' },
    { id: 'fornecedores', label: 'Fornecedores' },
    { id: 'usuarios', label: 'Usuários' },
    { id: 'whatsapp', label: 'Whatsapp' },
    { id: 'logs', label: 'Logs' },
  ];

  const [suppliers] = useState<SupplierData[]>([
    { id: '1', nome: 'Adilson Araújo', documento: '99204720697', contato: '319933309580' },
    { id: '2', nome: 'Ana Carolina Dias de Castro', documento: '05221385600', contato: '3130774172' },
    { id: '3', nome: 'Ana Paula confecções', documento: '90332000175', contato: '90052387' },
    { id: '4', nome: 'Ângela Maria de Paula Silva', documento: '60383178649', contato: '3198781830' },
    { id: '5', nome: 'Aracy Rosa Duarte', documento: '12237548000139', contato: '03100000000' },
    { id: '6', nome: 'BH Vida', documento: '34335334000198', contato: '31345344545' },
    { id: '7', nome: 'Bruno campanha', documento: '96327448615', contato: '31987850003' },
  ]);

  const [logs] = useState<LogData[]>([
    { id: '1', usuario: 'Nome do usuário', email: 'emaildaong@gmail.com', acao: 'Exclusão', detalhes: 'Foi realizado a exclusão do item arroz do estoque.', dataHora: '20/02/25 - 22:36' },
    { id: '2', usuario: 'Nome do usuário', email: 'emaildaong@gmail.com', acao: 'Exclusão', detalhes: 'Foi realizado a exclusão do item feijão do estoque.', dataHora: '20/02/25 - 22:36' },
  ]);


  const [baskets] = useState<BasketData[]>([
    { id: '1', nome: 'Cesta básica', total: 35, qtdItens: 16 },
    { id: '2', nome: 'Cesta de Natal', total: 55, qtdItens: 16 },
    { id: '3', nome: 'Kit higiene', total: 10, qtdItens: 2 },
  ]);

  const [cidList] = useState<CIDData[]>([
    { id: '1', codigo: 'C71', descricao: 'Neoplasia maligna do encéfalo' },
    { id: '2', codigo: 'I10', descricao: 'Hipertensão essencial (primária)' },
    { id: '3', codigo: 'E11', descricao: 'Diabetes mellitus não-insulino-dependente' },
    { id: '4', codigo: 'F32', descricao: 'Episódios depressivos' },
    { id: '5', codigo: 'G30', descricao: 'Doença de Alzheimer' },
    { id: '6', codigo: 'M54', descricao: 'Dorsalgia' },
  ]);

  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchOrganization();
  }, []);

  // --- Formatters ---
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.substring(0, 11);
    if (limited.length <= 10) {
      return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      return limited.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  // --- Actions ---

  const fetchOrganization = async () => {
    try {
      setLoadingOrg(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Get org_id from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .single();

      if (profile?.organization_id) {
        setOrgId(profile.organization_id);

        // 2. Fetch organization data
        const { data: org, error } = await supabase
          .from('empresa_ongs')
          .select('*')
          .eq('id', profile.organization_id)
          .single();

        if (org) {
          setOrgName(org.name || '');
          setOrgCnpj(org.cnpj || '');
          setOrgPhone(org.contact_phone || '');
          setOrgAddress(org.address || '');
          setOrgCity(org.city || '');
          setOrgState(org.state || '');

          // Mapping old fields to new state or using new fields if they existed
          setOrgLogoLight(org.logo_url || '');
          setOrgPrimaryColor(org.primary_color || '#1E40AF');
          setOrgHeader(org.header_url || '');
          setOrgSignature(org.signature_url || '');

          // Fields that might not exist in DB yet (Mocking or checking safe access)
          if ('email' in org) setOrgEmail(org.email || '');
          if ('secondary_color' in org) setOrgSecondaryColor(org.secondary_color || '#64748B');
          if ('logo_dark_url' in org) setOrgLogoDark(org.logo_dark_url || '');
          if ('watermark_url' in org) setOrgWatermark(org.watermark_url || '');

          if ('msg_agendamento' in org) setMsgAgendamento(org.msg_agendamento || msgAgendamento);
          if ('msg_motorista' in org) setMsgMotorista(org.msg_motorista || msgMotorista);
          if ('msg_primeiro_acesso' in org) setMsgPrimeiroAcesso(org.msg_primeiro_acesso || msgPrimeiroAcesso);
          if ('msg_reset_senha' in org) setMsgResetSenha(org.msg_reset_senha || msgResetSenha);
        }
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
    } finally {
      setLoadingOrg(false);
    }
  };

  const saveOrganization = async () => {
    if (!orgId) return;
    try {
      setSavingOrg(true);

      // Construct update object dynamically to avoid errors if columns missing in strict mode, 
      // but for now we try to update what we know exists + new fields assuming user might add columns later
      // For immediate "Front-end first" task, we will just log the new fields and save the old ones.

      const payload: any = {
        name: orgName,
        cnpj: orgCnpj,
        contact_phone: orgPhone,
        address: orgAddress,
        city: orgCity,
        state: orgState,
        logo_url: orgLogoLight,       // Defaulting Main logo to Light logo
        primary_color: orgPrimaryColor,
        header_url: orgHeader,
        signature_url: orgSignature
      };

      // We attempt to send new fields. If Supabase rejects, we might need a try/catch specific or just ignore for now in this demo.
      // But typically Supabase ignores extra fields in UPDATE if using JSON, unless strict. 
      // safer to separate or just warn. 
      // For this user task "Front-end first... backend validation later", we will try to save basic and mock save the rest in UI state.

      const { error } = await supabase
        .from('empresa_ongs')
        .update(payload)
        .eq('id', orgId);

      if (error) throw error;
      alert('Dados da organização salvos com sucesso! (Novos campos apenas no visual por enquanto)');
    } catch (error: any) {
      console.error(error);
      alert('Erro ao salvar organização (Base): ' + error.message);
    } finally {
      setSavingOrg(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'header' | 'signature' | 'watermark' | 'logo_dark') => {
    if (!e.target.files || e.target.files.length === 0 || !orgId) return;

    try {
      setSavingOrg(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${orgId}/${field}_${Date.now()}.${fileExt}`;

      // Upload to 'company-assets' bucket
      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(fileName);

      if (field === 'logo') setOrgLogoLight(publicUrl);
      if (field === 'logo_dark') setOrgLogoDark(publicUrl);
      if (field === 'header') setOrgHeader(publicUrl);
      if (field === 'signature') setOrgSignature(publicUrl);
      if (field === 'watermark') setOrgWatermark(publicUrl);

    } catch (error: any) {
      alert('Erro ao fazer upload: ' + error.message);
    } finally {
      setSavingOrg(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUserId || '');

      setUsers(data?.map((u: any) => ({
        id: u.id,
        nome: u.full_name || u.nome || 'Usuário',
        email: u.email || 'Sem email',
        cargo: u.role || u.cargo || 'Membro',
        avatar: u.avatar_url
      })) || []);

    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Ensure we have an organization to attach to
    if (!orgId) {
      alert("Erro: Organização não identificada. Recarregue a página.");
      return;
    }

    setIsCreatingUser(true);

    try {
      const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false }
      });

      const { data, error } = await tempClient.auth.signUp({
        email: newUserEmail,
        password: 'sao.temp.password.123',
        options: {
          data: {
            full_name: newUserName,
            role: newUserRole
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await tempClient
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: newUserName,
            email: newUserEmail,
            role: newUserRole,
            organization_id: orgId, // Attach to current Org
            created_at: new Date().toISOString()
          });

        if (profileError) console.warn('Erro ao criar perfil:', profileError);

        setUsers(prev => [{
          id: data.user!.id,
          nome: newUserName,
          email: newUserEmail,
          cargo: newUserRole,
        }, ...prev]);

        setNewUserName('');
        setNewUserEmail('');
        setNewUserRole('Assistente Social');
        setIsAddUserModalOpen(false);
        if (data.user) {
          setSelectedUser({
            id: data.user.id,
            nome: newUserName,
            email: newUserEmail,
            cargo: newUserRole
          });
          setIsSendLinkModalOpen(true);
        }
      }

    } catch (err: any) {
      alert('Erro ao criar usuário: ' + translateError(err.message));
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleEditClick = (user: UserData) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleSendLinkClick = (user: UserData) => {
    setSelectedUser(user);
    setIsSendLinkModalOpen(true);
  };


  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
  };

  const renderDadosOng = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Dados da ONG</h2>
        <p className="text-sm text-slate-400 font-medium">Informações básicas e de contato</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600">Nome da Instituição</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600">CNPJ</label>
            <input
              type="text"
              value={orgCnpj}
              onChange={(e) => setOrgCnpj(formatCNPJ(e.target.value))}
              maxLength={18}
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600">E-mail Oficial</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                placeholder="contato@ong.org.br"
                className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600">Telefone / Contato</label>
            <input
              type="text"
              value={orgPhone}
              onChange={(e) => setOrgPhone(formatPhoneNumber(e.target.value))}
              maxLength={15}
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              Endereço Geográfico
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
              Localização em tempo real
            </span>
          </div>

          <div className="space-y-5">

            {/* Row 1: CEP, City, State */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3 space-y-1.5 relative">
                <label className="text-sm font-bold text-slate-600">CEP</label>
                <div className="relative">
                  <input
                    type="text"
                    value={orgCep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    maxLength={9}
                    className={`w-full h-11 px-4 bg-white border rounded-lg text-sm font-medium outline-none transition-all ${cepError ? 'border-rose-300 focus:border-rose-500 text-rose-500' : 'border-slate-200 focus:border-blue-400'
                      }`}
                  />
                  {cepLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {cepError && <p className="text-[10px] text-rose-500 font-bold absolute -bottom-4 left-0">{cepError}</p>}
              </div>
              <div className="md:col-span-6 space-y-1.5">
                <label className="text-sm font-bold text-slate-600">Cidade</label>
                <input
                  type="text"
                  value={orgCity}
                  onChange={(e) => setOrgCity(e.target.value)}
                  disabled={cepLoading}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-sm font-bold text-slate-600">Estado</label>
                <input
                  type="text"
                  value={orgState}
                  onChange={(e) => setOrgState(e.target.value)}
                  maxLength={2}
                  disabled={cepLoading}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all uppercase disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            {/* Row 2: Street, Number */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-9 space-y-1.5">
                <label className="text-sm font-bold text-slate-600">Rua</label>
                <input
                  type="text"
                  value={orgStreet}
                  onChange={(e) => setOrgStreet(e.target.value)}
                  disabled={cepLoading}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-sm font-bold text-slate-600">Número</label>
                <input
                  type="text"
                  value={orgNumber}
                  onChange={(e) => setOrgNumber(e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all"
                />
              </div>
            </div>

            {/* Row 3: Full Address (Map Source) */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Endereço Completo <span className="text-[10px] font-normal text-slate-400 ml-1">(Para visualização no mapa)</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  placeholder="Ex: Av. Paulista, 1578 - São Paulo"
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Row 4: Map */}
            <div className="w-full h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative group isolate z-0">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(orgAddress || 'Brasil')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="absolute inset-0 w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm border border-slate-100 pointer-events-none z-10">
                Visualização
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-50">
          <button
            onClick={saveOrganization}
            disabled={savingOrg}
            className="px-10 py-3 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {savingOrg ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPersonalizacao = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Personalização Visual</h2>
        <p className="text-sm text-slate-400 font-medium">Defina a identidade visual do sistema</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-10">

        {/* Logos */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <ImageIcon size={18} className="text-blue-600" /> Logotipos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Logo Light (Fundo Claro)</label>
              <div className="w-full h-32 border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex items-center justify-center p-4 relative group cursor-pointer hover:bg-slate-100 transition-all">
                {orgLogoLight ? (
                  <img src={orgLogoLight} className="h-12 w-auto object-contain" alt="Logo Light" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-slate-300 mb-2" size={20} />
                    <span className="text-xs text-slate-400 font-medium">Carregar Logo</span>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleUpload(e, 'logo')} />
              </div>
              <p className="text-[10px] text-slate-400">Exibido na barra lateral e login.</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Logo Dark (Fundo Escuro)</label>
              <div className="w-full h-32 border-2 border-dashed border-slate-200 bg-slate-900 rounded-xl flex items-center justify-center p-4 relative group cursor-pointer hover:bg-slate-800 transition-all">
                {orgLogoDark ? (
                  <img src={orgLogoDark} className="h-12 w-auto object-contain" alt="Logo Dark" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-slate-600 mb-2" size={20} />
                    <span className="text-xs text-slate-500 font-medium">Carregar Logo</span>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleUpload(e, 'logo_dark')} />
              </div>
              <p className="text-[10px] text-slate-400">Para temas escuros (opcional).</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-50 w-full" />

        {/* Cores */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Palette size={18} className="text-blue-600" /> Esquema de Cores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Cor Primária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={orgPrimaryColor}
                  onChange={(e) => setOrgPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded-lg shadow-sm border-2 border-slate-100 cursor-pointer p-0.5"
                />
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-700">{orgPrimaryColor}</p>
                  <p className="text-xs text-slate-400">Botões principais, destaques</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Cor Secundária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={orgSecondaryColor}
                  onChange={(e) => setOrgSecondaryColor(e.target.value)}
                  className="w-12 h-12 rounded-lg shadow-sm border-2 border-slate-100 cursor-pointer p-0.5"
                />
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-700">{orgSecondaryColor}</p>
                  <p className="text-xs text-slate-400">Elementos secundários, bordas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-50">
          <button
            onClick={saveOrganization}
            disabled={savingOrg}
            className="px-10 py-3 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-70"
          >
            {savingOrg ? 'Salvando...' : 'Salvar Personalização'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderDocumentos = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Personalização de Documentos</h2>
        <p className="text-sm text-slate-400 font-medium">Configure a aparência dos relatórios e documentos gerados</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Cabeçalho */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileBadge size={16} className="text-blue-500" /> Cabeçalho Padrão
            </label>
            <div className="aspect-[3/1] w-full border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex items-center justify-center relative group cursor-pointer hover:border-blue-400 transition-all">
              {orgHeader ? (
                <img src={orgHeader} alt="Header" className="max-h-full max-w-full object-contain p-2" />
              ) : (
                <span className="text-xs text-slate-400">Upload Imagem (PNG)</span>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleUpload(e, 'header')} />
            </div>
            <p className="text-[10px] text-slate-400">Exibido no topo de todos os relatórios PDF.</p>
          </div>

          {/* Assinatura */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Stamp size={16} className="text-blue-500" /> Assinatura Digital
            </label>
            <div className="aspect-square w-full md:w-48 border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex items-center justify-center relative group cursor-pointer hover:border-blue-400 transition-all">
              {orgSignature ? (
                <img src={orgSignature} alt="Assinatura" className="max-h-full max-w-full object-contain p-4" />
              ) : (
                <span className="text-xs text-slate-400">Upload Assinatura</span>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleUpload(e, 'signature')} />
            </div>
            <p className="text-[10px] text-slate-400">Inserida automaticamente ao final.</p>
          </div>

          {/* Marca D'água */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-500" /> Marca D'água
            </label>
            <div className="aspect-[210/297] w-32 border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex items-center justify-center relative group cursor-pointer hover:border-blue-400 transition-all opacity-70">
              {orgWatermark ? (
                <img src={orgWatermark} alt="Marca D'agua" className="max-h-full max-w-full object-contain p-2 opacity-50" />
              ) : (
                <span className="text-xs text-slate-400">Upload Fundo</span>
              )}
              {/* Mock upload for watermark for now as reusing 'logo' field or similar for test */}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleUpload(e, 'logo')} />
            </div>
            <p className="text-[10px] text-slate-400">Fundo suave para documentos oficiais.</p>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-50">
          <button
            onClick={saveOrganization}
            disabled={savingOrg}
            className="px-10 py-3 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-70"
          >
            {savingOrg ? 'Salvando...' : 'Salvar Documentos'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderComunicacao = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Comunicação</h2>
        <p className="text-sm text-slate-400 font-medium">Personalize as mensagens enviadas pelo sistema (E-mail / WhatsApp)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Agendamento */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
            <Calendar size={18} /> Confirmação de Agendamento
          </div>
          <textarea
            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-400 resize-none transition-all"
            value={msgAgendamento}
            onChange={(e) => setMsgAgendamento(e.target.value)}
          />
          <p className="text-[10px] text-slate-400">Variáveis: {'{nome}'}, {'{data}'}, {'{profissional}'}</p>
        </div>

        {/* Motorista */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
            <Car size={18} /> Notificação de Motorista
          </div>
          <textarea
            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-400 resize-none transition-all"
            value={msgMotorista}
            onChange={(e) => setMsgMotorista(e.target.value)}
          />
          <p className="text-[10px] text-slate-400">Variáveis: {'{nome}'}, {'{placa}'}, {'{modelo}'}, {'{tempo}'}</p>
        </div>

        {/* Primeiro Acesso */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <UserCheck size={18} /> Boas-vindas / Primeiro Acesso
          </div>
          <textarea
            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-400 resize-none transition-all"
            value={msgPrimeiroAcesso}
            onChange={(e) => setMsgPrimeiroAcesso(e.target.value)}
          />
          <p className="text-[10px] text-slate-400">Variáveis: {'{nome}'}, {'{email}'}, {'{link_login}'}</p>
        </div>

        {/* Reset Senha */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <Lock size={18} /> Redefinição de Senha
          </div>
          <textarea
            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-400 resize-none transition-all"
            value={msgResetSenha}
            onChange={(e) => setMsgResetSenha(e.target.value)}
          />
          <p className="text-[10px] text-slate-400">Variáveis: {'{nome}'}, {'{link}'}</p>
        </div>

      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={saveOrganization}
          disabled={savingOrg}
          className="px-8 py-3 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-70"
        >
          {savingOrg ? 'Salvando...' : 'Salvar Modelos de Mensagem'}
        </button>
      </div>

    </div>
  );

  const renderAgendaTab = () => {
    const agendaSubTabs = [
      { id: 'campos', label: 'Campos do formulário', icon: <FileText size={18} /> },
      { id: 'profissionais', label: 'Profissionais', icon: <UserCheck size={18} /> },
      { id: 'departamentos', label: 'Departamentos', icon: <Briefcase size={18} /> },
      { id: 'locais', label: 'Local de atendimento', icon: <MapPin size={18} /> },
      { id: 'procedimentos', label: 'Procedimentos', icon: <Briefcase size={18} /> },
      { id: 'motoristas', label: 'Motoristas', icon: <Car size={18} /> },
    ];

    const toggleSwitch = (
      <div className="relative inline-flex items-center cursor-pointer group">
        <input type="checkbox" className="sr-only peer" defaultChecked />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </div>
    );

    return (
      <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 items-start">
        {/* Sub-sidebar interna */}
        <div className="w-full lg:w-64 space-y-1">
          {agendaSubTabs.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveAgendaSubTab(sub.id as AgendaSubTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeAgendaSubTab === sub.id
                ? 'bg-[#EEF2FF] text-[#1E40AF] shadow-sm'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              {sub.icon} {sub.label}
            </button>
          ))}
        </div>

        {/* Conteúdo da Sub-tab de Agenda */}
        <div className="flex-1 w-full space-y-6">
          {activeAgendaSubTab === 'campos' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Campos do formulário</h3>
                <p className="text-sm text-slate-400 font-medium">Altere os campos que deseja visualizar no formulário de agendamento</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-50">
                  <div className="px-8 py-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Campo Nome do assistido*</span>
                    <span className="text-xs font-bold text-rose-500">*Campo obridatorio</span>
                  </div>
                  <div className="px-8 py-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Campo de Data e Hora*</span>
                    <span className="text-xs font-bold text-rose-500">*Campo obridatorio</span>
                  </div>
                  <div className="px-8 py-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Tornar visível campo de Local de atendimento?</span>
                    {toggleSwitch}
                  </div>
                  <div className="px-8 py-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Tornar visível campo de Procedimento?</span>
                    {toggleSwitch}
                  </div>
                  <div className="px-8 py-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Tornar visível campo de Profissional?</span>
                    {toggleSwitch}
                  </div>
                  <div className="px-8 py-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Campo Celular do Assistido*</span>
                    <span className="text-xs font-bold text-rose-500">*Campo obridatorio</span>
                  </div>
                  <div className="px-8 py-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Campo de Observações*</span>
                    <span className="text-xs font-bold text-rose-500">*Campo obridatorio</span>
                  </div>
                </div>
                <div className="p-6 bg-slate-50/30 flex justify-end">
                  <button className="px-10 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/10 transition-all active:scale-95">
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeAgendaSubTab === 'profissionais' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Profissionais</h3>
                <p className="text-sm text-slate-400 font-medium">Adicione, edite e visualize os profissionais cadastrados</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-black text-slate-700">Lista de Profissionais</h4>
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black border border-indigo-100">7 Cadastrados</span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 max-w-xl">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" placeholder="Buscar profissional" className="w-full h-10 pl-10 pr-4 bg-white border border-slate-100 rounded-xl text-xs font-medium outline-none focus:border-blue-400 transition-all" />
                    </div>
                    <button className="px-6 py-2.5 bg-[#4338CA] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap">
                      + Novo Profissional
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-4">NOME DO PROFISSIONAL</th>
                        <th className="px-8 py-4 text-right">AÇÃO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {["Adilson | Voluntário", "Ana | Voluntária", "Graça Caixeta | Voluntária", "Layla Tavares | PSI", "maria teste", "Priscila Cadete | Fisio"].map((nome, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4 text-sm font-bold text-slate-600">{nome}</td>
                          <td className="px-8 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-blue-400 hover:text-blue-600"><Pencil size={18} /></button>
                              <button className="p-2 text-rose-400 hover:text-rose-600"><Trash2 size={18} /></button>
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

          {activeAgendaSubTab === 'departamentos' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Departamento</h3>
                <p className="text-sm text-slate-400 font-medium">Adicione, edite e visualize os departamentos cadastrados</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-black text-slate-700">Lista de Departamentos</h4>
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black border border-indigo-100">9 Cadastrados</span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 max-w-xl">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" placeholder="Buscar produto" className="w-full h-10 pl-10 pr-4 bg-white border border-slate-100 rounded-xl text-xs font-medium outline-none focus:border-blue-400 transition-all" />
                    </div>
                    <button className="px-6 py-2.5 bg-[#4338CA] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap">
                      + Novo Departamento
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-4">NOME DO DEPARTAMENTO</th>
                        <th className="px-8 py-4">RESPONSÁVEL</th>
                        <th className="px-8 py-4 text-right">AÇÃO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { nome: "Comunicação", resp: "Graziela Vaz" },
                        { nome: "Contabilidade", resp: "" },
                        { nome: "Gerência", resp: "Daniel" },
                        { nome: "Hospitais", resp: "Renata | SAO" },
                        { nome: "Prestação de contas", resp: "" },
                        { nome: "Recepção", resp: "Maria de Fátima" },
                      ].map((dep, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-slate-900" />
                              <span className="text-sm font-bold text-slate-700">{dep.nome}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-sm font-medium text-slate-500">{dep.resp}</td>
                          <td className="px-8 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-blue-400 hover:text-blue-600"><Pencil size={18} /></button>
                              <button className="p-2 text-rose-400 hover:text-rose-600"><Trash2 size={18} /></button>
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

          {activeAgendaSubTab === 'locais' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Locais de atendimentos</h3>
                <p className="text-sm text-slate-400 font-medium">Adicione, edite e visualize o Local de Atendimento cadastrados</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-black text-slate-700">Locais de atendimento</h4>
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black border border-indigo-100">2 Cadastrados</span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 max-w-xl">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" placeholder="Buscar produto" className="w-full h-10 pl-10 pr-4 bg-white border border-slate-100 rounded-xl text-xs font-medium outline-none focus:border-blue-400 transition-all" />
                    </div>
                    <button className="px-6 py-2.5 bg-[#4338CA] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap">
                      + Novo Local
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-4">PROCEDIMENTO</th>
                        <th className="px-8 py-4">Endereço</th>
                        <th className="px-8 py-4 text-right">AÇÃO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { nome: "Hospital Mario Penna", end: "" },
                        { nome: "Capec", end: "R. dos Marmelos, 97 - Vila Cloris, Belo Horizonte - MG, 31744-093, Brasil" },
                      ].map((local, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4 text-sm font-bold text-slate-600">{local.nome}</td>
                          <td className="px-8 py-4 text-xs font-medium text-slate-400 max-w-md truncate">{local.end}</td>
                          <td className="px-8 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-blue-400 hover:text-blue-600"><Pencil size={18} /></button>
                              <button className="p-2 text-rose-400 hover:text-rose-600"><Trash2 size={18} /></button>
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

          {activeAgendaSubTab === 'procedimentos' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Procedimentos</h3>
                <p className="text-sm text-slate-400 font-medium">Adicione, edite e visualize os procedimentos cadastrados</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-black text-slate-700">Lista de Procedimentos</h4>
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black border border-indigo-100">10 Cadastrados</span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 max-w-xl">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" placeholder="Buscar procedimentos" className="w-full h-10 pl-10 pr-4 bg-white border border-slate-100 rounded-xl text-xs font-medium outline-none focus:border-blue-400 transition-all" />
                    </div>
                    <button className="px-6 py-2.5 bg-[#4338CA] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap">
                      + Novo Procedimento
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-4">NOME DO PROCEDIMENTO</th>
                        <th className="px-8 py-4">VALOR</th>
                        <th className="px-8 py-4 text-right">AÇÃO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {["Entrando na Linha", "evento - Outubro Rosa", "Fisioterapia", "Música", "Oficina Cognitiva", "Oficina de dança"].map((nome, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4 text-sm font-bold text-slate-600">{nome}</td>
                          <td className="px-8 py-4 text-sm font-medium text-slate-500">R$ 0,00</td>
                          <td className="px-8 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-blue-400 hover:text-blue-600"><Pencil size={18} /></button>
                              <button className="p-2 text-rose-400 hover:text-rose-600"><Trash2 size={18} /></button>
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

          {activeAgendaSubTab === 'motoristas' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Motoristas</h3>
                <p className="text-sm text-slate-400 font-medium">Altere os campos que deseja visualizar no formulário de agendamento</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-black text-slate-700">Lista de Motoristas</h4>
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black border border-indigo-100">3 Cadastrados</span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 max-w-xl">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" placeholder="Buscar motoristas" className="w-full h-10 pl-10 pr-4 bg-white border border-slate-100 rounded-xl text-xs font-medium outline-none focus:border-blue-400 transition-all" />
                    </div>
                    <button className="px-6 py-2.5 bg-[#4338CA] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap">
                      + Novo Motorista
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-4">NOME DO PROFISSIONAL</th>
                        <th className="px-8 py-4">CONTATO</th>
                        <th className="px-8 py-4 text-right">AÇÃO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { nome: "Adilson Araújo", contato: "31993886178" },
                        { nome: "Daniel Luiz", contato: "31992771839" },
                        { nome: "Renata - Teste", contato: "31988889202" },
                      ].map((mot, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4 text-sm font-bold text-slate-600">{mot.nome}</td>
                          <td className="px-8 py-4 text-sm font-medium text-slate-500">{mot.contato}</td>
                          <td className="px-8 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-blue-400 hover:text-blue-600"><Pencil size={18} /></button>
                              <button className="p-2 text-rose-400 hover:text-rose-600"><Trash2 size={18} /></button>
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
        </div>
      </div>
    );
  };

  const renderSubscriptionTab = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Assinatura */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black">LOGO</div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">CAPEC</h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">CAPEC</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95">
          <Lock size={18} /> Desativar acesso
        </button>
      </div>

      {/* Card do Plano Atual */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">WassabiPlano</h3>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">PREMIUM</span>
            </div>

            {/* Armazenamento */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Armazenamento 1000.6 MB de 1.0 GB</span>
              </div>
              <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#1E40AF] rounded-full transition-all duration-1000" style={{ width: '3%' }} />
              </div>
              <p className="text-[10px] font-black text-slate-400">3%</p>
            </div>

            {/* Notificações WhatsApp */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Notificações de whatsapp 250 de 1000</span>
              </div>
              <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: '25%' }} />
              </div>
              <p className="text-[10px] font-black text-slate-400">25%</p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-slate-400 uppercase">R$</span>
              <span className="text-5xl font-black text-slate-800 tracking-tighter">150,00</span>
              <span className="text-xs font-bold text-slate-400 ml-1">por ano</span>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all whitespace-nowrap">
                Atualizar assinatura
              </button>
              <button className="px-6 py-3 bg-[#0000FF] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-800 transition-all whitespace-nowrap">
                Upgrade de armazenamento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Pagamentos */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">Histórico de pagamentos</h2>
            <p className="text-sm text-slate-400 font-medium">Realize reembolso ou emissão de recibos</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="text"
                placeholder="Buscar por nº da nota"
                className="w-full md:w-64 h-10 pl-10 pr-4 bg-white border border-slate-100 rounded-xl text-xs font-medium outline-none focus:border-blue-400 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-white transition-all">
              <Filter size={16} /> Filtrar por
            </button>
            <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-white transition-all">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">DATA</th>
                <th className="px-8 py-5">RECIBO</th>
                <th className="px-8 py-5 text-center">STATUS</th>
                <th className="px-8 py-5">VALOR</th>
                <th className="px-8 py-5">PLANO</th>
                <th className="px-8 py-5 text-right">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-sm font-medium text-slate-500">01/07/2024</td>
                <td className="px-8 py-5 text-sm font-bold text-slate-600">Recibo #001 – Dez 2024</td>
                <td className="px-8 py-5 text-center">
                  <span className="px-4 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">Pendente</span>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-slate-700">R$ 199,90</td>
                <td className="px-8 py-5 text-sm font-medium text-slate-500">Básico</td>
                <td className="px-8 py-5 text-right">
                  <button className="text-blue-600 font-bold text-xs hover:underline decoration-2 underline-offset-4">Reembolso</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 items-start">
      <div className="w-full lg:w-64 space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Dados da conta</h2>
          <p className="text-xs text-slate-400 font-medium">Configurações Gerais</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveAccountSubTab('dados_ong')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeAccountSubTab === 'dados_ong'
              ? 'bg-[#EEF2FF] text-[#1E40AF] shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
              }`}
          >
            <Sparkles size={18} /> Dados da ONG
          </button>

          <button
            onClick={() => setActiveAccountSubTab('personalizacao')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeAccountSubTab === 'personalizacao'
              ? 'bg-[#EEF2FF] text-[#1E40AF] shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
              }`}
          >
            <Palette size={18} /> Personalização
          </button>

          <button
            onClick={() => setActiveAccountSubTab('documentos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeAccountSubTab === 'documentos'
              ? 'bg-[#EEF2FF] text-[#1E40AF] shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
              }`}
          >
            <FileBadge size={18} /> Documentos
          </button>

          <button
            onClick={() => setActiveAccountSubTab('comunicacao')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeAccountSubTab === 'comunicacao'
              ? 'bg-[#EEF2FF] text-[#1E40AF] shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
              }`}
          >
            <MessageSquare size={18} /> Comunicação
          </button>
        </nav>
      </div>

      <div className="flex-1 w-full space-y-8">
        {activeAccountSubTab === 'dados_ong' && renderDadosOng()}
        {activeAccountSubTab === 'personalizacao' && renderPersonalizacao()}
        {activeAccountSubTab === 'documentos' && renderDocumentos()}
        {activeAccountSubTab === 'comunicacao' && renderComunicacao()}
      </div>
    </div>
  );

  const renderBasketsTab = () => (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">Lista de Cestas</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
            {baskets.length} Cadastrados
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input
              type="text"
              placeholder="Buscar produto"
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
            />
          </div>
          <button className="w-full sm:w-auto px-10 py-3 bg-[#1E40AF] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-95 whitespace-nowrap">
            + Nova Cesta
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-5">NOME DA CESTA</th>
              <th className="px-8 py-5 text-center">TOTAL DE CESTAS</th>
              <th className="px-8 py-5 text-center">QUANT. DE ITENS</th>
              <th className="px-8 py-5 text-right">AÇÃO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {baskets.map((basket) => (
              <tr key={basket.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                      <ShoppingBasket size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{basket.nome}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="text-sm font-bold text-slate-600">{basket.total}</span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="text-sm font-bold text-slate-600">{basket.qtdItens}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-400 hover:text-blue-600 transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 text-rose-400 hover:text-rose-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCidTab = () => (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">Lista de CID</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
            {cidList.length} Cadastrados
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input
              type="text"
              placeholder="Buscar por código ou descrição"
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
            />
          </div>
          <button className="w-full sm:w-auto px-10 py-3 bg-[#1E40AF] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-95 whitespace-nowrap">
            + Novo CID
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-5">CÓDIGO CID</th>
              <th className="px-8 py-5">DESCRIÇÃO DA PATOLOGIA</th>
              <th className="px-8 py-5 text-right">AÇÃO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {cidList.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Activity size={18} />
                    </div>
                    <span className="text-sm font-black text-slate-700">{item.codigo}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-medium text-slate-600">{item.descricao}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-400 hover:text-blue-600 transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 text-rose-400 hover:text-rose-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSuppliersTab = () => (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">Lista de fornecedores</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
            {suppliers.length} Cadastrados
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input
              type="text"
              placeholder="Buscar produto"
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
            />
          </div>
          <button className="w-full sm:w-auto px-10 py-3 bg-[#1E40AF] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-95 whitespace-nowrap">
            + Novo Fornecedor
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-5">NOME DO FORNECEDOR</th>
              <th className="px-8 py-5">CPF/CNPJ</th>
              <th className="px-8 py-5">CONTATO</th>
              <th className="px-8 py-5 text-right">AÇÃO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {suppliers.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                      <Truck size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item.nome}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-medium text-slate-500">{item.documento}</span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-medium text-slate-500">{item.contato}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-400 hover:text-blue-600 transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 text-rose-400 hover:text-rose-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );



  const renderUsersTab = () => (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-700">Lista de Usuários</h2>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
            {users.length} Cadastrados
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="text"
              placeholder="Buscar usuário..."
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
            />
          </div>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} /> Novo Usuário
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-4">NOME DO USUÁRIO</th>
              <th className="px-8 py-4">EMAIL</th>
              <th className="px-8 py-4">CARGO</th>
              <th className="px-8 py-4 text-center">AÇÃO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.nome} className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-600">{user.nome}</span>
                  </div>
                </td>
                <td className="px-8 py-4 text-sm text-slate-400 font-medium">
                  {user.email}
                </td>
                <td className="px-8 py-4 text-sm text-slate-500 font-semibold">
                  {user.cargo}
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleSendLinkClick(user)}
                      className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                      title="Enviar Link de Acesso"
                    >
                      <Key size={18} />
                    </button>
                    <button className="p-2 text-blue-400 hover:text-blue-600 transition-colors" title="Permissões">
                      <SettingsIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">Registros de Atividades</h2>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
            {logs.length} Registros
          </span>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="Filtrar logs..."
            className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-4">DATA/HORA</th>
              <th className="px-8 py-4">USUÁRIO</th>
              <th className="px-8 py-4">AÇÃO</th>
              <th className="px-8 py-4">DETALHES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                    <CalendarDays size={14} />
                    {log.dataHora}
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-200">
                      {log.usuario.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{log.usuario}</p>
                      <p className="text-[10px] text-slate-400">{log.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${log.acao === 'Exclusão' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                    {log.acao}
                  </span>
                </td>
                <td className="px-8 py-4 text-xs text-slate-500 max-w-xs truncate" title={log.detalhes}>
                  {log.detalhes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full relative">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Configurações</h1>
          <p className="text-sm text-slate-400 font-medium">Gerencie as preferências e usuários do sistema</p>
        </div>
      </div>

      <div className="bg-slate-100/50 p-1 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-hide border border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id
              ? 'bg-white text-[#1E40AF] shadow-md shadow-slate-200/50 border border-slate-100'
              : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'conta' && renderAccountTab()}
        {activeTab === 'agenda' && renderAgendaTab()}
        {activeTab === 'cestas' && renderBasketsTab()}
        {activeTab === 'cid' && renderCidTab()}
        {activeTab === 'fornecedores' && renderSuppliersTab()}
        {activeTab === 'usuarios' && renderUsersTab()}
        {activeTab === 'logs' && renderLogsTab()}

        {activeTab !== 'conta' &&
          activeTab !== 'agenda' &&
          activeTab !== 'cestas' &&
          activeTab !== 'cid' &&
          activeTab !== 'fornecedores' &&
          activeTab !== 'usuarios' &&
          activeTab !== 'logs' && (
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <div className="p-6 bg-slate-50 text-slate-200 rounded-full mb-6">
                {activeTab === 'whatsapp' && <MessageSquare size={48} />}
                {activeTab === 'logs' && <History size={48} />}
                {activeTab === 'agenda' && <Calendar size={48} />}
                {activeTab === 'assinatura' && <CreditCard size={48} />}
                {activeTab === 'cestas' && <Package size={48} />}
                {activeTab === 'cid' && <Stethoscope size={48} />}
                {activeTab === 'fornecedores' && <ShieldCheck size={48} />}
              </div>
              <h3 className="text-xl font-bold text-slate-800">Em Desenvolvimento</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-xs">A seção de "{tabs.find(t => t.id === activeTab)?.label}" está sendo preparada para o próximo lançamento.</p>
            </div>
          )}
      </div>

      {/* Modais de Usuários */}
      {
        isAddUserModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAddUserModalOpen(false)} />
            <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <User size={24} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Novo Usuário</h2>
                </div>
                <button onClick={() => setIsAddUserModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Nome do colaborador"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Corporativo</label>
                    <input
                      type="email"
                      placeholder="colaborador@capec.org.br"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cargo / Função</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:bg-white transition-all cursor-pointer"
                    >
                      <option>Assistente Social</option>
                      <option>Gestão</option>
                      <option>Financeiro</option>
                      <option>Operacional</option>
                      <option>TI</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button onClick={() => setIsAddUserModalOpen(false)} className="px-6 py-3 text-slate-400 font-bold hover:text-slate-600 transition-all">Cancelar</button>
                  <button
                    onClick={handleCreateUser}
                    disabled={isCreatingUser}
                    className="px-10 py-3 bg-[#1E40AF] text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isCreatingUser ? 'Criando...' : 'Cadastrar Usuário'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Modal: Editar Usuário */}
      {
        isEditUserModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsEditUserModalOpen(false)} />
            <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Pencil size={24} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Editar Usuário</h2>
                </div>
                <button onClick={() => setIsEditUserModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                    <input
                      type="text"
                      defaultValue={selectedUser.nome}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Corporativo</label>
                    <input
                      type="email"
                      readOnly
                      defaultValue={selectedUser.email}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cargo / Função</label>
                    <select
                      defaultValue={selectedUser.cargo}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:bg-white transition-all cursor-pointer"
                    >
                      <option>Manutenção</option>
                      <option>RH</option>
                      <option>ADM</option>
                      <option>Assistente Social</option>
                      <option>Gestão</option>
                      <option>TI</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button onClick={() => setIsEditUserModalOpen(false)} className="px-6 py-3 text-slate-400 font-bold hover:text-slate-600 transition-all">Cancelar</button>
                  <button className="px-10 py-3 bg-[#1E40AF] text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Modal: Enviar Link de Acesso */}
      {
        isSendLinkModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSendLinkModalOpen(false)} />
            <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-blue-100">
                  <Send size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Enviar Link de Acesso</h2>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Deseja enviar um link de login único para o email institucional de <span className="font-bold text-slate-800">{selectedUser.nome}</span>?
                  </p>
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Mail size={14} /> {selectedUser.email}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={() => setIsSendLinkModalOpen(false)}
                    className="h-12 border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Agora não
                  </button>
                  <button
                    onClick={async () => {
                      if (!selectedUser?.email) return;

                      const { error } = await supabase.auth.resetPasswordForEmail(selectedUser.email, {
                        redirectTo: `${window.location.origin}/?reset=true`,
                      });

                      if (error) {
                        alert('Erro ao enviar link: ' + translateError(error.message));
                      } else {
                        alert(`Link de acesso enviado com sucesso para ${selectedUser.email}!`);
                        setIsSendLinkModalOpen(false);
                      }
                    }}
                    className="h-12 bg-[#1E40AF] text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                  >
                    Enviar Agora <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">O link expira em 24 horas por segurança.</p>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default SettingsPage;
