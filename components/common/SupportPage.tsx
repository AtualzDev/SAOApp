
import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Mail, 
  PlayCircle, 
  ArrowLeft, 
  ChevronRight, 
  Clock, 
  ExternalLink,
  HelpCircle,
  Play
} from 'lucide-react';

type SupportView = 'landing' | 'library';

const SupportPage: React.FC = () => {
  const [view, setView] = useState<SupportView>('landing');

  const tutorials = [
    { id: 1, title: 'Como agendar um paciente', category: 'AGENDA', duration: '2:30' },
    { id: 2, title: 'Cadastrando anamnese', category: 'PACIENTES', duration: '4:15' },
    { id: 3, title: 'Configurando o ZapFisio', category: 'AUTOMAÇÃO', duration: '5:00' },
    { id: 4, title: 'Gestão de Estoque e Almoxarifado', category: 'ESTOQUE', duration: '3:45' },
    { id: 5, title: 'Triagem de Assistência Social', category: 'SOCIAL', duration: '6:12' },
    { id: 6, title: 'Emissão de Relatórios Customizados', category: 'RELATÓRIOS', duration: '2:55' },
  ];

  if (view === 'library') {
    return (
      <div className="flex-1 bg-white animate-in fade-in duration-500 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <button 
              onClick={() => setView('landing')}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-95"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Biblioteca de Tutoriais</h1>
              <p className="text-xs text-slate-400 font-medium">Aprenda a utilizar todas as funções do sistema</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((video) => (
              <div key={video.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all border-b-4 hover:border-b-indigo-500">
                <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-[#1E40AF] to-black" />
                  {/* Fake Video Thumbnail Content */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform duration-500">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black tracking-wider uppercase">
                    {video.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-700 leading-snug min-h-[40px]">
                    {video.title}
                  </h3>
                  <button className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                    <Play size={14} className="fill-current" /> Assistir agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] animate-in fade-in duration-500 overflow-y-auto">
      {/* Banner Section */}
      <div className="relative bg-[#6366F1] pt-12 pb-24 px-8 md:px-16 overflow-hidden min-h-[400px] flex items-center">
        {/* Abstract Decorative Circles from reference */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400 opacity-[0.1] rounded-full -ml-32 -mb-32 pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-10">
          <div className="space-y-6 text-white text-center lg:text-left">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
              CENTRAL DE AJUDA
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Como podemos ajudar você hoje?
            </h1>
            <p className="text-indigo-100 text-sm md:text-base font-medium max-w-md mx-auto lg:mx-0 opacity-90">
              Encontre respostas rápidas ou entre em contato com nosso time de especialistas.
            </p>
          </div>

          <div className="w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl group">
              <div className="absolute inset-0 bg-white/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white h-14 md:h-16 rounded-2xl shadow-2xl flex items-center px-6 border border-white/20">
                <Search className="text-slate-300" size={24} />
                <input 
                  type="text" 
                  placeholder="Busque por dúvidas (ex: Como cadastrar paciente)" 
                  className="w-full h-full bg-transparent border-none outline-none pl-4 text-slate-600 placeholder:text-slate-300 font-medium text-sm md:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards Container - Overlapping the banner */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full -mt-16 relative z-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card WhatsApp */}
          <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-indigo-900/5 border border-slate-50 hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Falar no WhatsApp</h3>
            <p className="text-[13px] text-slate-400 font-medium leading-relaxed mb-8 flex-1">
              Atendimento em tempo real para dúvidas urgentes e suporte técnico rápido.
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full w-fit">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Online Agora</span>
            </div>
          </div>

          {/* Card E-mail */}
          <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-indigo-900/5 border border-slate-50 hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full">
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Enviar E-mail</h3>
            <p className="text-[13px] text-slate-400 font-medium leading-relaxed mb-8 flex-1">
              Ideal para questões financeiras, envio de comprovantes ou sugestões detalhadas.
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full w-fit">
              <Clock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Resposta em até 24h</span>
            </div>
          </div>

          {/* Card Tutoriais */}
          <button 
            onClick={() => setView('library')}
            className="bg-white p-8 rounded-[32px] shadow-xl shadow-indigo-900/5 border border-slate-50 hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full text-left"
          >
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PlayCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Tutoriais em Vídeo</h3>
            <p className="text-[13px] text-slate-400 font-medium leading-relaxed mb-8 flex-1">
              Domine a plataforma com nossa biblioteca de vídeos passo a passo.
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full w-fit group-hover:bg-rose-600 group-hover:text-white transition-all">
              <ExternalLink size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Acessar Biblioteca</span>
            </div>
          </button>
        </div>

        {/* FAQs and Opening Hours Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
               <HelpCircle size={22} className="text-[#1E40AF]" />
               <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">Perguntas Frequentes</h2>
            </div>
            
            <div className="space-y-3">
              {[
                "Como realizar o inventário mensal?",
                "Como cadastrar um novo assistido?",
                "Como emitir o relatório de doações?",
                "É possível integrar com o WhatsApp?",
                "Como recuperar minha senha de acesso?"
              ].map((q, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 cursor-pointer transition-all shadow-sm">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{q}</span>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-[#1E40AF] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-fit">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Clock size={20} /></div>
                <h3 className="font-black text-slate-800 tracking-tight">Horário de Atendimento</h3>
             </div>
             <div className="space-y-5">
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-slate-400">Segunda à Sexta</span>
                   <span className="text-sm font-black text-slate-700">08:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-slate-400">Sábado</span>
                   <span className="text-sm font-black text-slate-700">08:00 - 12:00</span>
                </div>
                <div className="pt-6 border-t border-slate-50 mt-4 text-center">
                   <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">Atendimento via chat e telefone</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
