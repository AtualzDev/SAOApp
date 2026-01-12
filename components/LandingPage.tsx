
import React, { useState } from 'react';
import { 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Smartphone, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  // Changed MessageSquare to MessageCircle to fix "Cannot find name 'MessageCircle'" error on line 394
  MessageCircle,
  Package,
  Heart,
  Calendar,
  ClipboardCheck,
  Stethoscope,
  Activity,
  UserPlus,
  Plus,
  Minus,
  Wallet,
  LayoutGrid,
  ChevronDown,
  Globe,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-['Inter'] selection:bg-blue-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0000FF] z-[100] px-6 md:px-12 py-4 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="hover:scale-105 transition-transform cursor-pointer">
          <img 
            src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg" 
            alt="SAO Logo" 
            className="h-10 w-auto brightness-0 invert" 
          />
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <a href="#" className="text-white text-sm font-bold hover:text-blue-200 transition-colors">Home</a>
          <a href="#funcionalidades" className="text-white text-sm font-bold hover:text-blue-200 transition-colors">Funcionalidades</a>
          <a href="#depoimentos" className="text-white text-sm font-bold hover:text-blue-200 transition-colors">Depoimentos</a>
          <a href="#contato" className="text-white text-sm font-bold hover:text-blue-200 transition-colors">Contato</a>
          <button 
            onClick={onLoginClick}
            className="px-10 py-2.5 bg-white text-[#0000FF] rounded-lg font-black text-sm hover:scale-105 hover:bg-blue-50 transition-all shadow-md active:scale-95"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000 ease-out">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
            Acabe com a papelada e transforme sua ONG em uma operação muito mais eficiente.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed animate-in fade-in slide-in-from-left-4 duration-1000 delay-200">
            Gerencie os seus atendimentos e atividades sociais de forma organizada, online e sem complicações.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <button className="px-10 py-4 bg-[#0000FF] text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-800 hover:-translate-y-1 transition-all active:scale-95">
              Testar por 14 dias grátis
            </button>
          </div>
        </div>
        <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <div className="absolute -inset-4 bg-blue-500/5 rounded-[40px] blur-3xl animate-pulse" />
          <div className="aspect-[4/3] bg-blue-50 rounded-[40px] flex items-center justify-center overflow-hidden border border-blue-100 shadow-2xl relative z-10">
             <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000" alt="Equipe" className="w-full h-full object-cover grayscale opacity-60 hover:scale-110 hover:grayscale-0 transition-all duration-700" />
          </div>
        </div>
      </section>

      {/* Seção Simples e Intuitiva */}
      <section id="funcionalidades" className="py-24 bg-slate-50/30 text-center px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Veja como é fácil fazer a Gestão da sua Ong</p>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Uma solução simples e intuitiva para sua equipe</h2>
          <div className="mt-12 aspect-video bg-blue-50 rounded-[40px] border border-blue-100 shadow-inner flex items-center justify-center relative group overflow-hidden">
             <div className="absolute inset-0 bg-[#0000FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform relative z-10 animate-bounce duration-[3000ms]">
                <Play size={32} className="text-[#0000FF] fill-[#0000FF] ml-1" />
             </div>
             {/* Fake pulse effect around play button */}
             <div className="absolute w-20 h-20 bg-white/50 rounded-full animate-ping pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Seção Solução Ideal */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000">
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
              <div key={i} className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group">
                 <div className={`p-4 bg-${item.color}-50 text-${item.color}-600 rounded-2xl group-hover:scale-110 transition-transform`}>
                   {item.icon}
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">{item.title}</h4>
                    <p className="text-sm text-slate-400 font-medium mt-1">{item.desc}</p>
                 </div>
              </div>
            ))}
          </div>
          <button className="px-10 py-3 border-2 border-[#0000FF] text-[#0000FF] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0000FF] hover:text-white transition-all active:scale-95">
            Saiba mais
          </button>
        </div>
        <div className="relative animate-in fade-in slide-in-from-right-10 duration-1000">
           <div className="absolute inset-0 bg-[#0000FF] rounded-[40px] translate-x-4 -translate-y-4 -z-10 animate-pulse duration-[4000ms]" />
           <div className="aspect-[4/5] bg-blue-50 rounded-[40px] border border-blue-100 shadow-2xl overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000" alt="Suporte" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
           </div>
        </div>
      </section>

      {/* Seção Funcionalidades (Estoque e Bazar) */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative animate-in fade-in slide-in-from-left-10 duration-1000">
           <div className="absolute inset-0 bg-[#0000FF] rounded-[40px] -translate-x-4 -translate-y-4 -z-10 animate-pulse duration-[5000ms]" />
           <div className="aspect-square bg-blue-50 rounded-[40px] border border-blue-100 shadow-2xl overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000" alt="Estoque" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
           </div>
        </div>
        <div className="order-1 lg:order-2 space-y-10 animate-in fade-in slide-in-from-right-10 duration-1000">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">Gestão de Estoque e Bazar</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Crie categorias, organize seus benefícios de forma eficiente e tenha controle total sobre seu bazar.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
               <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <Package size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">Categorize</h4>
                  <p className="text-sm text-slate-400 font-medium mt-1">Organize por perecibilidade, tipo e unidade de medida.</p>
               </div>
            </div>
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
               <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                 <Activity size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">Controle de estoque</h4>
                  <p className="text-sm text-slate-400 font-medium mt-1">Aumente a arrecadação com um controle rigoroso de itens.</p>
               </div>
            </div>
          </div>
          <button className="px-10 py-3 border-2 border-[#0000FF] text-[#0000FF] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0000FF] hover:text-white transition-all">
            Saiba mais
          </button>
        </div>
      </section>

      {/* Seção Parceiro Ideal (Mockup com KPIs Dinâmicos) */}
      <section className="py-40 bg-slate-50/50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="max-w-7xl mx-auto px-6 text-center space-y-16 relative z-10">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Gerenciamento Inteligente</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">O SAO é seu parceiro de gestão ideal</h2>
            <p className="text-slate-400 max-w-3xl mx-auto font-medium">
              Impactamos diretamente na produtividade dos colaboradores da organização.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto py-10">
            {/* Tablet Mockup with Floating Animation */}
            <div className="relative z-10 w-full max-w-2xl mx-auto aspect-[3/4] bg-slate-900 rounded-[60px] p-6 border-[12px] border-slate-800 shadow-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-1000">
               <div className="w-full h-full bg-white rounded-[40px] flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="" />
               </div>
            </div>

            {/* KPI Cards Flutuantes com durações de flutuação variadas */}
            <div className="absolute top-10 left-0 lg:-left-20 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left animate-bounce duration-[4000ms] hover:scale-110 transition-transform">
               <Users size={24} className="text-blue-600 mb-3" />
               <p className="text-xl font-black text-slate-800">Até 20%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Estabilidade e engajamento.</p>
            </div>

            <div className="absolute top-1/2 left-0 lg:-left-28 -translate-y-1/2 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left animate-bounce duration-[5000ms] delay-500 hover:scale-110 transition-transform">
               <Activity size={24} className="text-indigo-600 mb-3" />
               <p className="text-xl font-black text-slate-800">Até 90%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Redução de ausências.</p>
            </div>

            <div className="absolute bottom-10 left-0 lg:-left-20 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left animate-bounce duration-[4500ms] delay-1000 hover:scale-110 transition-transform">
               <Wallet size={24} className="text-blue-600 mb-3" />
               <p className="text-xl font-black text-slate-800">Até 70%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Economia operacional.</p>
            </div>

            <div className="absolute top-10 right-0 lg:-right-20 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left animate-bounce duration-[4200ms] delay-300 hover:scale-110 transition-transform">
               <TrendingUp size={24} className="text-[#0000FF] mb-3" />
               <p className="text-xl font-black text-slate-800">Até 80%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Acompanhamento assistidos.</p>
            </div>

            <div className="absolute top-1/2 right-0 lg:-right-28 -translate-y-1/2 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left animate-bounce duration-[5500ms] delay-700 hover:scale-110 transition-transform">
               <LayoutGrid size={24} className="text-blue-800 mb-3" />
               <p className="text-xl font-black text-slate-800">20-30%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Captação de doações.</p>
            </div>

            <div className="absolute bottom-10 right-0 lg:-right-20 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left animate-bounce duration-[4800ms] delay-150 hover:scale-110 transition-transform">
               <Stethoscope size={24} className="text-blue-500 mb-3" />
               <p className="text-xl font-black text-slate-800">Até 50%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Gestão clínica ampliada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade de Necessidades com Staggered Entry */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Gerenciamento Inteligente</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">Tudo pensando para atender às necessidades da sua ONG</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">Gerenciar uma ONG é como cuidar de várias famílias ao mesmo tempo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Ficha Social Online", desc: "Disponibilize à sua equipe social uma ficha completa com todos os dados necessários.", delay: "delay-[100ms]" },
              { title: "Agenda interativa", desc: "Tenha o controle de oficinas e atendimentos em diversos setores com uma agenda online.", delay: "delay-[200ms]" },
              { title: "Organize suas parcerias", desc: "Gerencie hospitais, clínicas e outros locais de atendimento com eficiência.", delay: "delay-[300ms]" },
              { title: "Reabilitação e prevenção", desc: "Nosso sistema possibilita aos assistidos uma maior eficiência em seus tratamentos.", delay: "delay-[400ms]" },
              { title: "Lembrete de Whatsapp", desc: "Envie lembretes automáticos no WhatsApp para seus assistidos e aumente a adesão.", delay: "delay-[500ms]" },
              { title: "Doações", desc: "Gerencie as doações de forma eficaz, facilite a captação e o gerenciamento.", delay: "delay-[600ms]" },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-10 ${item.delay}`}
              >
                 <div className="aspect-[16/10] bg-blue-50 flex items-center justify-center p-8 overflow-hidden">
                    <div className="w-full h-full bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:rotate-3 transition-transform duration-500">
                       <LayoutGrid size={48} className="text-blue-100 group-hover:text-blue-500 transition-colors" />
                    </div>
                 </div>
                 <div className="p-10 space-y-4">
                    <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-[#0000FF] transition-colors">{item.title}</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner de Status Azul com entrada sequencial */}
      <section className="bg-[#0000FF] py-20 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 items-center text-center">
            {[
              { icon: <Heart size={32} />, label: "Acompanhamento no tratamento", delay: "delay-[100ms]" },
              { icon: <Activity size={32} />, label: "Controle total dos atendimentos", delay: "delay-[200ms]" },
              { icon: <Stethoscope size={32} />, label: "Possibilite o atendimento interno", delay: "delay-[300ms]" },
              { icon: <ShieldCheck size={32} />, label: "Controle hospitalares", delay: "delay-[400ms]" },
            ].map((item, idx) => (
              <div key={idx} className={`space-y-4 flex flex-col items-center animate-in fade-in zoom-in duration-700 ${item.delay}`}>
                 <div className="text-white opacity-80 hover:scale-125 hover:opacity-100 transition-all cursor-default">
                   {item.icon}
                 </div>
                 <p className="text-white text-xs font-black uppercase tracking-widest leading-relaxed max-w-[160px]">{item.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* CTA Final Palma da Mão */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-slate-50/20">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
               <h2 className="text-5xl font-black text-[#000040] tracking-tight">Sua Ong na palma da sua mão</h2>
               <p className="text-[#0000FF] text-xl font-bold">Essa é a sua oportunidade de não ficar para atrás, afinal o futuro já chegou!</p>
               <button className="px-14 py-4 border-2 border-[#0000FF] text-[#0000FF] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#0000FF] hover:text-white hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95">
                 Criar conta
               </button>
               <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i}`} alt="" /></div>)}
                  </div>
                  <p className="text-slate-400 text-xs font-bold">+1.200 Instituições cadastradas</p>
               </div>
            </div>
            <div className="relative group">
               <div className="absolute -inset-10 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000" />
               <div className="bg-white p-8 rounded-[60px] shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right-10 duration-1000">
                  <div className="aspect-video bg-slate-100 rounded-[40px] shadow-inner flex items-center justify-center overflow-hidden border-8 border-slate-200 relative">
                     <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Laptop" />
                     <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4 animate-in fade-in duration-1000">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Dúvidas frequentes sobre o SAO</h2>
            <div className="w-20 h-1.5 bg-[#0000FF] rounded-full mx-auto" />
          </div>
          
          <div className="space-y-4">
            {[
              { q: "O que é o SAO?", a: "O SAO – Sistema de Apoio às ONG, é uma ferramenta totalmente on-line que atende às rotinas do terceiro setor. Auxiliando o setor social no lançamento, acompanhamento e gerenciamento dos assistidos e benefícios por ela ofertados." },
              { q: "Minha ONG é pequena, preciso ter acesso ao SAO?", a: "Sim! O SAO é escalável e se adapta a qualquer volume de atendimento, ajudando a organizar o crescimento da instituição desde o primeiro dia." },
              { q: "Como contratar o SAO?", a: "Basta clicar em um dos botões de 'Testar agora' ou entrar em contato com nosso time comercial via WhatsApp para uma demonstração personalizada." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-blue-200 hover:shadow-lg">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-8 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-black text-[#0000FF] group-hover:translate-x-2 transition-transform duration-300">{faq.q}</span>
                  <div className={`p-2 rounded-full transition-all duration-300 ${activeFaq === idx ? 'bg-[#0000FF] text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                {activeFaq === idx && (
                  <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <p className="text-slate-500 font-medium leading-relaxed border-l-4 border-blue-100 pl-6 py-2">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer com Micro-interações */}
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
               <a href="mailto:comercial@sao.app" className="text-sm font-black text-[#0000FF] hover:underline decoration-2 underline-offset-4 transition-all">comercial@sao.app</a>
            </div>
            <div className="space-y-2 text-center md:text-left">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefone</p>
               <a href="tel:3134593030" className="text-sm font-black text-[#0000FF] hover:underline decoration-2 underline-offset-4 transition-all">(31) 3459-3030</a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
             <div className="flex gap-4">
                {[Globe, MessageCircle, Star].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#0000FF] hover:text-white hover:border-[#0000FF] transition-all shadow-sm">
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
    </div>
  );
};

export default LandingPage;
