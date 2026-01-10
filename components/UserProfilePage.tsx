
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Briefcase, 
  FileSignature,
  Camera,
  X,
  ChevronRight,
  Phone,
  MapPin,
  HelpCircle
} from 'lucide-react';

type ProfileTab = 'acesso' | 'gerais' | 'profissionais';

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('acesso');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const tabs = [
    { id: 'acesso', label: 'Dados de acesso' },
    { id: 'gerais', label: 'Dados gerais' },
    { id: 'profissionais', label: 'Dados profissionais' },
  ];

  const primaryBlue = '#1E40AF';

  return (
    <div className="flex-1 bg-white animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      {/* Tab Navigation - Responsive with horizontal scroll */}
      <div className="px-4 md:px-8 pt-6 md:pt-8 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 md:gap-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`pb-4 text-xs md:text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E40AF] animate-in slide-in-from-left-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl p-4 md:p-8 space-y-8 md:space-y-12">
        {activeTab === 'acesso' && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Foto de Perfil Section - Responsive Flex */}
            <section className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 md:gap-8">
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                    Dados de acesso
                  </h3>
                  <div className="flex items-center gap-2 pt-4">
                     <span className="text-sm font-bold text-slate-600">Foto de perfil*</span>
                     <HelpCircle size={14} className="text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    A foto deve ser apenas do rosto. Evite fotos de óculos escuros e prefira locais bem iluminados.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-100 border-2 border-white shadow-md overflow-hidden flex-shrink-0">
                    <img src="https://picsum.photos/seed/isaque/200/200" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full lg:w-96 min-h-[96px] border-2 border-dashed border-[#1E40AF]/20 bg-slate-50/30 rounded-2xl flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:bg-blue-50/30 transition-all group">
                    <div className="w-10 h-10 bg-white text-slate-400 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 group-hover:text-blue-600 transition-all">
                      <Upload size={18} />
                    </div>
                    <p className="text-xs font-medium text-slate-400 text-center">
                      <span className="text-[#1E40AF] font-bold">Clique para carregar</span> ou arraste e solte
                    </p>
                    <p className="text-[10px] text-slate-300 font-bold uppercase">PNG ou JPG (min. 800x400px)</p>
                  </div>
                </div>
              </div>

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ID Usuário</label>
                  <input 
                    type="text" 
                    readOnly 
                    value="45GG7C" 
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Nome de usuário*</label>
                  <input 
                    type="text" 
                    defaultValue="Samuel Alves" 
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
                </div>
                <div className="md:col-start-2 space-y-2">
                  <label className="text-sm font-bold text-slate-600">Email*</label>
                  <input 
                    type="email" 
                    defaultValue="samuel.alves@fncd.com.br" 
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                  <CheckCircle2 size={18} /> Salvar informações
                </button>
              </div>
            </section>

            {/* Senha Section */}
            <section className="space-y-6 border-t border-slate-50 pt-8">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Alterar Senha</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Senha atual*</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPass ? "text" : "password"} 
                      defaultValue="********" 
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all pr-12"
                    />
                    <button onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                      {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 md:col-start-2">
                  <label className="text-sm font-bold text-slate-600">Nova senha*</label>
                  <div className="relative">
                    <input 
                      type={showNewPass ? "text" : "password"} 
                      defaultValue="********" 
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all pr-12"
                    />
                    <button onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 md:col-start-2">
                  <label className="text-sm font-bold text-slate-600">Confirmar nova senha*</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPass ? "text" : "password"} 
                      defaultValue="********" 
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all pr-12"
                    />
                    <button onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                      {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#1E40AF]/10 text-[#1E40AF] rounded-xl font-bold text-sm border border-[#1E40AF]/20 transition-all hover:bg-[#1E40AF]/20">
                  <CheckCircle2 size={18} /> Salvar nova senha
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'gerais' && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-[#1E40AF] rounded-2xl">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Informações Pessoais</h3>
                  <p className="text-xs text-slate-400 font-medium">Dados de contato e localização do usuário.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Nome Completo*</label>
                  <input 
                    type="text" 
                    defaultValue="Samuel Alves da Silva" 
                    placeholder="Seu nome completo" 
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-500/5 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Telefone*</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      defaultValue="(31) 9 9876-5432" 
                      placeholder="(00) 0 0000-0000" 
                      className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-500/5 transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-600">Email Secundário/Pessoal</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email" 
                      defaultValue="samuel.pessoal@gmail.com" 
                      placeholder="seuemail@exemplo.com" 
                      className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-500/5 transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Seção de Endereço */}
              <div className="space-y-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#1E40AF]" />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[11px]">Endereço Residencial</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-bold text-slate-600">CEP</label>
                    <input type="text" defaultValue="31255-000" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all" />
                  </div>
                  <div className="md:col-span-9 space-y-2">
                    <label className="text-sm font-bold text-slate-600">Logradouro (Rua/Avenida)*</label>
                    <input type="text" defaultValue="Rua das Flores" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all" />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-bold text-slate-600">Número*</label>
                    <input type="text" defaultValue="123" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all" />
                  </div>
                  <div className="md:col-span-5 space-y-2">
                    <label className="text-sm font-bold text-slate-600">Bairro*</label>
                    <input type="text" defaultValue="Centro" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all" />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-bold text-slate-600">Cidade*</label>
                    <input type="text" defaultValue="Belo Horizonte" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all" />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-sm font-bold text-slate-600 text-center">UF*</label>
                    <input type="text" defaultValue="MG" className="w-full h-12 px-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all text-center" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-12 py-4 bg-[#1E40AF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 hover:bg-blue-800">
                  Salvar Dados Gerais <CheckCircle2 size={18} />
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'profissionais' && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-[#1E40AF] rounded-2xl">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Atuação Profissional</h3>
                  <p className="text-xs text-slate-400 font-medium">Dados relativos à sua função na ONG e registro de conselho.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Cargo na ONG*</label>
                  <input type="text" placeholder="Ex: Assistente Social Sênior" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Profissão*</label>
                  <input type="text" placeholder="Sua formação acadêmica" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Conselho (Sigla)*</label>
                  <input type="text" placeholder="Ex: CRESS" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Número do Conselho*</label>
                  <input type="text" placeholder="00.000-0" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1E40AF] transition-all" />
                </div>
              </div>

              {/* Assinatura Digital Section */}
              <div className="space-y-4 pt-6">
                <div className="flex items-center gap-2">
                  <FileSignature size={18} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[11px]">Assinatura Digital</span>
                </div>
                <div className="w-full h-40 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white hover:border-blue-300 transition-all group">
                   <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                     <Upload size={24} />
                   </div>
                   <p className="text-xs font-bold text-slate-400">Carregar arquivo de assinatura (.png transparente)</p>
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-12 py-4 bg-[#1E40AF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                  Salvar Perfil Profissional <ChevronRight size={18} />
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-6 md:p-8 border-t border-slate-50">
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
          <ShieldCheck size={16} className="text-blue-500" />
          <span>Informações protegidas por criptografia e acessíveis apenas pela sua unidade administrativa.</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
