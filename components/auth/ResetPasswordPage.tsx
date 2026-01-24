
import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import { translateError } from '../../services/errorTranslator';
import { ArrowLeft, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface ResetPasswordPageProps {
    onBackToLogin: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onBackToLogin }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            setError(translateError(error.message));
        } else {
            setSuccess(true);
            setTimeout(() => {
                onBackToLogin(); // Redireciona para login/home após sucesso
            }, 3000);
        }
        setLoading(false);
    };

    return (
        <div className="relative flex min-h-screen font-['Inter'] items-center justify-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/cdn-cgi/image/w=2048,h=,f=auto,dpr=0.75,fit=contain/f1669464208318x153835531547657380/fundo%20de%20tela%20modificado.png"
                    className="w-full h-full object-cover"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-[#2e0a4d]/60 backdrop-blur-sm"></div>
            </div>

            {/* Content Card */}
            <div className="relative z-10 w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <img
                        src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg"
                        alt="SAO Logo"
                        className="h-8 w-auto mx-auto brightness-0 invert"
                    />
                </div>

                <div className="bg-white rounded-[20px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                    <div className="p-8 md:p-10">
                        {!success ? (
                            <>
                                <div className="space-y-2 mb-8 text-center sm:text-left">
                                    <h1 className="text-2xl font-bold text-slate-800">Redefinir senha</h1>
                                    <p className="text-slate-500 text-xs font-medium">
                                        Esse link poderá ser utilizado uma única vez dentro de um prazo de 24 horas
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">Senha</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Digite a senha"
                                                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#1E40AF] transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">Confirmar senha</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirme sua senha"
                                                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#1E40AF] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-11 mt-2 bg-[#0025CC] hover:bg-blue-800 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Redefinindo...' : 'Redefinir senha'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center space-y-6 py-4">
                                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-green-100">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-slate-800">Tudo certo!</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Sua senha foi redefinida com sucesso.
                                    </p>
                                </div>
                                <button
                                    onClick={onBackToLogin}
                                    className="w-full h-11 bg-[#0025CC] hover:bg-blue-800 text-white rounded-lg font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    Voltar para o login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
