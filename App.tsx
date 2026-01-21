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
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfUsePage from './components/TermsOfUsePage';
import Dashboard from './components/Dashboard';
import Agenda from './components/Agenda';
import UserProfilePage from './components/UserProfilePage';
import SettingsPage from './components/SettingsPage';
import RoutePage from './components/RoutePage';
import ReportsPage from './components/ReportsPage';
import ManagementDashboard from './components/ManagementDashboard';
import SupportPage from './components/SupportPage';
import FinancePage from './components/FinancePage';
import ManagementFinancePage from './components/ManagementFinancePage';
import ManagementSubscriptionsPage from './components/ManagementSubscriptionsPage';
import ManagementOngsPage from './components/ManagementOngsPage';
import ManagementLeadsPage from './components/ManagementLeadsPage';
import LandingPage from './components/LandingPage';
import { MOCK_LAUNCHES } from './constants';
import { Plus, Package, ClipboardList, PackageMinus, Map } from 'lucide-react';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authView, setAuthView] = useState<'landing' | 'login' | 'forgot-password' | 'reset-password' | 'privacy-policy' | 'terms-of-use'>('landing');
  const [activeTab, setActiveTab] = useState('inicio');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isManagementMode, setIsManagementMode] = useState(false);

  // Monitora se entra no modo gestão
  useEffect(() => {
    if (activeTab === 'gestor' || activeTab.startsWith('gestor-')) {
      setIsManagementMode(true);
    } else {
      setIsManagementMode(false);
    }
  }, [activeTab]);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      // Hash check for password reset (Supabase sends #access_token=...)
      const hash = window.location.hash;
      // Query param check (if we manually redirected with ?reset=true)
      const urlParams = new URLSearchParams(window.location.search);

      if ((hash && hash.includes('type=recovery')) || urlParams.get('reset') === 'true') {
        setAuthView('reset-password');
      }

      setIsCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);

      const isRecovery = window.location.hash.includes('type=recovery') ||
        window.location.search.includes('reset=true');

      if (session && !isRecovery && _event !== 'PASSWORD_RECOVERY') {
        // Logged in normally
      } else if (isRecovery || _event === 'PASSWORD_RECOVERY') {
        setAuthView('reset-password');
      }
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

  // Handle Privacy Policy and Terms of Use relative pages (without login requirment)
  if (authView === 'privacy-policy') {
    return <PrivacyPolicyPage onBack={() => setAuthView('login')} />;
  }
  if (authView === 'terms-of-use') {
    return <TermsOfUsePage onBack={() => setAuthView('login')} />;
  }

  if (!isLoggedIn) {
    if (authView === 'landing') {
      return <LandingPage onLoginClick={() => setAuthView('login')} />;
    }
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

    if (activeTab === 'suporte' || activeTab === 'gestor-suporte') {
      return <SupportPage />;
    }

    if (activeTab === 'financeiro') {
      return <FinancePage />;
    }

    // Lógica para o Financeiro Global (Gestor)
    if (activeTab === 'gestor-financeiro') {
      return <ManagementFinancePage />;
    }

    // Lógica para Assinaturas e Planos (Gestor)
    if (activeTab === 'gestor-assinaturas') {
      return <ManagementSubscriptionsPage />;
    }

    // Lógica para Ongs Ativas (Gestor)
    if (activeTab === 'gestor-ongs') {
      return <ManagementOngsPage />;
    }

    // Lógica para Leads (Gestor)
    if (activeTab === 'gestor-leads') {
      return <ManagementLeadsPage />;
    }

    if (activeTab === 'inicio' || activeTab === 'gestor-painel' || activeTab === 'gestor') {
      return isManagementMode ? <ManagementDashboard /> : <Dashboard />;
    }

    if (activeTab === 'agenda') {
      return <Agenda />;
    }

    if (activeTab === 'rotas') {
      return <RoutePage />;
    }

    if (activeTab === 'relatorios') {
      return <ReportsPage />;
    }

    // Lógica para o Estoque
    if (activeTab === 'estoque' || activeTab === 'estoque-visao-geral') {
      return <StockDashboard onNavigate={(id) => setActiveTab(id)} />;
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

    if (activeTab === 'auditoria' || activeTab === 'estoque-auditoria') {
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

    if (activeTab === 'setores' || activeTab === 'estoque-setores') {
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

    if (activeTab === 'saidas' || activeTab === 'estoque-saidas') {
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

    if (activeTab === 'categorias' || activeTab === 'estoque-categorias') {
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

    if (activeTab === 'produtos' || activeTab === 'estoque-produtos') {
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

    if (activeTab === 'entradas' || activeTab === 'estoque-entradas') {
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
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Plus size={32} /></div>
        <h2 className="text-xl font-bold text-slate-600">Módulo em Desenvolvimento</h2>
        <p className="max-w-xs mt-2">A seção de "{activeTab}" está sendo preparada para o próximo lançamento da plataforma.</p>
        <button onClick={() => { setActiveTab('inicio'); setIsManagementMode(false); }} className="mt-6 text-[#1E40AF] font-bold hover:underline">Voltar ao Início</button>
      </div>
    );
  };

  const handleSidebarSelect = async (id: string) => {
    if (id === 'notificacao') {
      setIsNotificationOpen(!isNotificationOpen);
      return;
    }

    if (id === 'gestor' && isManagementMode) {
      setActiveTab('inicio');
      setIsManagementMode(false);
      setIsFormOpen(false);
      setIsNotificationOpen(false);
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
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-['Inter']">
      {/* 
         Combined logic:
         HEAD used: activeId logic
         main used: activeId + isManagementMode logic
      */}
      <Sidebar
        activeId={activeTab}
        onSelect={handleSidebarSelect}
        isManagementMode={isManagementMode}
      />
      {isNotificationOpen && <NotificationPopover onClose={() => setIsNotificationOpen(false)} />}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC]">
        {renderContent()}
        <footer className="mt-auto px-8 py-6 border-t border-slate-100 text-slate-400 text-[10px] flex justify-between items-center bg-white">
          <div className="flex items-center gap-1">
            {/* Dynamic Logo Placeholder - Will be updated with context/state later */}
            <div className="h-6 w-20 bg-slate-100 rounded-md flex items-center justify-center text-[8px] font-bold text-slate-300">LOGO ONG</div>
          </div>
          <div className="flex items-center gap-1 font-semibold">
            <span>© 2026 SAO - </span>
            <span>Sistema de Gestão e Assistência</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
