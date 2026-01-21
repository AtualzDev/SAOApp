
import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { translateError } from '../services/errorTranslator';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    // Supabase reset password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/?reset=true`,
    });

    if (error) {
      setError(translateError(error.message));
      setLoading(false);
    } else {
      setEmailSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-['Inter']">
      {/* Lado Esquerdo - Formulário */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg"
            alt="SAO Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!emailSent ? (
            <>
              <div className="space-y-2">
                <button
                  onClick={onBackToLogin}
                  className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors mb-6"
                >
                  <ArrowLeft size={16} /> Voltar para o login
                </button>
                <h1 className="text-3xl font-bold text-slate-900">Recuperar senha</h1>
                <p className="text-slate-500 text-sm">
                  Insira o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Email institucional</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@ong.org.br"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#4338CA] hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">E-mail enviado!</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Enviamos um link de recuperação para <span className="font-bold text-slate-700">{email}</span>.
                  Verifique sua caixa de entrada e spam.
                </p>
              </div>
              <button
                onClick={onBackToLogin}
                className="w-full h-12 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-all active:scale-95"
              >
                Voltar para o login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-slate-400 text-xs font-medium">
          © Plataforma SAO 2026
        </div>
      </div>

      {/* Lado Direito - Grade Decorativa (Reutilizada do Login para consistência) */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center overflow-hidden p-12">
        <div className="grid grid-cols-3 gap-6 w-full max-w-2xl h-[80vh]">
          {/* Mesma grade do Login para manter a identidade visual durante a navegação */}
          <div className="rounded-[40px] overflow-hidden bg-slate-100">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale" alt="Person" />
          </div>
          <div className="bg-[#A5B4FC] rounded-tl-[100px] rounded-br-[100px]"></div>
          <div className="rounded-[40px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Person" />
          </div>
          <div className="bg-[#EEF2FF] rounded-full"></div>
          <div className="bg-[#4338CA] rounded-tr-[100px] rounded-bl-[100px]"></div>
          <div className="bg-[#EEF2FF] rounded-[40px]"></div>
          <div className="bg-[#4338CA] rounded-br-[100px]"></div>
          <div className="bg-[#C7D2FE] rounded-[40px]"></div>
          <div className="rounded-[40px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Person" />
          </div>
          <div className="rounded-[40px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Person" />
          </div>
          <div className="bg-[#EEF2FF] rounded-full"></div>
          <div className="bg-[#A5B4FC] rounded-tr-[100px]"></div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
