
import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ResetPasswordPageProps {
  onBackToLogin: () => void;
  onResetComplete: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onBackToLogin, onResetComplete }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de sucesso
    setIsSuccess(true);
    setTimeout(() => {
      onResetComplete();
    }, 2000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-['Inter'] overflow-hidden">
      {/* Background Image with Purple Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover" 
          alt="Office Background"
        />
        <div className="absolute inset-0 bg-[#2E1065]/90 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-4 flex flex-col items-center">
        {/* Logo SAO */}
        <div className="mb-8">
           <img 
            src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg" 
            alt="SAO Logo" 
            className="h-12 w-auto brightness-0 invert" 
          />
        </div>

        {/* Card */}
        <div className="bg-white w-full rounded-2xl shadow-2xl p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
          {!isSuccess ? (
            <>
              <div className="space-y-4 mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Redefinir senha</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Esse link poderá ser utilizado uma única vez dentro de um prazo de 24 horas
                </p>
                <div className="h-px bg-slate-100 w-full" />
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Senha */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Senha</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Digite a senha"
                      className="w-full h-12 px-4 bg-white border border-rose-500 rounded-lg text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                    >
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Confirmar senha</label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      className="w-full h-12 px-4 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                    >
                      {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-[#0000FF] hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  Redefinir senha
                </button>
              </form>

              <button 
                onClick={onBackToLogin}
                className="mt-6 w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft size={16} /> Voltar para o login
              </button>
            </>
          ) : (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Senha Alterada!</h2>
                <p className="text-slate-500 text-sm">Sua nova senha foi salva com sucesso. Redirecionando...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Note */}
        <div className="mt-8 flex items-center gap-2 text-white/50 text-[10px] font-medium uppercase tracking-widest">
          <ShieldCheck size={14} className="text-emerald-400" />
          Conexão segura e criptografada
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
