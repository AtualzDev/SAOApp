
import React from 'react';
import { WifiOff, FileSearch, ArrowLeft, RefreshCw, Home } from 'lucide-react';

interface ErrorPageProps {
  type: '404' | 'offline';
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ type, onRetry, onGoHome }) => {
  const isOffline = type === 'offline';

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F3F4F6] p-4 font-sans animate-fadeIn">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#7B61FF]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] shadow-2xl border border-white max-w-lg w-full flex flex-col items-center text-center">
        
        {/* Icon Section */}
        <div className="mb-8 relative">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center relative z-10 
            ${isOffline ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-[#7B61FF] shadow-lg shadow-indigo-100'}
          `}>
            {isOffline ? <WifiOff size={48} className="animate-pulse" /> : <FileSearch size={48} />}
          </div>
          {/* Pulsing ring for offline */}
          {isOffline && (
            <div className="absolute inset-0 bg-amber-200 rounded-3xl animate-ping opacity-20 z-0"></div>
          )}
        </div>

        {/* Text Section */}
        <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-2 tracking-tighter">
          {isOffline ? 'Ops!' : '404'}
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {isOffline ? 'Você está offline' : 'Página não encontrada'}
        </h2>
        <p className="text-gray-500 mb-10 max-w-xs mx-auto leading-relaxed">
          {isOffline 
            ? 'Parece que sua conexão com a internet caiu. Verifique seu Wi-Fi ou dados móveis para continuar.' 
            : 'O link que você tentou acessar não existe ou foi movido para outro endereço.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {isOffline ? (
            <button 
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              <RefreshCw size={20} />
              Tentar novamente
            </button>
          ) : (
            <>
              <button 
                onClick={onGoHome}
                className="flex-1 flex items-center justify-center gap-2 bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                <Home size={20} />
                Voltar ao Início
              </button>
              <button 
                onClick={() => window.history.back()}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all"
              >
                <ArrowLeft size={20} />
                Voltar
              </button>
            </>
          )}
        </div>

        {/* Footer status */}
        <div className="mt-12 pt-6 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-400' : 'bg-indigo-400'}`}></div>
          Sistema de Monitoramento Fisionline
        </div>
      </div>
    </div>
  );
};
