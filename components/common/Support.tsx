import React, { useState } from 'react';
import { Search, Mail, MessageCircle, PlayCircle, ChevronRight, Phone, ExternalLink, Clock, ChevronDown, ArrowLeft, Play, HelpCircle } from 'lucide-react';

type SupportView = 'main' | 'videos';

export const Support: React.FC = () => {
  const [currentView, setCurrentView] = useState<SupportView>('main');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
        question: 'Como alterar minha senha de acesso?',
        answer: 'Para alterar sua senha, vá até o menu lateral e clique em "Meu Perfil". No canto superior direito, clique no botão "Redefinir senha". Um e-mail será enviado com as instruções.'
    },
    {
        question: 'Como exportar o relatório financeiro em PDF?',
        answer: 'Acesse a aba "Financeiro", filtre pelo período desejado e clique no botão "Exportar" localizado acima da tabela. Selecione a opção PDF.'
    },
    {
        question: 'O sistema funciona offline?',
        answer: 'O sistema armazena alguns dados em cache para visualização rápida, mas para salvar novos agendamentos ou editar pacientes, é necessária uma conexão ativa com a internet.'
    },
    {
        question: 'Como adicionar um novo profissional na clínica?',
        answer: 'Acesse "Configurações" > "Profissionais" e clique em "Novo Profissional". Preencha os dados obrigatórios e defina as permissões de acesso.'
    },
    {
        question: 'Como configurar as mensagens automáticas do ZapFisio?',
        answer: 'No menu "ZapFisio", vá até a aba "Mensagens". Lá você pode editar os modelos de confirmação, lembretes e aniversário. Não esqueça de salvar as alterações.'
    }
  ];

  const videoTutorials = [
      { id: 1, title: 'Como agendar um paciente', duration: '2:30', category: 'Agenda' },
      { id: 2, title: 'Cadastrando anamnese', duration: '4:15', category: 'Pacientes' },
      { id: 3, title: 'Configurando o ZapFisio', duration: '5:00', category: 'Automação' },
      { id: 4, title: 'Lançamento financeiro', duration: '3:10', category: 'Financeiro' },
      { id: 5, title: 'Criando procedimentos', duration: '1:45', category: 'Configuração' },
      { id: 6, title: 'Relatórios de produtividade', duration: '3:50', category: 'Gestão' },
  ];

  if (currentView === 'videos') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col animate-fadeIn overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
                <button 
                    onClick={() => setCurrentView('main')}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all border border-transparent hover:border-gray-200"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Biblioteca de Tutoriais</h2>
                    <p className="text-sm text-gray-500">Aprenda a utilizar todas as funções do sistema</p>
                </div>
            </div>

            <div className="p-6 bg-gray-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoTutorials.map((video) => (
                        <div key={video.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1">
                            <div className="aspect-video bg-gray-900 relative flex items-center justify-center group-hover:opacity-90 transition-opacity overflow-hidden">
                                {/* Abstract BG for video thumb */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black opacity-80"></div>
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                                
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                                    <Play size={24} className="text-white fill-current ml-1" />
                                </div>
                                <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                                    {video.duration}
                                </span>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-[#7B61FF] bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wide">
                                        {video.category}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg leading-snug group-hover:text-[#7B61FF] transition-colors">
                                    {video.title}
                                </h3>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-400 font-medium group-hover:text-gray-600">
                                    <PlayCircle size={16} /> Assistir agora
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col animate-fadeIn overflow-hidden">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-[#7B61FF] to-indigo-500 px-6 py-12 md:p-12 text-white relative shrink-0 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-lg">
                    <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                        <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">Central de Ajuda</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Como podemos ajudar você hoje?</h1>
                    <p className="text-indigo-100 text-lg leading-relaxed">Encontre respostas rápidas ou entre em contato com nosso time de especialistas.</p>
                </div>
                
                <div className="w-full md:w-auto md:min-w-[400px]">
                    <div className="relative group">
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Busque por dúvidas (ex: Como cadastrar paciente)"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 focus:outline-none shadow-xl shadow-indigo-900/20 placeholder:text-gray-400 bg-white border-2 border-transparent focus:border-indigo-300 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7B61FF] transition-colors" size={22} />
                    </div>
                </div>
            </div>
        </div>

        {/* Content - No overflow-y-auto here to allow overlap */}
        <div className="bg-gray-50/50">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                
                {/* Quick Actions Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 -mt-16 md:-mt-20 relative z-20">
                    
                    {/* WhatsApp Card */}
                    <a 
                        href="https://wa.me/5511999999999" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full"
                    >
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <MessageCircle size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Falar no WhatsApp</h3>
                        <p className="text-gray-500 mb-6 leading-relaxed text-sm flex-1">
                            Atendimento em tempo real para dúvidas urgentes e suporte técnico rápido.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Online Agora
                        </div>
                    </a>

                    {/* Email Card */}
                    <a 
                        href="mailto:suporte@fisionline.com.br"
                        className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full"
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Mail size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Enviar E-mail</h3>
                        <p className="text-gray-500 mb-6 leading-relaxed text-sm flex-1">
                            Ideal para questões financeiras, envio de comprovantes ou sugestões detalhadas.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full w-fit">
                            <Clock size={12} />
                            Resposta em até 24h
                        </div>
                    </a>

                    {/* Tutorials Card */}
                    <div 
                        onClick={() => setCurrentView('videos')}
                        className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full"
                    >
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <PlayCircle size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Tutoriais em Vídeo</h3>
                        <p className="text-gray-500 mb-6 leading-relaxed text-sm flex-1">
                            Domine a plataforma com nossa biblioteca de vídeos passo a passo.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full w-fit">
                            <ExternalLink size={12} />
                            Acessar Biblioteca
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                    
                    {/* FAQ Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <HelpCircle className="text-[#7B61FF]" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">
                                Perguntas Frequentes
                            </h2>
                        </div>
                        
                        <div className="space-y-4">
                            {faqData.map((item, i) => {
                                const isOpen = openFaqIndex === i;
                                const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase());
                                
                                if (searchTerm && !matchesSearch) return null;

                                return (
                                    <div 
                                        key={i} 
                                        className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-indigo-200 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div 
                                            onClick={() => toggleFaq(i)}
                                            className="p-5 flex items-center justify-between cursor-pointer"
                                        >
                                            <span className={`font-bold text-sm md:text-base transition-colors ${isOpen ? 'text-[#7B61FF]' : 'text-gray-700'}`}>
                                                {item.question}
                                            </span>
                                            <div className={`rounded-full p-2 transition-all duration-300 shrink-0 ${isOpen ? 'bg-indigo-50 text-[#7B61FF] rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                                                <ChevronDown size={18} />
                                            </div>
                                        </div>
                                        
                                        {/* Accordion Content */}
                                        <div 
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                                        >
                                            <div className="px-5 pb-5 pt-0 text-sm text-gray-500 leading-relaxed">
                                                <div className="h-px w-full bg-gray-50 mb-4"></div>
                                                {item.answer}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact Sidebar */}
                    <div className="h-fit">
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="bg-indigo-50 p-2 rounded-lg">
                                    <Clock className="text-[#7B61FF]" size={20} />
                                </div>
                                <h3 className="font-bold text-gray-800">Horário de Atendimento</h3>
                            </div>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Segunda a Sexta</span>
                                    <span className="font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded">08:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Sábado</span>
                                    <span className="font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded">08:00 - 12:00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Domingo</span>
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Fechado</span>
                                </div>
                            </div>
                            
                            <div className="bg-indigo-50/50 rounded-xl p-4 text-center border border-indigo-50">
                                <p className="text-xs text-indigo-500 mb-2 font-bold uppercase tracking-wide">Central Telefônica</p>
                                <div className="flex items-center justify-center gap-2 text-gray-800 font-bold text-xl">
                                    <Phone size={20} className="text-[#7B61FF] fill-current" />
                                    0800 123 4567
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};