
import React from 'react';
import { ArrowLeft, BookOpen, AlertCircle, CheckCircle, Scale } from 'lucide-react';

interface TermsOfUsePageProps {
  onBack: () => void;
}

const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white font-['Inter'] flex flex-col">
      {/* Header Fixo */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors"
          >
            <ArrowLeft size={18} /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            <span className="font-black text-slate-800 tracking-tight">TERMOS DE USO</span>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-8 md:p-16 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Termos de Uso</h1>
          <p className="text-slate-500 font-medium">Versão 1.0 - Válida a partir de Janeiro de 2026</p>
          <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
        </section>

        <div className="prose prose-slate max-w-none space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-500" /> 1. Aceitação dos Termos
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Ao acessar e utilizar a Plataforma SAO, você concorda integralmente com estes termos. O uso indevido do sistema, como a manipulação fraudulenta de estoques ou vazamento de dados de assistidos, resultará na suspensão imediata da conta e possíveis medidas legais.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Scale size={20} className="text-blue-500" /> 2. Responsabilidade do Usuário
            </h2>
            <p className="text-slate-600 leading-relaxed">
              O usuário é o único responsável pela guarda de sua senha e por todas as atividades realizadas em sua conta. É obrigatório o registro fidedigno de entradas e saídas de estoque para garantir a transparência da instituição frente aos doadores e órgãos fiscalizadores.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle size={20} className="text-blue-500" /> 3. Limitação de Responsabilidade
            </h2>
            <p className="text-slate-600 leading-relaxed">
              A Plataforma SAO fornece ferramentas de gestão, mas não se responsabiliza por erros humanos no preenchimento de inventários ou decisões administrativas tomadas com base nos relatórios gerados.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl h-fit">
              <Scale size={24} />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Foro de Eleição</h3>
              <p className="text-sm text-blue-800/70">
                Fica eleito o foro da comarca da sede da instituição mantenedora da plataforma para dirimir quaisquer dúvidas oriundas deste termo, com renúncia expressa a qualquer outro.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Simples */}
      <footer className="p-8 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">© 2026 SAO - Sistema de Gestão e Assistência. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default TermsOfUsePage;
