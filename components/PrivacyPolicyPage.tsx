
import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white font-['Inter'] flex flex-col">
      {/* Header Fixo */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors"
          >
            <ArrowLeft size={18} /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-600" />
            <span className="font-black text-slate-800 tracking-tight">SAO PRIVACIDADE</span>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-8 md:p-16 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Política de Privacidade</h1>
          <p className="text-slate-500 font-medium">Última atualização: 06 de Janeiro de 2026</p>
          <div className="h-1.5 w-24 bg-indigo-600 rounded-full"></div>
        </section>

        <div className="prose prose-slate max-w-none space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Eye size={20} className="text-indigo-500" /> 1. Introdução
            </h2>
            <p className="text-slate-600 leading-relaxed">
              A Plataforma SAO (Sistema de Gestão e Assistência) valoriza a sua privacidade. Esta política descreve como coletamos, usamos e protegemos as informações das instituições e usuários que utilizam nossos serviços de gestão de estoque e assistência social.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-indigo-500" /> 2. Coleta de Dados
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Coletamos dados estritamente necessários para a operação logística e assistencial, incluindo:
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-2">
              <li>Dados de login (e-mail institucional e senha criptografada);</li>
              <li>Informações sobre doações e compras (fornecedores, valores e tipos);</li>
              <li>Dados de assistidos para fins de triagem social (nome, CPF, endereço e necessidades básicas);</li>
              <li>Registros de acesso e logs de sistema para fins de auditoria.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Lock size={20} className="text-indigo-500" /> 3. Segurança da Informação
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Utilizamos criptografia de ponta a ponta (AES-256) e protocolos de segurança rigorosos. O acesso ao sistema é controlado por níveis de permissão (Roles), garantindo que apenas pessoal autorizado visualize dados sensíveis de assistidos.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">Conformidade com a LGPD</h3>
            <p className="text-sm text-slate-500">
              O SAO está em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Você tem o direito de solicitar a correção, exclusão ou portabilidade de seus dados a qualquer momento através do nosso suporte.
            </p>
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

export default PrivacyPolicyPage;
