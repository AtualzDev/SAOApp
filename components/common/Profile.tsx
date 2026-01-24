import React from 'react';
import { User, Upload, Trash2, Camera, MapPin, Mail, Award, Shield, LogOut, Key, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  return (
    <div className="flex flex-col h-full animate-fadeIn overflow-y-auto bg-gray-50/50 pb-10">
      
      {/* Banner / Cover */}
      <div className="h-48 bg-gradient-to-r from-[#7B61FF] to-indigo-600 relative shrink-0">
         <div className="absolute inset-0 bg-black/10"></div>
         {/* Decorative circles */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
      </div>

      {/* Profile Header Container */}
      <div className="px-6 md:px-10 max-w-6xl mx-auto w-full -mt-20 relative z-10 mb-8">
         <div className="flex flex-col md:flex-row items-end gap-6">
            
            {/* Avatar */}
            <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center relative">
                    <User size={64} className="text-gray-300" />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="text-white" size={32} />
                    </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-[#7B61FF] text-white p-2 rounded-full shadow-md hover:bg-[#6A51E6] transition-colors border-2 border-white">
                    <Camera size={18} />
                </button>
            </div>

            {/* Name & Basic Actions */}
            <div className="flex-1 pb-2 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">Thais de Jesus Lopes</h1>
                <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Award size={16} className="text-[#7B61FF]" /> Fisioterapeuta
                    <span className="text-gray-300 mx-1">|</span>
                    <span className="text-gray-500">CREFITO 3 371004-F</span>
                </p>
            </div>

            {/* Top Actions */}
            <div className="flex gap-3 pb-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors">
                    <Key size={18} /> <span className="hidden sm:inline">Alterar Senha</span>
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#7B61FF] hover:bg-[#6A51E6] text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-colors">
                    <Save size={18} /> Salvar Alterações
                </button>
            </div>
         </div>
      </div>

      {/* Main Grid Content */}
      <div className="px-6 md:px-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Personal Info) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Card: Dados Pessoais */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                    <User className="text-[#7B61FF]" size={20} /> Informações Pessoais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                        <input 
                            type="text" 
                            defaultValue="Thais de Jesus Lopes"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF] transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                defaultValue="fisioterapiathaislopes@gmail.com"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF] transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Conselho (CREFITO/CRM)</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                defaultValue="3 371004-F"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF] transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">CPF</label>
                        <input 
                            type="text" 
                            defaultValue="417.907.698-50"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF] transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">RG</label>
                        <input 
                            type="text" 
                            defaultValue="36.274.025-2"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF] transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Card: Assinatura */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Award className="text-[#7B61FF]" size={20} /> Assinatura Digital
                    </h3>
                    <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">Ativa</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-full sm:w-64 h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer group relative overflow-hidden">
                        {/* Simulated Signature Image */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                             <span className="font-cursive text-3xl text-gray-600">Thais Lopes</span>
                        </div>
                        
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600 bg-white/80 px-2 py-1 rounded">Alterar</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-3 text-center sm:text-left">
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Esta assinatura será utilizada automaticamente em prontuários, receitas e atestados gerados pelo sistema.
                        </p>
                        <button className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center justify-center sm:justify-start gap-2 transition-colors">
                            <Trash2 size={16} /> Remover assinatura
                        </button>
                    </div>
                </div>
            </div>

        </div>

        {/* Right Column (Address & Danger Zone) */}
        <div className="space-y-6">
            
            {/* Card: Endereço */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                    <MapPin className="text-[#7B61FF]" size={20} /> Endereço
                </h3>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">CEP</label>
                        <input 
                            type="text" 
                            defaultValue="01001-000"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF]"
                        />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Logradouro</label>
                        <input 
                            type="text" 
                            defaultValue="Rua Cachoeira do Campo Grande"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF]"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Nº</label>
                            <input 
                                type="text" 
                                defaultValue="44"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF]"
                            />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Comp.</label>
                            <input 
                                type="text" 
                                placeholder="Apto..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF]"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Bairro</label>
                        <input 
                            type="text" 
                            defaultValue="Barro Branco II"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Cidade</label>
                            <input 
                                type="text" 
                                defaultValue="São Paulo"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Estado</label>
                            <input 
                                type="text" 
                                defaultValue="SP"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7B61FF]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-xl border border-red-100 transition-colors flex items-center justify-center gap-2">
                <LogOut size={20} />
                Sair da Conta
            </button>
        </div>
      </div>
    </div>
  );
};