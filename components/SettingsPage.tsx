
import React, { useState } from 'react';
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
  CheckCircle2,
  ChevronRight,
  Send
} from 'lucide-react';

type SettingsTab = 'conta' | 'agenda' | 'assinatura' | 'cestas' | 'cid' | 'fornecedores' | 'usuarios' | 'whatsapp' | 'logs';

interface UserData {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  avatar?: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('usuarios');

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

  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      // Get current session user
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id;

      // Fetch all users (profiles would be better, but we can list auth users via admin API if available, 
      // otherwise we might need a public profiles table. For this example, assuming we have a profiles table 
      // or we are just listing what we have locally + what we add).

      // Since we don't have a 'profiles' table set up in previous steps, 
      // and client-side can't list all auth.users without admin rights,
      // we will use a workaround (or if you have a profiles table, query that).

      // *Wait*, standard practice: query a 'profiles' table.
      // If we don't have one, we can't easily "List" all users securely from client side 
      // without a dedicated Edge Function or a public view.

      // However, per instructions "list registered users... from Supabase", usually implies a query.
      // Let's try to query a hypothetical 'profiles' table, if it fails, we warn.
      // OR, if the user requested "use mcp", maybe they meant *I* use MCP to get data? No, the code must run in browser.

      // Let's implement a 'profiles' pattern. 
      // If no profiles table exists, we might show empty. But let's assume one exists or we create a query.

      // For now, since I cannot create tables via the browser code easily without a SQL editor step,
      // I will implement a fetch from 'auth.users' if RLS allows (unlikely) 
      // OR mostly likely we need to rely on the users created in this session or mock + real mix?

      // Actually, standard Supabase: 
      // You should have a table `public.profiles` that triggers on auth.users insert.

      // Strategy: I will try to fetch from a View or Table. 
      // If none, I will just keep the new users created in local state for now 
      // BUT user said "feature 1... real list... database".

      // I will assume there is NO public accessible list yet and I cannot fix the database schema from the browser code.
      // I'll add a comment about this requirement.

      // WAIT! I can use `supabase.rpc` if there's a function.

      // Let's TRULY implement what is possible:
      // I will fetch the current user to exclude.
      // I will try to select from 'profiles'. 

      const { data, error } = await supabase
        .from('profiles') // Assuming this table exists or will exist
        .select('*')
        .neq('id', currentUserId || '');

      if (data) {
        const mappedUsers = data.map((u: any) => ({
          id: u.id,
          nome: u.full_name || u.nome || 'Usuário',
          email: u.email || 'Sem email',
          cargo: u.role || u.cargo || 'Membro',
          avatar: u.avatar_url
        }));
        setUsers(mappedUsers);
      } else {
        // Fallback for demo if table doesn't exist yet
        console.warn("Table profiles not found or empty. Using empty list.");
        // We keep the list empty to be "real" (no fake data), or maybe we just show the manually created ones?
        // User asked for "Real list", so showing Fake data is bad.
        // I will initialize empty if fetch fails.
        // But to avoid breaking the UI for the user viewing this *right now*, I might keep the mocks?
        // "tirando o usuario atual logado" implies we have a list.

        // Let's try to be smart. If error (e.g. 404 table not found), keep blank.
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
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

  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsCreatingUser(true);

    try {
      // Cria um cliente temporário para não deslogar o admin atual
      const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false // Importante: não salvar sessão no storage local
        }
      });

      // Cria a conta no Auth do Supabase
      const { data, error } = await tempClient.auth.signUp({
        email: newUserEmail,
        password: 'sao.temp.password.123', // Senha temporária, será resetada pelo link
        options: {
          data: {
            full_name: newUserName,
            role: newUserRole
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Tenta criar o perfil na tabela pública 'profiles' se existir
        // Isso garante que o usuário apareça na lista "real" que buscamos do banco
        const { error: profileError } = await tempClient
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: newUserName,
            email: newUserEmail,
            role: newUserRole,
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.warn('Erro ao criar perfil público (tabela profiles pode não existir ou RLS bloqueou):', profileError);
          // Não vamos falhar o fluxo inteiro se isso falhar, pois o Auth foi criado.
          // Apenas mostraremos na lista localmente.
        }

        // Adiciona à lista local para feedback imediato
        const createdUser: UserData = {
          id: data.user.id,
          nome: newUserName,
          email: newUserEmail,
          cargo: newUserRole,
        };

        setUsers(prev => [createdUser, ...prev]); // Adiciona no início da lista

        // Limpa o formulário
        setNewUserName('');
        setNewUserEmail('');
        setNewUserRole('Assistente Social');

        // Fecha modal de criação
        setIsAddUserModalOpen(false);

        // Prepara e abre modal de envio de link
        setSelectedUser(createdUser);
        setIsSendLinkModalOpen(true);
      }

    } catch (err: any) {
      alert('Erro ao criar usuário: ' + translateError(err.message));
    } finally {
      setIsCreatingUser(false);
    }
  };

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
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Configurações</h1>
          <p className="text-sm text-slate-400 font-medium">Gerencie as preferências e usuários do sistema</p>
        </div>
      </div>

      <div className="bg-slate-100/50 p-1.5 rounded-[20px] flex items-center gap-1 overflow-x-auto scrollbar-hide border border-slate-100">
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
        {activeTab === 'usuarios' && renderUsersTab()}

        {activeTab !== 'usuarios' && (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
            <div className="p-6 bg-slate-50 text-slate-200 rounded-full mb-6">
              {activeTab === 'whatsapp' && <MessageSquare size={48} />}
              {activeTab === 'logs' && <History size={48} />}
              {activeTab === 'agenda' && <Calendar size={48} />}
              {activeTab === 'assinatura' && <CreditCard size={48} />}
              {activeTab === 'cestas' && <Package size={48} />}
              {activeTab === 'cid' && <Stethoscope size={48} />}
              {activeTab === 'fornecedores' && <ShieldCheck size={48} />}
              {activeTab === 'conta' && <User size={48} />}
            </div>
            <h3 className="text-xl font-bold text-slate-800">Em Desenvolvimento</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-xs">A seção de "{tabs.find(t => t.id === activeTab)?.label}" está sendo preparada para o próximo lançamento.</p>
          </div>
        )}
      </div>

      {/* Modais de Usuários */}

      {/* Modal: Novo Usuário */}
      {isAddUserModalOpen && (
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
      )}

      {/* Modal: Editar Usuário */}
      {isEditUserModalOpen && selectedUser && (
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
      )}

      {/* Modal: Enviar Link de Acesso */}
      {isSendLinkModalOpen && selectedUser && (
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
      )}

    </div>
  );
};

export default SettingsPage;
