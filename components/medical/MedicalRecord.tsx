import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Phone, 
  FileText, 
  Activity, 
  Save, 
  Printer, 
  ArrowLeft, 
  Camera, 
  Search, 
  Clipboard, 
  Stethoscope, 
  Video, 
  DollarSign, 
  FileUp, 
  Cloud 
} from 'lucide-react';

interface MedicalRecordProps {
  patientId?: string;
  onBack?: () => void;
}

// Menu Items Configuration
const MENU_ITEMS = [
  { id: 'dados', label: 'Dados Pessoais', icon: <User size={20} /> },
  { id: 'plano', label: 'Plano Terapêutico', icon: <Clipboard size={20} /> },
  { id: 'diagnostico', label: 'Diagnóstico', icon: <Stethoscope size={20} /> },
  { id: 'avaliacao', label: 'Avaliação Clínica', icon: <Activity size={20} /> },
  { id: 'exame', label: 'Exame Clínico / Físico', icon: <Activity size={20} /> },
  { id: 'testes', label: 'Testes Específicos', icon: <Clipboard size={20} /> },
  { id: 'teleconsulta', label: 'Teleconsulta', icon: <Video size={20} /> },
  { id: 'evolucao', label: 'Evolução', icon: <Activity size={20} /> }, // Using Activity as Monitor icon replacement
  { id: 'financeiro', label: 'Relatório Financeiro', icon: <DollarSign size={20} /> },
  { id: 'agendamento', label: 'Agendamento', icon: <Calendar size={20} /> },
  { id: 'documentos', label: 'Documentos', icon: <FileText size={20} /> },
  { id: 'personalizada', label: 'Avaliação Personalizada', icon: <Stethoscope size={20} /> },
];

export const MedicalRecord: React.FC<MedicalRecordProps> = ({ patientId, onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('dados');

  // Mock patient data
  const patient = {
    name: 'Ademar Soares',
    age: 45,
    occupation: 'Engenheiro Civil',
    phone: '(11) 99999-8888',
    email: 'ademar.soares@email.com',
    status: 'Ativo',
    image: null,
    birthDate: '10/05/1980',
    registrationDate: '11/10/2024'
  };

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden">
      
      {/* --- Sidebar Menu (Purple) --- */}
      <aside className="w-72 bg-[#7B61FF] text-white flex flex-col shrink-0 overflow-y-auto no-scrollbar">
        {/* Header Logo Area */}
        <div className="p-6 pb-2">
            <div className="flex items-center gap-2 mb-8">
               <Cloud size={32} className="text-white fill-white/20" />
               <span className="text-2xl font-bold tracking-tight">FISIONLINE</span>
            </div>
            
            {onBack && (
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium mb-4"
              >
                 <ArrowLeft size={16} /> Voltar para lista
              </button>
            )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 pb-6 space-y-1">
           {MENU_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                 <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                       w-full flex items-center gap-4 px-6 py-3.5 text-left transition-all relative
                       ${isActive 
                          ? 'bg-[#6A51E6] text-white font-bold shadow-inner' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'}
                    `}
                 >
                    {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full"></div>
                    )}
                    <span className={isActive ? 'opacity-100' : 'opacity-80'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                 </button>
              );
           })}
        </nav>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F3F4F6]">
         
         {/* Top Bar / Patient Header */}
         <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm shrink-0 z-10">
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <User size={24} className="text-gray-400" />
                 </div>
                 <div>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {patient.name}
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase font-bold border border-emerald-200">
                            {patient.status}
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                       <span className="flex items-center gap-1"><Calendar size={14} /> {patient.age} anos</span>
                       <span className="flex items-center gap-1"><Activity size={14} /> {patient.occupation}</span>
                       <span className="flex items-center gap-1"><Phone size={14} /> {patient.phone}</span>
                    </div>
                 </div>
             </div>

             <div className="flex gap-3">
                 <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors text-sm"
                 >
                     <Printer size={16} /> Imprimir
                 </button>
                 <button className="flex items-center gap-2 px-6 py-2 bg-[#7B61FF] text-white rounded-lg hover:bg-[#6A51E6] font-bold shadow-md transition-colors text-sm">
                     <Save size={16} /> Salvar
                 </button>
             </div>
         </div>

         {/* Content Body */}
         <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            
            {/* --- DADOS PESSOAIS --- */}
            {activeTab === 'dados' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
                 
                 {/* Status Card */}
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-emerald-600 font-bold text-lg">Cadastro ativo</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                <span>{patient.registrationDate}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>2025- anos</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>Aniversário em {patient.birthDate.slice(0, 5)}</span>
                            </div>
                        </div>
                    </div>
                    <button className="px-6 py-2 border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors text-sm">
                        Desativar Cadastro
                    </button>
                 </div>

                 {/* Identification Section */}
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">Identificação</h3>
                        <button className="text-gray-500 hover:text-[#7B61FF] text-sm font-bold underline">
                            Gerar PDF
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Photo Column */}
                        <div className="w-full md:w-64 shrink-0">
                            <div className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-[#7B61FF] hover:text-[#7B61FF] transition-all cursor-pointer group relative overflow-hidden">
                                <Camera size={32} className="mb-2" />
                                <span className="text-sm font-bold">Foto do Paciente</span>
                            </div>
                        </div>

                        {/* Fields Column */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
                                <input 
                                    type="text" 
                                    defaultValue={patient.name}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Data Nascimento</label>
                                <input 
                                    type="date"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">RG</label>
                                <input 
                                    type="text" 
                                    placeholder="RG"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">CPF</label>
                                <input 
                                    type="text" 
                                    placeholder="CPF"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                                />
                            </div>
                            
                            {/* Gender Radio */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="sexo" className="w-4 h-4 text-[#7B61FF] border-gray-300 focus:ring-[#7B61FF]" />
                                        <span className="text-gray-700">Masculino</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="sexo" className="w-4 h-4 text-[#7B61FF] border-gray-300 focus:ring-[#7B61FF]" />
                                        <span className="text-gray-700">Feminino</span>
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado Civil</label>
                                <select className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all">
                                    <option>Selecione uma opção</option>
                                    <option>Solteiro(a)</option>
                                    <option>Casado(a)</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Profissão</label>
                                <input 
                                    type="text" 
                                    placeholder="Profissão"
                                    defaultValue={patient.occupation}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Convênio</label>
                                <input 
                                    type="text" 
                                    placeholder="Convênio"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                                />
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Contact Section */}
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b border-gray-50">Informações de contato</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Celular</label>
                            <input 
                                type="text" 
                                placeholder="(xx) xxxxx-xxxx"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
                            <input 
                                type="text" 
                                placeholder="(xx) xxxxx-xxxx"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <p className="text-xs text-red-500 font-medium mb-4">
                                Digite o número com DDD sem o zero. Exemplo: 43996570342 (e não 043...).
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                            <input 
                                type="email" 
                                defaultValue={patient.email}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                            />
                        </div>
                    </div>
                 </div>
              </div>
            )}

            {/* --- PLANO TERAPÊUTICO (Originally Anamnese) --- */}
            {(activeTab === 'plano' || activeTab === 'anamnese') && (
              <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                  <SectionCard title="Queixa Principal">
                      <textarea 
                        className="w-full min-h-[100px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7B61FF] focus:outline-none resize-none text-gray-700 bg-white"
                        placeholder="Descreva a queixa principal do paciente..."
                        defaultValue="Paciente relata dor lombar irradiando para a perna direita há 3 semanas."
                      />
                  </SectionCard>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SectionCard title="HMA (História da Moléstia Atual)">
                          <textarea 
                            className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7B61FF] focus:outline-none resize-none text-gray-700 bg-white"
                          />
                      </SectionCard>
                      <SectionCard title="HMP (História da Moléstia Pregressa)">
                          <textarea 
                            className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7B61FF] focus:outline-none resize-none text-gray-700 bg-white"
                          />
                      </SectionCard>
                  </div>
              </div>
            )}
            
            {/* --- DOCUMENTOS --- */}
            {activeTab === 'documentos' && (
               <div className="max-w-4xl mx-auto animate-fadeIn flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <FileUp size={32} className="opacity-50" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-600">Nenhum documento anexado</h3>
                  <button className="mt-6 px-6 py-2 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-50">
                      Upload de Arquivo
                  </button>
              </div>
            )}

            {/* --- Other tabs placeholders --- */}
            {!['dados', 'plano', 'anamnese', 'documentos'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                    <Clipboard size={64} className="mb-4" />
                    <h3 className="text-xl font-bold">Módulo {MENU_ITEMS.find(i => i.id === activeTab)?.label}</h3>
                    <p>Em desenvolvimento...</p>
                </div>
            )}
         </div>
      </main>
    </div>
  );
};

const SectionCard = ({ title, children }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-gray-800 font-bold mb-4 border-b border-gray-100 pb-2">{title}</h3>
        {children}
    </div>
);
