
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { translateError } from '../services/errorTranslator';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onForgotPassword: () => void;
  onShowPrivacy: () => void;
  onShowTerms: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onForgotPassword, onShowPrivacy, onShowTerms }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });


    if (error) {
      setError(translateError(error.message));
      setLoading(false);
    } else {
      // Successful login
      onLogin();
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
        <div className="max-w-md w-full mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Fazer login</h1>
            <p className="text-slate-500 text-sm">
              Seja bem-vindo a SAO, a plataforma criada para sua ONG.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
              />
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-slate-200 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                  <svg className="absolute left-1 top-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Lembrar-me</span>
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-bold text-blue-600 hover:underline bg-transparent border-none"
              >
                Esqueceu sua senha?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#4338CA] hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Acessar conta'}
            </button>
          </form>

          {/* Privacy Note */}
          <div className="pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck size={14} className="text-blue-500" />
            <p>Seus dados estão protegidos pela LGPD e criptografia de ponta.</p>
          </div>
        </div>

        {/* Footer com Políticas */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100 pt-8">
          <div className="text-slate-400 text-xs font-medium">
            © Plataforma SAO 2026
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={onShowPrivacy}
              className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
            >
              Política de Privacidade
            </button>
            <button
              onClick={onShowTerms}
              className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
            >
              Termos de Uso
            </button>
          </div>
        </div>
      </div>

      {/* Lado Direito - Grade Decorativa */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center overflow-hidden p-12">
        <div className="grid grid-cols-3 gap-6 w-full max-w-2xl h-[80vh]">
          {/* Row 1 */}
          <div className="rounded-[40px] overflow-hidden bg-slate-100">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale" alt="Person" />
          </div>
          <div className="bg-[#A5B4FC] rounded-tl-[100px] rounded-br-[100px]"></div>
          <div className="rounded-[40px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Person" />
          </div>
          {/* Row 2 */}
          <div className="bg-[#EEF2FF] rounded-full"></div>
          <div className="bg-[#4338CA] rounded-tr-[100px] rounded-bl-[100px]"></div>
          <div className="bg-[#EEF2FF] rounded-[40px]"></div>
          {/* Row 3 */}
          <div className="bg-[#4338CA] rounded-br-[100px]"></div>
          <div className="bg-[#C7D2FE] rounded-[40px]"></div>
          <div className="rounded-[40px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Person" />
          </div>
          {/* Row 4 */}
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

export default LoginPage;
