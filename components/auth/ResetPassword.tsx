import React, { useState } from 'react';
import { Activity, ArrowLeft, Mail } from 'lucide-react';

interface ResetPasswordProps {
  onBack: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans animate-fadeIn">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 xl:p-24">
        <div className="w-full max-w-md space-y-8">
          
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar ao login
          </button>

          <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#7B61FF] p-1.5 rounded-lg">
                <Activity className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#7B61FF]">FISIONLINE</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Redefinir senha</h1>
            <p className="text-gray-500">
              {submitted 
                ? 'Verifique sua caixa de entrada.' 
                : 'Insira seu email para receber o link de redefinição.'}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Seu email cadastrado</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] placeholder:text-gray-300 transition-all"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Enviar link de recuperação
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mt-8 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                    <Mail size={24} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Email enviado!</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Enviamos um link de recuperação para <strong>{email}</strong>. Por favor, verifique também sua caixa de spam.
                </p>
                <button 
                    onClick={() => setSubmitted(false)}
                    className="text-emerald-600 font-bold text-sm hover:underline"
                >
                    Tentar outro email
                </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 relative bg-gray-100">
         <img 
            src="https://images.unsplash.com/photo-1576091160550-2187580018f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Physiotherapy consulting" 
            className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply"></div>
      </div>
    </div>
  );
};