import React, { useState } from 'react';
import { Eye, EyeOff, Activity } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onLogin();
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans animate-fadeIn">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 xl:p-24">
        <div className="w-full max-w-md space-y-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="bg-[#7B61FF] p-1.5 rounded-lg">
                <Activity className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#7B61FF]">FISIONLINE</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Fazer login</h1>
            <p className="text-gray-500">Bem vindo de volta! Por favor, insira seus dados.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Seu email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email" 
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] placeholder:text-gray-300 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Sua senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] placeholder:text-gray-300 transition-all"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7B61FF] focus:ring-[#7B61FF] cursor-pointer bg-white" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Lembrar senha</span>
              </label>
              <button 
                type="button" 
                onClick={onForgotPassword}
                className="text-sm font-medium text-[#7B61FF] hover:text-[#6A51E6] transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-4"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 relative bg-gray-100">
         <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Physiotherapy session" 
            className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply"></div>
      </div>
    </div>
  );
};