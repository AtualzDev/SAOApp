
import React, { useState } from 'react';
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
  Stethoscope
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

  const users: UserData[] = [
    { id: '1', nome: 'Adilson', email: 'adilson@capec.org.br', cargo: 'Manutenção' },
    { id: '2', nome: 'Camila Ornelas', email: 'camila@capec.org.br', cargo: 'RH' },
    { id: '3', nome: 'Daniel', email: 'capec@capec.com.br', cargo: 'ADM', avatar: 'https://i.pravatar.cc/150?u=daniel' },
    { id: '4', nome: 'Érica Regina de Carvalho Pontes', email: 'erica@capec.org.br', cargo: 'Assistente Social' },
    { id: '5', nome: 'Graziela Vaz', email: 'graziela@capec.org.br', cargo: 'Gestão', avatar: 'https://i.pravatar.cc/150?u=graziela' },
    { id: '6', nome: 'Guilherme Rodrigues', email: 'guilherme@capec.org.br', cargo: 'Office Boy' },
    { id: '7', nome: 'Isaque Putumuju', email: 'isaquephputumuju@gmail.com', cargo: 'TI' },
    { id: '8', nome: 'Maria de Fátima', email: 'maria@capec.org.br', cargo: 'Recepção' },
    { id: '9', nome: 'Renata | SAO', email: 'comercial@sao.app', cargo: 'Comercial' },
    { id: '10', nome: 'Renata | Suporte', email: 'renata@capec.org.br', cargo: 'Suporte' },
    { id: '11', nome: 'adriana@capec.org.br', email: 'adriana@capec.org.br', cargo: 'Assistente Social' },
  ];

  const renderUsersTab = () => (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* Toolbar da Tabela */}
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
              placeholder="Buscar produto" 
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap">
            <Plus size={18} /> Novo Usuário
          </button>
        </div>
      </div>

      {/* Tabela */}
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
                    <button className="p-2 text-blue-400 hover:text-blue-600 transition-colors" title="Editar">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 text-blue-400 hover:text-blue-600 transition-colors" title="Alterar Senha">
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
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Configurações</h1>
          <p className="text-sm text-slate-400 font-medium">Gerencie as preferências e usuários do sistema</p>
        </div>
      </div>

      {/* Navegação por Abas Horizontal */}
      <div className="bg-slate-100/50 p-1.5 rounded-[20px] flex items-center gap-1 overflow-x-auto scrollbar-hide border border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white text-[#1E40AF] shadow-md shadow-slate-200/50 border border-slate-100' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Abas */}
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
    </div>
  );
};

export default SettingsPage;
