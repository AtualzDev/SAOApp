import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LaunchTable from './components/LaunchTable';
import LaunchForm from './components/LaunchForm';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import CategoryTable from './components/CategoryTable';
import CategoryForm from './components/CategoryForm';
import SectorTable from './components/SectorTable';
import SectorForm from './components/SectorForm';
import ExitTable from './components/ExitTable';
import ExitForm from './components/ExitForm';
import BeneficiaryTable from './components/BeneficiaryTable';
import BeneficiaryForm from './components/BeneficiaryForm';
import AuditPage from './components/AuditPage';
import SocialAssistanceModule from './components/SocialAssistanceModule';
import StockDashboard from './components/StockDashboard';
import NotificationPopover from './components/NotificationPopover';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import Dashboard from './components/Dashboard';
import Agenda from './components/Agenda';
import UserProfilePage from './components/UserProfilePage';
import SettingsPage from './components/SettingsPage';
import { MOCK_LAUNCHES } from './constants';
import { Plus, Package, ClipboardList, PackageMinus, Map } from 'lucide-react';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'forgot-password' | 'reset-password'>('login');
  const [activeTab, setActiveTab] = useState('inicio');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsCheckingAuth(false);
    });

    // Hash check for password reset (Supabase sends #access_token=...)
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setAuthView('reset-password');
    }

    // Query param check (if we manually redirected with ?reset=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'true') {
      setAuthView('reset-password');
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);

      const isRecovery = window.location.hash.includes('type=recovery') ||
        window.location.search.includes('reset=true');

      if (session && !isRecovery && _event !== 'PASSWORD_RECOVERY') {
        setAuthView('login');
      } else if (isRecovery || _event === 'PASSWORD_RECOVERY') {
        setAuthView('reset-password');
      }
      setIsCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-vh-screen h-screen w-full bg-white">
        <div className="flex flex-col items-center gap-6">
          <img
            src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg"
            alt="SAO Logo"
            className="h-16 w-auto animate-pulse"
          />
          <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-[#1E40AF] rounded-full animate-loading-bar w-1/3"></div>
          </div>
          <p className="text-sm font-medium text-slate-400 animate-pulse">Carregando SAO...</p>
        </div>
        <style>{`
          @keyframes loading-bar {
            0% { left: -33%; }
            100% { left: 100%; }
          }
          .animate-loading-bar {
            animation: loading-bar 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Force render Reset Password Page if view is set, REGARDLESS of login status
  // This is crucial because password recovery links log the user in automatically
  if (authView === 'reset-password') {
    return (
      <div className="h-screen w-full animate-in fade-in duration-700">
        <ResetPasswordPage onBackToLogin={() => {
          // Clear URL params to prevent loop
          window.history.replaceState({}, document.title, "/");
          setAuthView('login');
          // If logged in, this will drop through to dashboard below
        }} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="h-screen w-full animate-in fade-in duration-700">
        {authView === 'reset-password' && <ResetPasswordPage onBackToLogin={() => setAuthView('login')} />}
        {authView === 'forgot-password' && <ForgotPasswordPage onBackToLogin={() => setAuthView('login')} />}
        {authView === 'login' && <LoginPage onLogin={() => setIsLoggedIn(true)} onForgotPassword={() => setAuthView('forgot-password')} />}
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'perfil') {
      return <UserProfilePage />;
    }

    if (activeTab === 'inicio') {
      return <Dashboard />;
    }

    if (activeTab === 'agenda') {
      return <Agenda />;
    }

    // Lógica para o Estoque (Se for o item pai ou dashboard específico)
    if (activeTab === 'estoque' || activeTab === 'estoque-visao-geral') {
      return <StockDashboard />;
    }

    // Mapeamento de submenus de Assistência Social
    const socialAssistanceTabs = ['assistencia', 'soc-visao-geral', 'soc-historico', 'soc-solicitacoes', 'soc-acompanhamento'];
    if (socialAssistanceTabs.includes(activeTab)) {
      let subTab: any = 'visao-geral';
      if (activeTab === 'soc-historico') subTab = 'historico';
      if (activeTab === 'soc-solicitacoes') subTab = 'solicitacoes';
      if (activeTab === 'soc-acompanhamento') subTab = 'acompanhamento-externo';

      return <SocialAssistanceModule initialTab={subTab} onTabChange={(newTab) => {
        let newId = 'soc-visao-geral';
        if (newTab === 'historico') newId = 'soc-historico';
        if (newTab === 'solicitacoes') newId = 'soc-solicitacoes';
        if (newTab === 'acompanhamento-externo') newId = 'soc-acompanhamento';
        setActiveTab(newId);
      }} />;
    }

    if (activeTab === 'auditoria') {
      return <AuditPage />;
    }

    if (activeTab === 'configuracoes') {
      return <SettingsPage />;
    }

    if (activeTab === 'assistidos') {
      if (isFormOpen) {
        return <BeneficiaryForm onCancel={() => setIsFormOpen(false)} />;
      }
      return (
        <section className="px-6 md:px-8 py-6 space-y-6">
          <BeneficiaryTable onNew={() => setIsFormOpen(true)} />
        </section>
      );
    }

    if (activeTab === 'setores') {
      if (isFormOpen) {
        return <SectorForm onCancel={() => setIsFormOpen(false)} />;
      }
      return (
        <>
          <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-6 md:px-8 md:py-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hidden md:block"><Map size={20} /></div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Setores de Estoque</h1>
                <p className="text-xs text-slate-400 mt-0.5">Gestão de locais físicos e capacidade</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 font-bold text-sm"
              >
                <Plus size={18} /> Novo Setor
              </button>
            </div>
          </header>
          <section className="px-6 md:px-8 py-6 space-y-6"><SectorTable /></section>
        </>
      );
    }

    if (activeTab === 'saidas') {
      if (isFormOpen) {
        return <ExitForm onCancel={() => setIsFormOpen(false)} />;
      }
      return (
        <>
          <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-6 md:px-8 md:py-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg hidden md:block"><PackageMinus size={20} /></div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Saídas de Estoque</h1>
                <p className="text-xs text-slate-400 mt-0.5">Controle de baixas, consumos e transferências</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-95 font-bold text-sm"
              >
                <Plus size={18} /> Nova Saída
              </button>
            </div>
          </header>
          <section className="px-6 md:px-8 py-6 space-y-6"><ExitTable /></section>
        </>
      );
    }

    if (activeTab === 'categorias') {
      if (isFormOpen) {
        return <CategoryForm onCancel={() => setIsFormOpen(false)} />;
      }
      return (
        <>
          <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-6 md:px-8 md:py-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hidden md:block"><ClipboardList size={20} /></div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Categorias</h1>
                <p className="text-xs text-slate-400 mt-0.5">Organização e hierarquia do inventário</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 font-bold text-sm"
              >
                <Plus size={18} /> Nova Categoria
              </button>
            </div>
          </header>
          <section className="px-6 md:px-8 py-6 space-y-6"><CategoryTable /></section>
        </>
      );
    }

    if (activeTab === 'produtos') {
      if (isFormOpen) {
        return <ProductForm onCancel={() => setIsFormOpen(false)} />;
      }
      return (
        <>
          <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-6 md:px-8 md:py-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hidden md:block"><Package size={20} /></div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Produtos/Itens</h1>
                <p className="text-xs text-slate-400 mt-0.5">Gestão de catálogo e controle de níveis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 font-bold text-sm"
              >
                <Plus size={18} /> Novo Produto
              </button>
            </div>
          </header>
          <section className="px-6 md:px-8 py-6 space-y-6"><ProductTable /></section>
        </>
      );
    }

    if (activeTab === 'entradas') {
      if (isFormOpen) {
        return <LaunchForm onCancel={() => setIsFormOpen(false)} />;
      }

      return (
        <>
          <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-6 md:px-8 md:py-6 flex items-center justify-between border-b border-slate-100">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Lançamentos</h1>
              <p className="text-xs text-slate-400 mt-0.5">Gestão de entradas e estoque</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 font-bold text-sm"
              >
                <Plus size={18} /> Novo lançamento
              </button>
            </div>
          </header>
          <section className="px-6 md:px-8 py-6 space-y-6"><LaunchTable launches={MOCK_LAUNCHES} /></section>
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Plus size={32} /></div>
        <h2 className="text-xl font-bold text-slate-600">Em Desenvolvimento</h2>
        <p className="max-w-xs mt-2">A seção de "{activeTab}" está sendo preparada para o próximo lançamento.</p>
        <button
          onClick={() => setActiveTab('inicio')}
          className="mt-6 text-[#1E40AF] font-bold hover:underline"
        >
          Voltar ao Início
        </button>
      </div>
    );
  };

  const handleSidebarSelect = async (id: string) => {
    if (id === 'notificacao') {
      setIsNotificationOpen(!isNotificationOpen);
      return;
    }
    if (id === 'logout') {
      await supabase.auth.signOut();
      return;
    }
    setActiveTab(id);
    setIsFormOpen(false);
    setIsNotificationOpen(false);
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-['Inter'] animate-in fade-in duration-700">
      <Sidebar activeId={activeTab} onSelect={handleSidebarSelect} />
      {isNotificationOpen && <NotificationPopover onClose={() => setIsNotificationOpen(false)} />}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC]">
        {renderContent()}
        <footer className="mt-auto px-8 py-6 border-t border-slate-100 text-slate-400 text-[10px] flex justify-between bg-white">
          <div className="flex items-center gap-1">
            <span>© 2026 SAO - </span>
            <span className="font-bold">Sistema de Gestão e Assistência</span>
          </div>
          <div className="flex gap-4 font-semibold">
            <a href="#" className="hover:text-blue-600 transition-colors">Suporte</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Documentação</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
