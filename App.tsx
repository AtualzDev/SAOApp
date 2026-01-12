
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
import ManagementOngsPage from './components/ManagementOngsPage'; // Nova importação
import ManagementLeadsPage from './components/ManagementLeadsPage'; // Nova importação
import { MOCK_LAUNCHES } from './constants';
import { Plus, Package, ClipboardList, PackageMinus, Map, Users } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'forgot-password' | 'reset-password' | 'privacy-policy' | 'terms-of-use'>('login');
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

  if (!isLoggedIn) {
    if (authView === 'forgot-password') {
      return <ForgotPasswordPage onBackToLogin={() => setAuthView('login')} />;
    }
    if (authView === 'reset-password') {
      return <ResetPasswordPage onBackToLogin={() => setAuthView('login')} onResetComplete={() => setAuthView('login')} />;
    }
    if (authView === 'privacy-policy') {
      return <PrivacyPolicyPage onBack={() => setAuthView('login')} />;
    }
    if (authView === 'terms-of-use') {
      return <TermsOfUsePage onBack={() => setAuthView('login')} />;
    }
    return (
      <LoginPage 
        onLogin={() => setIsLoggedIn(true)} 
        onForgotPassword={() => setAuthView('forgot-password')}
        onShowPrivacy={() => setAuthView('privacy-policy')}
        onShowTerms={() => setAuthView('terms-of-use')}
      />
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
              <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 font-bold text-sm">
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
              <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-95 font-bold text-sm">
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
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 font-bold text-sm" onClick={() => setIsFormOpen(true)}>
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
              <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 font-bold text-sm">
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
              <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 font-bold text-sm">
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

  const handleSidebarSelect = (id: string) => {
    if (id === 'notificacao') {
      setIsNotificationOpen(!isNotificationOpen);
      return;
    }

    // Lógica para desmarcar o modo Gestor
    if (id === 'gestor' && isManagementMode) {
      setActiveTab('inicio');
      setIsManagementMode(false);
      setIsFormOpen(false);
      setIsNotificationOpen(false);
      return;
    }

    setActiveTab(id);
    setIsFormOpen(false);
    setIsNotificationOpen(false);
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-['Inter']">
      <Sidebar 
        activeId={activeTab} 
        onSelect={handleSidebarSelect} 
        isManagementMode={isManagementMode}
      />
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
