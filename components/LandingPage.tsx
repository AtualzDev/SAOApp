
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  Play, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  MessageCircle,
  Package,
  Heart,
  Calendar,
  Stethoscope,
  Activity,
  Plus,
  Minus,
  Wallet,
  LayoutGrid,
  ChevronDown,
  Globe,
  Star,
  X,
  Menu,
  Mail,
  Phone,
  Send,
  Quote,
  PieChart,
  Landmark,
  BriefcaseMedical,
  LineChart,
  DollarSign
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

interface ModalContent {
  title: string;
  desc: string;
}

// Hook para animação de entrada ao rolar (estilo paralax de revelação)
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className, id }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div 
      ref={ref} 
      id={id}
      className={`${className} transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {children}
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isCtaModalOpen, setIsCtaModalOpen] = useState(false);
  const [resourceModal, setResourceModal] = useState<ModalContent | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');

  const primaryBlue = "#3b32cc"; 
  const secondaryBlue = "#ced4ff"; 

  const resources = [
    { title: "Ficha Social Online", desc: "Digitalize todo o histórico do assistido. Tenha em mãos dados de saúde, moradia e necessidades básicas com um clique, garantindo agilidade no atendimento social através de um prontuário completo e seguro." },
    { title: "Agenda interativa", desc: "Organize oficinas, consultas e atendimentos por setor. O sistema evita conflitos de horários e permite que toda a equipe visualize a disponibilidade em tempo real em uma interface intuitiva." },
    { title: "Organize suas parcerias", desc: "Centralize o contato com hospitais, clínicas e doadores corporativos. Gerencie convênios e acompanhe a execução de parcerias com total transparência e relatórios detalhados." },
    { title: "Reabilitação e prevenção", desc: "Módulo especializado para acompanhamento clínico. Registre evoluções, terapias e planos de reabilitação, garantindo que o assistido receba o cuidado multidisciplinar necessário." },
    { title: "Lembrete de Whatsapp", desc: "Reduza faltas em até 40% com o envio automático de lembretes. O sistema notifica o assistido sobre consultas e retiradas de benefícios diretamente no celular de forma automática." },
    { title: "Doações", desc: "Controle absoluto sobre o que entra e sai. Gerencie o bazar e a despensa, gere recibos de doação e mantenha a prestação de contas sempre atualizada para seus doadores." },
  ];

  const testimonials = [
    { name: "Adriana Soares", role: "Gestora Social - CAPEC", text: "O SAO mudou a forma como atendemos nossas famílias. A papelada deu lugar a um sistema rápido que nos permite focar no que importa: as pessoas.", avatar: "https://i.pravatar.cc/150?u=adriana" },
    { name: "Marcos Braz", role: "Presidente - Amigos do Bem", text: "A gestão do estoque era nosso maior gargalo. Hoje temos precisão absoluta de cada quilo de alimento doado e conseguimos prestar contas em segundos.", avatar: "https://i.pravatar.cc/150?u=marcos" },
    { name: "Carla Silva", role: "Coord. Administrativa", text: "A facilidade de gerar relatórios para nossos doadores aumentou nossa transparência e, consequentemente, o engajamento de novos parceiros.", avatar: "https://i.pravatar.cc/150?u=carla" },
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Funcionalidades', href: '#funcionalidades' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Contato', href: '#contato' },
  ];

  // Função para aplicar máscara de telefone (XX) 0 0000-0000
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = `(${value.slice(0, 2)}`;
      if (value.length > 2) {
        formattedValue += `) ${value.slice(2, 3)}`;
        if (value.length > 3) {
          formattedValue += ` ${value.slice(3, 7)}`;
          if (value.length > 7) {
            formattedValue += `-${value.slice(7, 11)}`;
          }
        }
      }
    }
    setPhoneValue(formattedValue);
  };

  return (
    <div className="min-h-screen bg-white font-['Inter'] selection:bg-[#ced4ff] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#3b32cc] z-[100] px-6 md:px-12 py-4 flex items-center justify-between shadow-lg">
        <div className="hover:scale-105 transition-transform cursor-pointer">
          <img 
            src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg" 
            alt="SAO Logo" 
            className="h-10 w-auto brightness-0 invert" 
          />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-white text-sm font-bold hover:text-[#ced4ff] transition-colors">{link.label}</a>
          ))}
          <button 
            onClick={onLoginClick}
            className="px-10 py-2.5 bg-white text-[#3b32cc] rounded-lg font-black text-sm hover:scale-105 hover:bg-[#ced4ff] transition-all shadow-md active:scale-95"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      <div className={`fixed inset-0 z-[90] bg-[#3b32cc] lg:hidden transition-all duration-500 flex flex-col items-center justify-center p-8 space-y-10 ${
        isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="flex flex-col items-center space-y-8 w-full">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-3xl font-black hover:text-[#ced4ff] transition-colors tracking-tight"
            >
              {link.label}
            </a>
          ))}
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onLoginClick(); }}
            className="w-full max-w-xs py-5 bg-white text-[#3b32cc] rounded-2xl font-black text-xl shadow-2xl active:scale-95 transition-transform"
          >
            Fazer Login
          </button>
        </div>
        
        <div className="absolute bottom-12 text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
          © Plataforma SAO 2026
        </div>
      </div>

      {/* Hero Section */}
      <SectionWrapper className="pt-48 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight text-center lg:text-left">
            Acabe com a papelada e transforme sua ONG em uma operação eficiente.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed text-center lg:text-left">
            Gerencie os seus atendimentos e atividades sociais de forma organizada, online e sem complicações.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => setIsCtaModalOpen(true)}
              className="px-10 py-4 bg-[#3b32cc] text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#3b32cc]/20 hover:bg-indigo-800 transition-all active:scale-95"
            >
              Testar por 14 dias grátis
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-[#ced4ff]/30 rounded-[40px] blur-3xl" />
          <div className="aspect-[4/3] bg-[#ced4ff]/20 rounded-[40px] flex items-center justify-center overflow-hidden border border-[#ced4ff] shadow-2xl relative z-10">
             <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000" alt="Equipe" className="w-full h-full object-cover grayscale opacity-60" />
          </div>
        </div>
      </SectionWrapper>

      {/* Seção Simples e Intuitiva */}
      <SectionWrapper id="funcionalidades" className="py-24 bg-slate-50/30 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-[0.3em]">Veja como é fácil fazer a Gestão da sua Ong</p>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Uma solução simples e intuitiva para sua equipe</h2>
          <div className="mt-12 aspect-video bg-[#ced4ff]/10 rounded-[40px] border border-[#ced4ff]/40 shadow-inner flex items-center justify-center relative overflow-hidden">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer relative z-10 hover:scale-110 transition-transform">
                <Play size={32} className="text-[#3b32cc] fill-[#3b32cc] ml-1" />
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Seção Parceiro Ideal (RÉPLICA DA IMAGEM) */}
      <SectionWrapper className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-[0.3em]">Gerenciamento Inteligente</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#000040] tracking-tight">O SAO é seu parceiro de gestão ideal</h2>
            <p className="text-slate-400 max-w-4xl mx-auto font-medium leading-relaxed">
              O sistema vai além da gestão tradicional, oferecendo uma solução completa e inovadora que impacta diretamente na produtividade dos colaboradores da organização.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            {/* Coluna Esquerda */}
            <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                  <Users size={48} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">Até 20%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2 leading-relaxed">Estabilidade e engajamento dos colaboradores.</p>
               </div>
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                  <PieChart size={48} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">Até 90%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2 leading-relaxed">Redução no índice de ausências.</p>
               </div>
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                  <DollarSign size={48} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">Até 70%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2 leading-relaxed">Economia na gestão e controle dos processos internos.</p>
               </div>
            </div>

            {/* Tablet Central */}
            <div className="lg:col-span-6 px-4 order-1 lg:order-2">
               <div className="w-full aspect-[3/4] bg-slate-900 rounded-[50px] p-4 border-[10px] border-slate-800 shadow-2xl overflow-hidden max-w-sm mx-auto flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-[35px] overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Interface Tablet" />
                  </div>
               </div>
            </div>

            {/* Coluna Direita */}
            <div className="lg:col-span-3 space-y-6 order-3">
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                  <LineChart size={48} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">Até 80%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2 leading-relaxed">Amplie o acompanhamento dos assistidos.</p>
               </div>
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                  <Landmark size={48} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">20-30%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2 leading-relaxed">Amplie a captação de doações.</p>
               </div>
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                  <BriefcaseMedical size={48} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">Até 50%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2 leading-relaxed">Amplie o gerenciamento social e clínico.</p>
               </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Grade de Necessidades com Modais */}
      <SectionWrapper className="py-32 px-6 md:px-12 bg-slate-50/20">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-[0.3em]">Gerenciamento Inteligente</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight text-center">Necessidades da sua ONG</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium text-center">Soluções pensadas para humanizar o atendimento e otimizar processos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => setResourceModal(item)}
                className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:border-[#ced4ff] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-left"
              >
                 <div className="aspect-[16/10] bg-[#ced4ff]/10 flex items-center justify-center p-8 overflow-hidden">
                    <div className="w-full h-full bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                       <LayoutGrid size={48} className="text-[#ced4ff] group-hover:text-[#3b32cc] transition-colors" />
                    </div>
                 </div>
                 <div className="p-10 space-y-4">
                    <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-[#3b32cc] transition-colors">{item.title}</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2">{item.desc}</p>
                    <span className="text-[10px] font-black text-[#3b32cc] uppercase tracking-widest inline-flex items-center gap-1">Saiba mais <ChevronRight size={12} /></span>
                 </div>
              </button>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Banner de Status Azul */}
      <SectionWrapper className="bg-[#3b32cc] py-24 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 items-center text-center">
            {[
              { icon: <Heart size={40} />, label: "Acompanhamento no tratamento" },
              { icon: <Activity size={40} />, label: "Controle total dos atendimentos" },
              { icon: <Stethoscope size={40} />, label: "Possibilite o atendimento interno" },
              { icon: <ShieldCheck size={40} />, label: "Controle hospitalares" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 flex flex-col items-center group">
                 <div className="text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all cursor-default">
                   {item.icon}
                 </div>
                 <p className="text-white text-xs font-black uppercase tracking-widest leading-relaxed max-w-[160px] mx-auto">{item.label}</p>
              </div>
            ))}
         </div>
      </SectionWrapper>

      {/* Seção Depoimentos */}
      <SectionWrapper id="depoimentos" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="text-center space-y-6">
            <p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-[0.3em]">Nossos Parceiros</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight text-center">O que dizem sobre o SAO</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#F8FAFC] p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-between relative group hover:bg-white hover:shadow-xl transition-all">
                <Quote size={60} className="absolute top-6 right-6 text-[#ced4ff]/40 group-hover:text-[#3b32cc]/20 transition-colors" />
                <p className="text-slate-600 font-medium leading-relaxed italic relative z-10 text-lg">"{t.text}"</p>
                <div className="mt-10 flex items-center gap-4 pt-8 border-t border-slate-200/50">
                  <img src={t.avatar} className="w-14 h-14 rounded-2xl shadow-md border-2 border-white" alt="" />
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{t.name}</h4>
                    <p className="text-[10px] font-bold text-[#3b32cc] uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Seção Contato */}
      <SectionWrapper id="contato" className="py-32 px-6 md:px-12 lg:px-24 bg-slate-50/30">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-12">
               <div className="space-y-6 text-center lg:text-left">
                 <h2 className="text-5xl font-black text-[#3b32cc] tracking-tight">Vamos construir <br className="hidden lg:block"/>o futuro juntos?</h2>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md mx-auto lg:mx-0">Nossa equipe comercial está pronta para oferecer uma demonstração personalizada para sua ONG.</p>
               </div>

               <div className="space-y-6">
                 <div className="flex flex-col lg:flex-row items-center gap-6 p-8 bg-white rounded-[32px] shadow-sm border border-slate-100 hover:border-[#ced4ff] transition-all text-center lg:text-left">
                    <div className="w-14 h-14 bg-[#ced4ff]/20 rounded-2xl flex items-center justify-center text-[#3b32cc] shadow-inner"><Mail size={24} /></div>
                    <div><p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-widest">E-mail</p><p className="text-lg font-bold text-slate-800">comercial@sao.app</p></div>
                 </div>
                 <div className="flex flex-col lg:flex-row items-center gap-6 p-8 bg-white rounded-[32px] shadow-sm border border-slate-100 hover:border-[#ced4ff] transition-all text-center lg:text-left">
                    <div className="w-14 h-14 bg-[#ced4ff]/20 rounded-2xl flex items-center justify-center text-[#3b32cc] shadow-inner"><Phone size={24} /></div>
                    <div><p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-widest">Telefone</p><p className="text-lg font-bold text-slate-800">(31) 3459-3030</p></div>
                 </div>
               </div>
            </div>

            <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-slate-100">
               <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input type="text" placeholder="Seu nome" className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                    <input type="email" placeholder="seuemail@ong.org" className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mensagem</label>
                    <textarea rows={5} placeholder="Como podemos ajudar sua instituição?" className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium resize-none" />
                  </div>
                  <button className="md:col-span-2 w-full h-16 bg-[#3b32cc] text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#3b32cc]/30 hover:bg-indigo-800 transition-all active:scale-95">
                    Enviar Mensagem <Send size={20} />
                  </button>
               </form>
            </div>
         </div>
      </SectionWrapper>

      {/* Footer (ATUALIZADO PARA CENTRALIZAR CONFORME IMAGEM) */}
      <footer className="py-20 border-t border-slate-100 bg-[#F8FAFC] px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-12">
          {/* Logo e Copyright */}
          <div className="space-y-6 flex flex-col items-center">
            <img 
              src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg" 
              alt="Logo" 
              className="h-10 w-auto grayscale opacity-40 hover:opacity-100 transition-all cursor-pointer mx-auto"
            />
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
              © Plataforma SAO 2026<br />Humanizando a gestão social
            </p>
          </div>
          
          {/* Suporte */}
          <div className="space-y-3 flex flex-col items-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Suporte</p>
             <a href="mailto:ajuda@sao.app" className="text-xl font-black text-[#3b32cc] hover:underline transition-all tracking-tight">ajuda@sao.app</a>
          </div>

          {/* Social e Créditos */}
          <div className="flex flex-col items-center gap-6">
             <div className="flex gap-4">
                {[Globe, MessageCircle, Star].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:bg-[#3b32cc] hover:text-white hover:border-[#3b32cc] transition-all shadow-sm">
                    <Icon size={20} />
                  </button>
                ))}
             </div>
             <div className="text-slate-300 text-[10px] font-black uppercase tracking-[0.25em]">
               By Atualz Soluções
             </div>
          </div>
        </div>
      </footer>

      {/* MODAL: CTA Lead */}
      {isCtaModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#3b32cc]/60 backdrop-blur-md" onClick={() => setIsCtaModalOpen(false)} />
           <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-[#3b32cc] p-10 text-white text-center">
                 <h3 className="text-3xl font-black tracking-tight text-center">Inicie agora mesmo</h3>
                 <p className="text-indigo-100 text-sm mt-2 opacity-80 font-medium text-center">Preencha seus dados para testar grátis.</p>
              </div>
              <div className="p-10 space-y-6">
                 <div className="space-y-4">
                    <input type="text" placeholder="Nome da ONG" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" />
                    <input type="email" placeholder="E-mail profissional" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" />
                    <input 
                      type="tel" 
                      placeholder="WhatsApp" 
                      value={phoneValue}
                      onChange={handlePhoneChange}
                      className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" 
                    />
                 </div>
                 <button className="w-full h-16 bg-[#3b32cc] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#3b32cc]/30 hover:bg-indigo-800 transition-all active:scale-95">
                    Garantir Acesso Grátis
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: Recurso */}
      {resourceModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#3b32cc]/40 backdrop-blur-sm" onClick={() => setResourceModal(null)} />
           <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#ced4ff]/30 text-[#3b32cc] rounded-2xl"><LayoutGrid size={24} /></div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{resourceModal.title}</h3>
                 </div>
                 <button onClick={() => setResourceModal(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-all"><X size={24} /></button>
              </div>
              <div className="p-10">
                 <p className="text-slate-500 text-lg font-medium leading-relaxed">{resourceModal.desc}</p>
                 <div className="mt-12 p-8 bg-[#ced4ff]/10 rounded-[32px] border border-[#ced4ff]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                       <ShieldCheck size={40} className="text-[#3b32cc]" />
                       <div>
                          <p className="font-bold text-slate-800">Recurso Nativo SAO</p>
                          <p className="text-xs text-slate-400 font-medium">Controle total e centralizado.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => { setResourceModal(null); setIsCtaModalOpen(true); }}
                      className="w-full sm:w-auto px-10 py-4 bg-[#3b32cc] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#3b32cc]/20 hover:bg-indigo-800 transition-all"
                    >
                       Acessar Plataforma
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
