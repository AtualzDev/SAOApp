
import React, { useState } from 'react';
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
  Mail,
  Phone,
  MapPin,
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

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isCtaModalOpen, setIsCtaModalOpen] = useState(false);
  const [resourceModal, setResourceModal] = useState<ModalContent | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const primaryBlue = "#3b32cc"; 
  const secondaryBlue = "#ced4ff"; 

  const resources = [
    { title: "Ficha Social Online", desc: "Digitalize todo o histórico do assistido. Tenha em mãos dados de saúde, moradia e necessidades básicas com um clique, garantindo agilidade no atendimento social." },
    { title: "Agenda interativa", desc: "Organize oficinas, consultas e atendimentos por setor. O sistema evita conflitos de horários e permite que toda a equipe visualize a disponibilidade em tempo real." },
    { title: "Organize suas parcerias", desc: "Centralize o contato com hospitais, clínicas e doadores corporativos. Gerencie convênios e acompanhe a execução de parcerias com total transparência." },
    { title: "Reabilitação e prevenção", desc: "Módulo especializado para acompanhamento clínico. Registre evoluções, terapias e planos de reabilitação, garantindo que o assistido receba o cuidado necessário." },
    { title: "Lembrete de Whatsapp", desc: "Reduza faltas em até 40% com o envio automático de lembretes. O sistema notifica o assistido sobre consultas e retiradas de benefícios diretamente no celular." },
    { title: "Doações", desc: "Controle absoluto sobre o que entra e sai. Gerencie o bazar e a despensa, gere recibos de doação e mantenha a prestação de contas sempre atualizada." },
  ];

  const testimonials = [
    { name: "Adriana Soares", role: "Gestora Social - CAPEC", text: "O SAO mudou a forma como atendemos nossas famílias. A papelada deu lugar a um sistema rápido que nos permite focar no que importa: as pessoas.", avatar: "https://i.pravatar.cc/150?u=adriana" },
    { name: "Marcos Braz", role: "Presidente - Amigos do Bem", text: "A gestão do estoque era nosso maior gargalo. Hoje temos precisão absoluta de cada quilo de alimento doado.", avatar: "https://i.pravatar.cc/150?u=marcos" },
    { name: "Carla Silva", role: "Coord. Administrativa", text: "A facilidade de gerar relatórios para nossos doadores aumentou nossa transparência e, consequentemente, nossas doações.", avatar: "https://i.pravatar.cc/150?u=carla" },
  ];

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
        
        <div className="hidden lg:flex items-center gap-10">
          <a href="#" className="text-white text-sm font-bold hover:text-[#ced4ff] transition-colors">Home</a>
          <a href="#funcionalidades" className="text-white text-sm font-bold hover:text-[#ced4ff] transition-colors">Funcionalidades</a>
          <a href="#depoimentos" className="text-white text-sm font-bold hover:text-[#ced4ff] transition-colors">Depoimentos</a>
          <a href="#contato" className="text-white text-sm font-bold hover:text-[#ced4ff] transition-colors">Contato</a>
          <button 
            onClick={onLoginClick}
            className="px-10 py-2.5 bg-white text-[#3b32cc] rounded-lg font-black text-sm hover:scale-105 hover:bg-[#ced4ff] transition-all shadow-md active:scale-95"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
            Acabe com a papelada e transforme sua ONG em uma operação muito mais eficiente.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
            Gerencie os seus atendimentos e atividades sociais de forma organizada, online e sem complicações.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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
      </section>

      {/* Seção Simples e Intuitiva */}
      <section id="funcionalidades" className="py-24 bg-slate-50/30 text-center px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-[0.3em]">Veja como é fácil fazer a Gestão da sua Ong</p>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Uma solução simples e intuitiva para sua equipe</h2>
          <div className="mt-12 aspect-video bg-[#ced4ff]/10 rounded-[40px] border border-[#ced4ff]/40 shadow-inner flex items-center justify-center relative group overflow-hidden">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer relative z-10">
                <Play size={32} className="text-[#3b32cc] fill-[#3b32cc] ml-1" />
             </div>
          </div>
        </div>
      </section>

      {/* Seção Parceiro Ideal (ATUALIZADA IGUAL À IMAGEM) */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16 relative z-10">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-[0.3em]">Gerenciamento Inteligente</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#000040] tracking-tight">O SAO é seu parceiro de gestão ideal</h2>
            <p className="text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
              O sistema vai além da gestão tradicional, oferecendo uma solução completa e inovadora que impacta diretamente na produtividade dos colaboradores da organização.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Coluna Esquerda */}
            <div className="lg:col-span-3 space-y-6">
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center">
                  <Users size={32} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">Até 20%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2">Estabilidade e engajamento dos colaboradores.</p>
               </div>
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center">
                  <PieChart size={32} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">Até 90%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2">Redução no índice de ausências.</p>
               </div>
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center">
                  <DollarSign size={32} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">Até 70%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2">Economia na gestão e controle dos processos internos.</p>
               </div>
            </div>

            {/* Tablet Central */}
            <div className="lg:col-span-6 px-4">
               <div className="w-full aspect-[3/4] bg-slate-900 rounded-[50px] p-4 border-[10px] border-slate-800 shadow-2xl overflow-hidden max-w-sm mx-auto">
                  <div className="w-full h-full bg-white rounded-[35px] overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="" />
                  </div>
               </div>
            </div>

            {/* Coluna Direita */}
            <div className="lg:col-span-3 space-y-6">
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center">
                  <LineChart size={32} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">Até 80%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2">Amplie o acompanhamento dos assistidos.</p>
               </div>
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center">
                  <Landmark size={32} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">20-30%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2">Amplie a captação de doações.</p>
               </div>
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center text-center">
                  <BriefcaseMedical size={32} className="text-[#3b32cc] mb-4" />
                  <p className="text-2xl font-black text-slate-800">Até 50%</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-2">Amplie o gerenciamento social e clínico.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Solução Ideal */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">É a solução ideal para minha Ong?</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              O SAO 2.0 foi remodelado, trazendo mais fluidez na experiência do usuário, o que torna sua utilização mais fácil e intuitiva para a equipe.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: <TrendingUp size={32} />, title: "Aumento da produtividade", desc: "Maior engajamento, performance e bem estar dos colaboradores.", color: "indigo" },
              { icon: <Heart size={32} />, title: "Atendimentos clínicos", desc: "Promoção de um ambiente de trabalho saudável para todos.", color: "blue" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-[#ced4ff] transition-all duration-300">
                 <div className="p-4 bg-[#ced4ff]/30 text-[#3b32cc] rounded-2xl">
                   {item.icon}
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">{item.title}</h4>
                    <p className="text-sm text-slate-400 font-medium mt-1">{item.desc}</p>
                 </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsCtaModalOpen(true)}
            className="px-10 py-3 border-2 border-[#3b32cc] text-[#3b32cc] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#3b32cc] hover:text-white transition-all active:scale-95"
          >
            Saiba mais
          </button>
        </div>
        <div className="relative">
           <div className="absolute inset-0 bg-[#3b32cc] rounded-[40px] translate-x-4 -translate-y-4 -z-10" />
           <div className="aspect-[4/5] bg-[#ced4ff]/10 rounded-[40px] border border-[#ced4ff] shadow-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000" alt="Suporte" className="w-full h-full object-cover grayscale" />
           </div>
        </div>
      </section>

      {/* Seção Funcionalidades (Estoque e Bazar) */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
           <div className="absolute inset-0 bg-[#3b32cc] rounded-[40px] -translate-x-4 -translate-y-4 -z-10" />
           <div className="aspect-square bg-[#ced4ff]/10 rounded-[40px] border border-[#ced4ff] shadow-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000" alt="Estoque" className="w-full h-full object-cover" />
           </div>
        </div>
        <div className="order-1 lg:order-2 space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">Gestão de Estoque e Bazar</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Crie categorias, organize seus benefícios de forma eficiente e tenha controle total sobre seu bazar.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
               <div className="p-4 bg-[#ced4ff]/30 text-[#3b32cc] rounded-2xl group-hover:bg-[#3b32cc] group-hover:text-white transition-all">
                 <Package size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">Categorize</h4>
                  <p className="text-sm text-slate-400 font-medium mt-1">Organize por perecibilidade, tipo e unidade de medida.</p>
               </div>
            </div>
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
               <div className="p-4 bg-[#ced4ff]/30 text-[#3b32cc] rounded-2xl group-hover:bg-[#3b32cc] group-hover:text-white transition-all">
                 <Activity size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">Controle de estoque</h4>
                  <p className="text-sm text-slate-400 font-medium mt-1">Aumente a arrecadação com um controle rigoroso de itens.</p>
               </div>
            </div>
          </div>
          <button 
            onClick={() => setIsCtaModalOpen(true)}
            className="px-10 py-3 border-2 border-[#3b32cc] text-[#3b32cc] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#3b32cc] hover:text-white transition-all"
          >
            Saiba mais
          </button>
        </div>
      </section>

      {/* Grade de Necessidades com Modais */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-[0.3em]">Gerenciamento Inteligente</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">Tudo pensando para atender às necessidades da sua ONG</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">Gerenciar uma ONG é como cuidar de várias famílias ao mesmo tempo.</p>
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
                    <span className="text-[10px] font-black text-[#3b32cc] uppercase tracking-widest inline-flex items-center gap-1">Clique para ler mais <ChevronRight size={12} /></span>
                 </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Banner de Status Azul */}
      <section className="bg-[#3b32cc] py-20 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 items-center text-center">
            {[
              { icon: <Heart size={32} />, label: "Acompanhamento no tratamento" },
              { icon: <Activity size={32} />, label: "Controle total dos atendimentos" },
              { icon: <Stethoscope size={32} />, label: "Possibilite o atendimento interno" },
              { icon: <ShieldCheck size={32} />, label: "Controle hospitalares" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 flex flex-col items-center">
                 <div className="text-white opacity-80 hover:scale-125 transition-all cursor-default">
                   {item.icon}
                 </div>
                 <p className="text-white text-xs font-black uppercase tracking-widest leading-relaxed max-w-[160px]">{item.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Seção Depoimentos */}
      <section id="depoimentos" className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="text-center space-y-6">
            <p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-[0.3em]">Nossos Parceiros</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">O que dizem sobre o SAO</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-between relative group hover:shadow-xl transition-all">
                <Quote size={60} className="absolute top-6 right-6 text-[#ced4ff]/20 group-hover:text-[#ced4ff]/40 transition-colors" />
                <p className="text-slate-500 font-medium leading-relaxed italic relative z-10">"{t.text}"</p>
                <div className="mt-10 flex items-center gap-4 pt-8 border-t border-slate-50">
                  <img src={t.avatar} className="w-14 h-14 rounded-2xl shadow-md" alt="" />
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{t.name}</h4>
                    <p className="text-[10px] font-bold text-[#3b32cc] uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Contato */}
      <section id="contato" className="py-32 px-6 md:px-12 lg:px-24">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-12">
               <div className="space-y-6">
                 <h2 className="text-5xl font-black text-[#3b32cc] tracking-tight">Vamos construir <br/>o futuro juntos?</h2>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed">Nossa equipe comercial está pronta para entender as necessidades específicas da sua ONG.</p>
               </div>

               <div className="space-y-6">
                 <div className="flex items-center gap-6 p-6 bg-[#ced4ff]/10 rounded-[32px] border border-[#ced4ff]/30">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#3b32cc] shadow-sm"><Mail size={24} /></div>
                    <div><p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-widest">E-mail</p><p className="text-lg font-bold text-slate-800">comercial@sao.app</p></div>
                 </div>
                 <div className="flex items-center gap-6 p-6 bg-[#ced4ff]/10 rounded-[32px] border border-[#ced4ff]/30">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#3b32cc] shadow-sm"><Phone size={24} /></div>
                    <div><p className="text-[10px] font-black text-[#3b32cc] uppercase tracking-widest">Telefone</p><p className="text-lg font-bold text-slate-800">(31) 3459-3030</p></div>
                 </div>
               </div>
            </div>

            <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-slate-100">
               <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input type="text" placeholder="Seu nome" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                    <input type="email" placeholder="seuemail@ong.org" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assunto</label>
                    <input type="text" placeholder="Como podemos ajudar?" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mensagem</label>
                    <textarea rows={4} placeholder="Conte-nos um pouco sobre sua institution..." className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium resize-none" />
                  </div>
                  <button className="md:col-span-2 w-full h-16 bg-[#3b32cc] text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#3b32cc]/30 hover:bg-indigo-800 transition-all active:scale-95">
                    Enviar Mensagem <Send size={20} />
                  </button>
               </form>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-slate-50/50 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Dúvidas frequentes</h2>
            <div className="w-20 h-1.5 bg-[#3b32cc] rounded-full mx-auto" />
          </div>
          
          <div className="space-y-4">
            {[
              { q: "O que é o SAO?", a: "O SAO – Sistema de Apoio às ONG, é uma ferramenta totalmente on-line que atende às rotinas do terceiro setor. Auxiliando o setor social no lançamento, acompanhamento e gerenciamento dos assistidos e benefícios por ela ofertados." },
              { q: "Minha ONG é pequena, preciso ter acesso ao SAO?", a: "Sim! O SAO é escalável e se adapta a qualquer volume de atendimento, ajudando a organizar o crescimento da instituição desde o primeiro dia." },
              { q: "Como contratar o SAO?", a: "Basta clicar em um dos botões de 'Testar agora' ou entrar em contato com nosso time comercial via WhatsApp para uma demonstração personalizada." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-[#ced4ff]">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-8 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-black text-[#3b32cc] group-hover:translate-x-2 transition-transform duration-300">{faq.q}</span>
                  <div className={`p-2 rounded-full transition-all duration-300 ${activeFaq === idx ? 'bg-[#3b32cc] text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                {activeFaq === idx && (
                  <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <p className="text-slate-500 font-medium leading-relaxed border-l-4 border-[#ced4ff] pl-6 py-2">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-100 bg-[#F8FAFC] px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center md:text-left">
            <img 
              src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg" 
              alt="Logo" 
              className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
            />
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              © Plataforma SAO 2026<br />Todos os direitos reservados
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="space-y-2 text-center md:text-left">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail</p>
               <a href="mailto:comercial@sao.app" className="text-sm font-black text-[#3b32cc] hover:underline transition-all">comercial@sao.app</a>
            </div>
            <div className="space-y-2 text-center md:text-left">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefone</p>
               <a href="tel:3134593030" className="text-sm font-black text-[#3b32cc] hover:underline transition-all">(31) 3459-3030</a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
             <div className="flex gap-4">
                {[Globe, MessageCircle, Star].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#3b32cc] hover:text-white hover:border-[#3b32cc] transition-all shadow-sm">
                    <Icon size={18} />
                  </button>
                ))}
             </div>
             <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
               Criado por Atualz Soluções
             </div>
          </div>
        </div>
      </footer>

      {/* MODAL: CTA Captura de Lead */}
      {isCtaModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#3b32cc]/60 backdrop-blur-md" onClick={() => setIsCtaModalOpen(false)} />
           <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-[#3b32cc] p-10 text-white text-center">
                 <h3 className="text-3xl font-black tracking-tight">Comece seu teste grátis</h3>
                 <p className="text-indigo-100 text-sm mt-2 opacity-80 font-medium">14 dias com acesso total a todas as funcionalidades.</p>
              </div>
              <div className="p-10 space-y-6">
                 <div className="space-y-4">
                    <input type="text" placeholder="Nome da Instituição" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" />
                    <input type="email" placeholder="E-mail profissional" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" />
                    <input type="tel" placeholder="Telefone / WhatsApp" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#ced4ff]/30 transition-all font-medium" />
                 </div>
                 <button className="w-full h-16 bg-[#3b32cc] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#3b32cc]/30 hover:bg-indigo-800 transition-all active:scale-95">
                    Quero Testar Agora
                 </button>
                 <button onClick={() => setIsCtaModalOpen(false)} className="w-full py-2 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors uppercase tracking-widest">Agora não, obrigado</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: Detalhes de Recurso */}
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
                 <div className="mt-12 p-8 bg-[#ced4ff]/10 rounded-[32px] border border-[#ced4ff]/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <ShieldCheck size={32} className="text-[#3b32cc]" />
                       <div>
                          <p className="font-bold text-slate-800">Recurso Nativo</p>
                          <p className="text-xs text-slate-400 font-medium">Disponível em todos os planos Pro e Business.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => { setResourceModal(null); setIsCtaModalOpen(true); }}
                      className="px-8 py-3 bg-[#3b32cc] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#3b32cc]/20 hover:bg-indigo-800 transition-all"
                    >
                       Assinar Agora
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
