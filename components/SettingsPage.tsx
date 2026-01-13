
import React, { useState, useEffect } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from '../services/supabase';
import { createClient } from '@supabase/supabase-js';
import { translateError } from '../services/errorTranslator';
import {
  Search,
  Plus,
  Pencil,
  Settings as SettingsIcon,
  Key,
  User,
  ShieldCheck,
  History,
  MessageSquare,
  Package,
  Calendar,
  CreditCard,
  Stethoscope,
  X,
  Mail,
  ChevronRight,
  Send,
  Sparkles,
  Image as ImageIcon,
  Upload,
  FileSignature,
  FileText,
  UserCheck,
  Briefcase,
  MapPin,
  Car,
  Trash2,
  Lock,
  Download,
  Filter,
  ShoppingBasket,
  Activity,
  Truck,
  UserX,
  CalendarDays
} from 'lucide-react';

type SettingsTab = 'conta' | 'agenda' | 'assinatura' | 'cestas' | 'cid' | 'fornecedores' | 'usuarios' | 'whatsapp' | 'logs';
type AccountSubTab = 'logo' | 'cabecalho';
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
  const [activeTab, setActiveTab] = useState<SettingsTab>('fornecedores');
  const [activeAccountSubTab, setActiveAccountSubTab] = useState<AccountSubTab>('logo');
  const [activeAgendaSubTab, setActiveAgendaSubTab] = useState<AgendaSubTab>('campos');

  // Organization State
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState('');
  const [orgCnpj, setOrgCnpj] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgCity, setOrgCity] = useState('');
  const [orgState, setOrgState] = useState('');
  const [orgLogo, setOrgLogo] = useState('');
  const [orgColor, setOrgColor] = useState('#1E40AF');
  const [orgHeader, setOrgHeader] = useState('');
  const [orgSignature, setOrgSignature] = useState('');

  const [loadingOrg, setLoadingOrg] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);
  // States para Modais
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isSendLinkModalOpen, setIsSendLinkModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // States para Formulário de Novo Usuário
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Assistente Social');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const tabs = [
    { id: 'conta', label: 'Dados da conta' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'assinatura', label: 'Assinatura' },
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
    { id: '3', usuario: 'Nome do usuário', email: 'emaildaong@gmail.com', acao: 'Exclusão', detalhes: 'Foi realizado a exclusão do item macarrão do estoque.', dataHora: '20/02/25 - 22:36' },
    { id: '4', usuario: 'Nome do usuário', email: 'emaildaong@gmail.com', acao: 'Exclusão', detalhes: 'Foi realizado a exclusão do item óleo do estoque.', dataHora: '20/02/25 - 22:36' },
    { id: '5', usuario: 'Nome do usuário', email: 'emaildaong@gmail.com', acao: 'Exclusão', detalhes: 'Foi realizado a exclusão do item sal do estoque.', dataHora: '20/02/25 - 22:36' },
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
          setOrgLogo(org.logo_url || '');
          setOrgColor(org.primary_color || '#1E40AF');
          setOrgHeader(org.header_url || '');
          setOrgSignature(org.signature_url || '');
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
      const { error } = await supabase
        .from('empresa_ongs')
        .update({
          name: orgName,
          cnpj: orgCnpj,
          contact_phone: orgPhone,
          address: orgAddress,
          city: orgCity,
          state: orgState,
          logo_url: orgLogo,
          primary_color: orgColor,
          header_url: orgHeader,
          signature_url: orgSignature
        })
        .eq('id', orgId);

      if (error) throw error;
      alert('Dados da organização salvos com sucesso!');
    } catch (error: any) {
      alert('Erro ao salvar organização: ' + error.message);
    } finally {
      setSavingOrg(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'header' | 'signature') => {
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

      if (field === 'logo') setOrgLogo(publicUrl);
      if (field === 'header') setOrgHeader(publicUrl);
      if (field === 'signature') setOrgSignature(publicUrl);

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

  const renderAccountTab = () => (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 items-start">
      <div className="w-full lg:w-64 space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Dados da conta</h2>
          <p className="text-xs text-slate-400 font-medium">Configurações Gerais</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveAccountSubTab('logo')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeAccountSubTab === 'logo'
              ? 'bg-[#EEF2FF] text-[#1E40AF] shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
              }`}
          >
            <Sparkles size={18} /> Logotipo e dados
          </button>
          <button
            onClick={() => setActiveAccountSubTab('cabecalho')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeAccountSubTab === 'cabecalho'
              ? 'bg-[#EEF2FF] text-[#1E40AF] shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
              }`}
          >
            <ImageIcon size={18} /> Cabeçalho
          </button>
        </nav>
      </div>

      <div className="flex-1 w-full space-y-8">
        {activeAccountSubTab === 'logo' ? (
          <section className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Informações da ONG</h3>
              <p className="text-sm text-slate-400 font-medium">Altere nome e endereço a instituição</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700">Logotipo da empresa</label>
                    <div className="w-full h-32 border-2 border-dashed border-blue-600/30 bg-slate-50/20 rounded-xl flex items-center justify-center p-4 relative group cursor-pointer hover:bg-blue-50/30 transition-all overflow-hidden">
                      <img
                        src={orgLogo || "https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg"}
                        alt="Logo"
                        className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                        <Upload className="text-blue-600" size={24} />
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleUpload(e, 'logo')}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                      Use imagens no formato PNG. com as dimensões 500x80
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700">Escolha a cor primária da marca</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={orgColor}
                        onChange={(e) => setOrgColor(e.target.value)}
                        className="w-10 h-10 rounded-lg shadow-sm border-2 border-white ring-2 ring-slate-100 p-0 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-500 uppercase">{orgColor}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className="text-sm font-bold text-slate-600">CNPJ da Instituição</label>
                      <input
                        type="text"
                        value={orgCnpj}
                        onChange={(e) => setOrgCnpj(formatCNPJ(e.target.value))}
                        maxLength={18}
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-600">Contato</label>
                    <input
                      type="text"
                      value={orgPhone}
                      onChange={(e) => setOrgPhone(formatPhoneNumber(e.target.value))}
                      maxLength={15}
                      className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-600">Endereço</label>
                    <input
                      type="text"
                      value={orgAddress}
                      onChange={(e) => setOrgAddress(e.target.value)}
                      placeholder="Rua, Número, Bairro..."
                      className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-600">Cidade</label>
                      <input
                        type="text"
                        value={orgCity}
                        onChange={(e) => setOrgCity(e.target.value)}
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-600">Estado</label>
                      <input
                        type="text"
                        value={orgState}
                        onChange={(e) => setOrgState(e.target.value)}
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 transition-all"
                      />
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
                  {savingOrg ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Cabeçalho</h3>
              <p className="text-sm text-slate-400 font-medium">Altere o cabeçalho dos seus relatórios</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-10">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Adicionar cabeçalho dos relatórios</label>
                <div className="w-full h-48 border-2 border-dashed border-blue-600/30 bg-slate-50/20 rounded-xl flex items-center justify-center p-8 cursor-pointer hover:bg-blue-50/30 transition-all group relative overflow-hidden">
                  <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm border border-slate-100 transition-transform group-hover:scale-[1.02]">
                    <img
                      src={orgHeader || "https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg"}
                      alt="Header Preview"
                      className="h-10 md:h-12 w-auto object-contain"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleUpload(e, 'header')}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Use imagens no formato PNG. com as dimensões 500x80
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Adicionar assinatura dos relatórios</label>
                <div className="w-56 h-56 border-2 border-dashed border-blue-600/30 bg-slate-50/20 rounded-xl flex items-center justify-center p-6 cursor-pointer hover:bg-blue-50/30 transition-all group relative overflow-hidden">
                  <div className="bg-white w-full h-full rounded-lg shadow-sm border border-slate-100 flex flex-col items-center justify-center p-4 transition-transform group-hover:scale-105">
                    {orgSignature ? (
                      <img src={orgSignature} alt="Assinatura" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <>
                        <FileSignature size={48} className="text-slate-300" />
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase text-center">Assinatura Digital</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleUpload(e, 'signature')}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Use imagens no formato PNG. com as dimensões 150x150
                </p>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-50">
                <button
                  onClick={saveOrganization}
                  disabled={savingOrg}
                  className="px-10 py-3 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {savingOrg ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </section>
        )}
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

  const renderLogsTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Atividade de logs</h1>

      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="space-y-1 mb-8">
            <h2 className="text-xl font-black text-slate-800">Logs</h2>
            <p className="text-sm text-slate-400 font-medium">Leads cadastrados {logs.length * 6}</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
            <div className="relative w-full lg:w-48">
              <select className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-400 outline-none focus:border-blue-400 transition-all appearance-none cursor-pointer">
                <option>Filtrar por</option>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-300" size={16} />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-44">
                <input type="text" placeholder="Air Date/Time Pick" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-300 outline-none" />
                <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200" size={16} />
              </div>
              <div className="relative flex-1 lg:w-44">
                <input type="text" placeholder="Air Date/Time Pick" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-300 outline-none" />
                <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200" size={16} />
              </div>
            </div>

            <div className="relative flex-1 w-full lg:max-w-2xl">
              <input
                type="text"
                placeholder="Buscar por user"
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto -mx-8">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">USUÁRIO</th>
                  <th className="px-8 py-5">AÇÃO</th>
                  <th className="px-8 py-5">DETALHES</th>
                  <th className="px-8 py-5 text-right">DATA - HORA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                          <img src={`https://i.pravatar.cc/150?u=${log.id}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 leading-none">{log.usuario}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1">{log.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-rose-600 border border-rose-100 bg-rose-50/30">
                        <Trash2 size={12} /> {log.acao}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium text-slate-500">{log.detalhes.split('arroz').map((p, i, a) => i < a.length - 1 ? <span key={i}>{p}<span className="font-bold text-slate-700">arroz</span></span> : p)}</p>
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-500">{log.dataHora}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
        {activeTab === 'assinatura' && renderSubscriptionTab()}
        {activeTab === 'cestas' && renderBasketsTab()}
        {activeTab === 'cid' && renderCidTab()}
        {activeTab === 'fornecedores' && renderSuppliersTab()}
        {activeTab === 'usuarios' && renderUsersTab()}
        {activeTab === 'logs' && renderLogsTab()}

        {activeTab !== 'conta' && activeTab !== 'usuarios' && activeTab !== 'agenda' && activeTab !== 'assinatura' && activeTab !== 'cestas' && activeTab !== 'cid' && activeTab !== 'fornecedores' && activeTab !== 'logs' && (
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
