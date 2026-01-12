
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
  MessageSquare,
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
  ChevronDown
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
    <div className="min-h-screen bg-white font-['Inter'] selection:bg-blue-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0000FF] z-[100] px-6 md:px-12 py-4 flex items-center justify-between shadow-lg">
        <img 
          src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg" 
          alt="SAO Logo" 
          className="h-10 w-auto brightness-0 invert" 
        />
        
        <div className="hidden lg:flex items-center gap-10">
          <a href="#" className="text-white text-sm font-bold hover:opacity-80 transition-opacity">Home</a>
          <a href="#funcionalidades" className="text-white text-sm font-bold hover:opacity-80 transition-opacity">Funcionalidades</a>
          <a href="#depoimentos" className="text-white text-sm font-bold hover:opacity-80 transition-opacity">Depoimentos</a>
          <a href="#contato" className="text-white text-sm font-bold hover:opacity-80 transition-opacity">Contato</a>
          <button 
            onClick={onLoginClick}
            className="px-10 py-2.5 bg-white text-[#0000FF] rounded-lg font-black text-sm hover:bg-blue-50 transition-all shadow-md active:scale-95"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
            Acabe com a papelada e transforme sua ONG em uma operação muito mais eficiente.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
            Gerencie os seus atendimentos e atividades sociais de forma organizada, online e sem complicações.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-10 py-4 bg-[#0000FF] text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-95">
              Testar por 14 dias grátis
            </button>
          </div>
        </div>
        <div className="relative animate-in fade-in zoom-in-95 duration-1000">
          <div className="aspect-[4/3] bg-blue-50 rounded-[40px] flex items-center justify-center overflow-hidden border border-blue-100">
             <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000" alt="Equipe" className="w-full h-full object-cover grayscale opacity-60" />
          </div>
        </div>
      </section>

      {/* Seção Simples e Intuitiva */}
      <section id="funcionalidades" className="py-24 bg-slate-50/30 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Veja como é fácil fazer a Gestão da sua Ong</p>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Uma solução simples e intuitiva para sua equipe</h2>
          <div className="mt-12 aspect-video bg-blue-50 rounded-[40px] border border-blue-100 shadow-inner flex items-center justify-center">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                <Play size={32} className="text-[#0000FF] fill-[#0000FF] ml-1" />
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
              O SAO 2.0 foi remodelado, trazendo mais fluidez na experiência do usuário, o que torna sua utilização mais fácil e intuitiva para a equipe, mais organização nas principais demandas sociais, sem ter que lidar com papelada, e uma visão gerencial ampliada através de seus relatórios específicos.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
               <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                 <TrendingUp size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">Aumento da produtividade</h4>
                  <p className="text-sm text-slate-400 font-medium mt-1">Maior engajamento, performance e bem estar dos colaboradores.</p>
               </div>
            </div>
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
               <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                 <Heart size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">Atendimentos clínicos</h4>
                  <p className="text-sm text-slate-400 font-medium mt-1">Promoção de um ambiente de trabalho saudável beneficiando a saúde mental dos colaboradores.</p>
               </div>
            </div>
          </div>
          <button className="px-10 py-3 border-2 border-[#0000FF] text-[#0000FF] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">
            Saiba mais
          </button>
        </div>
        <div className="relative">
           <div className="absolute inset-0 bg-[#0000FF] rounded-[40px] translate-x-4 -translate-y-4 -z-10" />
           <div className="aspect-[4/5] bg-blue-50 rounded-[40px] border border-blue-100 shadow-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000" alt="Suporte" className="w-full h-full object-cover grayscale" />
           </div>
        </div>
      </section>

      {/* Seção Funcionalidades (Estoque e Bazar) */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
           <div className="absolute inset-0 bg-[#0000FF] rounded-[40px] -translate-x-4 -translate-y-4 -z-10" />
           <div className="aspect-square bg-blue-50 rounded-[40px] border border-blue-100 shadow-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000" alt="Estoque" className="w-full h-full object-cover" />
           </div>
        </div>
        <div className="order-1 lg:order-2 space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">Gestão de Estoque e Bazar</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Crie categorias, e organize seus benefícios de forma eficiente e tenha controle de estoque e vendas de seu bazar e aumente a arrecadação da instituição.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
               <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                 <Package size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">Categorize</h4>
                  <p className="text-sm text-slate-400 font-medium mt-1">Organize por perecibilidade, tipo e unidade de medida.</p>
               </div>
            </div>
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
               <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                 <Activity size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">Controle de estoque</h4>
                  <p className="text-sm text-slate-400 font-medium mt-1">Tenha controle de estoque e vendas de seu bazar e aumente a arrecadação da instituição.</p>
               </div>
            </div>
          </div>
          <button className="px-10 py-3 border-2 border-[#0000FF] text-[#0000FF] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">
            Saiba mais
          </button>
        </div>
      </section>

      {/* Seção Parceiro Ideal (Mockup com KPIs) */}
      <section className="py-40 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Gerenciamento Inteligente</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">O SAO é seu parceiro de gestão ideal</h2>
            <p className="text-slate-400 max-w-3xl mx-auto font-medium">
              O sistema vai além da gestão tradicional, oferecendo uma solução completa e inovadora que impacta diretamente na produtividade dos colaboradores da organização.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Tablet Mockup */}
            <div className="relative z-10 w-full max-w-2xl mx-auto aspect-[3/4] bg-slate-900 rounded-[60px] p-6 border-[12px] border-slate-800 shadow-2xl overflow-hidden">
               <div className="w-full h-full bg-white rounded-[40px] flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover rounded-[30px]" alt="" />
               </div>
            </div>

            {/* KPI Cards Flutuantes */}
            <div className="absolute top-10 left-0 lg:-left-20 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left animate-bounce duration-[5000ms]">
               <Users size={24} className="text-blue-600 mb-3" />
               <p className="text-xl font-black text-slate-800">Até 20%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Estabilidade e engajamento dos colaboradores.</p>
            </div>

            <div className="absolute top-1/2 left-0 lg:-left-24 -translate-y-1/2 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left">
               <Activity size={24} className="text-indigo-600 mb-3" />
               <p className="text-xl font-black text-slate-800">Até 90%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Redução no índice de ausências.</p>
            </div>

            <div className="absolute bottom-10 left-0 lg:-left-20 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left animate-bounce duration-[4500ms]">
               <Wallet size={24} className="text-blue-600 mb-3" />
               <p className="text-xl font-black text-slate-800">Até 70%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Economia na gestão e controle dos processos internos.</p>
            </div>

            <div className="absolute top-10 right-0 lg:-right-20 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left">
               <TrendingUp size={24} className="text-[#0000FF] mb-3" />
               <p className="text-xl font-black text-slate-800">Até 80%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Amplie o acompanhamento dos assistidos.</p>
            </div>

            <div className="absolute top-1/2 right-0 lg:-right-24 -translate-y-1/2 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left animate-bounce">
               <LayoutGrid size={24} className="text-blue-800 mb-3" />
               <p className="text-xl font-black text-slate-800">20-30%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Amplie a captação de doações.</p>
            </div>

            <div className="absolute bottom-10 right-0 lg:-right-20 w-56 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-left">
               <Stethoscope size={24} className="text-blue-500 mb-3" />
               <p className="text-xl font-black text-slate-800">Até 50%</p>
               <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Amplie o gerenciamento social e clínico.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade de Necessidades */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Gerenciamento Inteligente</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">Tudo pensando para atender às necessidades da sua ONG</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">Gerenciar uma ONG é como cuidar de várias famílias ao mesmo tempo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Ficha Social Online", desc: "Disponibilize à sua equipe social uma ficha completa com todos os dados necessários para um atendimento eficaz." },
              { title: "Agenda interativa", desc: "Tenha o controle de oficinas e atendimentos em diversos setores com uma agenda online organizada." },
              { title: "Organize suas parcerias", desc: "Gerencie hospitais, clínicas e outros locais de atendimento clínico com eficiência e controle de custos." },
              { title: "Reabilitação e prevenção", desc: "Como nosso sistema possibilita aos assistidos uma maior eficiência em seus tratamentos sociais e clínicos." },
              { title: "Lembrete de Whatsapp", desc: "Envie lembretes automáticos no WhatsApp para seus assistidos e aumente a adesão a consultas e tratamentos." },
              { title: "Doações", desc: "Gerencie as doações de forma eficaz, facilite a captação e o gerenciamento de doações." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-300 transition-all hover:shadow-xl hover:shadow-blue-500/5">
                 <div className="aspect-[16/10] bg-blue-50 flex items-center justify-center p-8">
                    <div className="w-full h-full bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center">
                       <LayoutGrid size={48} className="text-blue-100 group-hover:text-blue-200 transition-colors" />
                    </div>
                 </div>
                 <div className="p-10 space-y-4">
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">{item.title}</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner de Status Azul */}
      <section className="bg-[#0000FF] py-20 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 items-center text-center">
            {[
              { icon: <Heart size={32} />, label: "Acompanhamento no tratamento" },
              { icon: <Activity size={32} />, label: "Controle total dos atendimentos" },
              { icon: <Stethoscope size={32} />, label: "Possibilite o atendimento interno" },
              { icon: <ShieldCheck size={32} />, label: "Controle de atendimentos hospitalares" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 flex flex-col items-center">
                 <div className="text-white opacity-80">{item.icon}</div>
                 <p className="text-white text-xs font-black uppercase tracking-widest leading-relaxed max-w-[160px]">{item.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* CTA Final Palma da Mão */}
      <section className="py-32 px-6 md:px-12 lg:px-24">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-in slide-in-from-left-10 duration-700">
               <h2 className="text-5xl font-black text-[#000040] tracking-tight">Sua Ong na palma da sua mão</h2>
               <p className="text-[#0000FF] text-xl font-bold">Essa é a sua oportunidade de não ficar para atrás, afinal o futuro já chegou!</p>
               <button className="px-14 py-4 border-2 border-[#0000FF] text-[#0000FF] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all">
                 Criar conta
               </button>
               <p className="text-slate-400 text-xs font-bold">*Compatível com todos os dispositivos.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[60px] shadow-2xl relative overflow-hidden">
               <div className="aspect-video bg-white rounded-[40px] shadow-inner flex items-center justify-center overflow-hidden border-8 border-slate-200">
                  <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Laptop" />
               </div>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-slate-50/50 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight text-center">Dúvidas frequentes sobre o SAO</h2>
          
          <div className="space-y-4">
            {[
              { q: "O que é o SAO?", a: "O SAO – Sistema de Apoio às ONG, é sistema, uma ferramenta totalmente on-line, e tem como objetivo atender as rotinas sociais do terceiro setor. Auxiliando o setor social da ONG, no lançamento, acompanhando e gerenciamento dos assistidos e benefícios por ela ofertados." },
              { q: "Minha ONG é pequena, preciso ter acesso ao SAO?", a: "Sim! O SAO é escalável e se adapta a qualquer volume de atendimento, ajudando a organizar o crescimento da instituição desde o início." },
              { q: "Como contratar o SAO?", a: "Basta clicar em um dos botões de 'Testar agora' ou entrar em contato com nosso time comercial via WhatsApp para uma demonstração personalizada." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-8 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-black text-[#0000FF]">{faq.q}</span>
                  {activeFaq === idx ? <Minus size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />}
                </button>
                {activeFaq === idx && (
                  <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            © Plataforma SAO 2026<br />Todos os direitos reservados
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <a href="mailto:comercial@sao.app" className="text-xs font-black text-slate-500 hover:text-blue-600 transition-colors underline decoration-2 underline-offset-4">comercial@sao.app</a>
            <a href="tel:3134593030" className="text-xs font-black text-slate-500 hover:text-blue-600 transition-colors underline decoration-2 underline-offset-4">Tel (31) 3459-3030</a>
          </div>

          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center md:text-right">
            Criado por Atualz Soluções
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
