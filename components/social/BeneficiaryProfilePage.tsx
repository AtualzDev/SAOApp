import React, { useEffect, useState } from 'react';
import { User, FileText, Heart, Home, Gavel, History, Users, Shield, Stethoscope, Pill, Wrench, Activity, AlertCircle, ChevronRight, Share2, Printer, Ban, Upload, Camera, Menu, X, Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '../../services/supabase';
import BeneficiaryPersonalData from './BeneficiaryPersonalData';
import BeneficiaryFiles from './BeneficiaryFiles';
import BeneficiaryBenefits from './BeneficiaryBenefits';
import BeneficiaryJudicialization from './BeneficiaryJudicialization';
import BeneficiaryHistory from './BeneficiaryHistory';
import BeneficiaryCompanions from './BeneficiaryCompanions';
import BeneficiaryTreatment from './BeneficiaryTreatment';

interface BeneficiaryProfilePageProps {
    beneficiaryId: string;
}

const BeneficiaryProfilePage: React.FC<BeneficiaryProfilePageProps> = ({ beneficiaryId }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Dados pessoais');

    useEffect(() => {
        fetchBeneficiary();
    }, [beneficiaryId]);

    const fetchBeneficiary = async () => {
        if (!beneficiaryId) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('assistidos')
                .select('*')
                .eq('id', beneficiaryId)
                .single();

            if (error) throw error;
            setData(data);
        } catch (error) {
            console.error('Error fetching beneficiary:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (dateString: string) => {
        if (!dateString) return '';
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-slate-400 font-medium text-sm animate-pulse">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return <div className="p-8 text-center text-slate-500">Beneficiário não encontrado.</div>;
    }

    // --- Layout Components ---
    function SidebarItem({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
        const active = activeTab === label;
        return (
            <button
                onClick={onClick}
                className={`w-full flex items-center gap-4 px-6 py-3.5 text-sm font-medium transition-all duration-300 relative group overflow-hidden ${active
                        ? 'text-white bg-white/10 shadow-inner'
                        : 'text-blue-200 hover:text-white hover:bg-white/5'
                    }`}
            >
                {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                )}
                <div className={`relative z-10 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {icon}
                </div>
                <span className="relative z-10">{label}</span>
                {active && <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent pointer-events-none" />}
            </button>
        );
    }

    const menuItems = [
        { label: 'Dados pessoais', icon: <User size={20} /> },
        { label: 'Arquivos', icon: <FileText size={20} /> },
        { label: 'Benefícios', icon: <Heart size={20} /> },
        { label: 'Doações', icon: <Share2 size={20} /> },
        { label: 'Leitor Digital', icon: <ScanBarcode size={20} /> },
        { label: 'Hospedagem', icon: <Home size={20} /> },
        { label: 'Judicialização', icon: <Gavel size={20} /> },
        { label: 'Histórico', icon: <History size={20} /> },
        { label: 'Acompanhantes', icon: <Users size={20} /> },
        { label: 'Previdência', icon: <Shield size={20} /> },
        { label: 'Tratamento', icon: <Stethoscope size={20} /> },
        { label: 'Medicamentos', icon: <Pill size={20} /> },
        { label: 'Equipamentos', icon: <Wrench size={20} /> },
        { label: 'Reabilitação', icon: <Activity size={20} /> },
        { label: 'Teleatendimento', icon: <Monitor size={20} /> },
        { label: 'Termos', icon: <FileText size={20} /> },
        { label: 'Observações', icon: <AlertCircle size={20} /> },
        { label: 'Desativar', icon: <Ban size={20} /> },
    ];

    function ScanBarcode(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /></svg> }
    function Monitor(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg> }

    return (
        <div className="flex min-h-screen bg-slate-50 font-['Inter'] relative">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0000B3] text-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        flex flex-col h-full
      `}>
                {/* Brand */}
                <div className="p-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black italic tracking-tighter text-white">SAO</h1>
                        <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold mt-1">Gestão inteligente</p>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Menu */}
                <nav className="flex-1 overflow-y-auto custom-scrollbar py-2 space-y-1">
                    {menuItems.map((item, idx) => (
                        <SidebarItem
                            key={idx}
                            icon={item.icon}
                            label={item.label}
                            onClick={() => {
                                setActiveTab(item.label);
                                setIsSidebarOpen(false);
                            }}
                        />
                    ))}
                </nav>

                {/* Footer Sidebar */}
                <div className="p-6 bg-[#000099]/50 backdrop-blur-md border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 flex items-center justify-center text-blue-900 font-bold shadow-lg">
                            S
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Suporte SAO</p>
                            <p className="text-xs text-blue-300">v2.4.0 (Beta)</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 md:ml-72 p-4 md:p-8 lg:p-10 w-full`}>

                {/* Mobile Header Toggle */}
                <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-800">{activeTab}</h2>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2.5 bg-slate-50 text-slate-600 rounded-lg active:scale-95 transition-all"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="hidden md:block mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Ficha do Beneficiário</h2>
                    <p className="text-slate-500 mt-1">Gerencie todas as informações e histórico em um só lugar.</p>
                </div>

                {/* Hero Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 z-10 w-full">
                        <div className="relative group/avatar cursor-pointer">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                {data.foto_url ? (
                                    <img src={data.foto_url} alt={data.nome} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400"><User size={40} /></div>
                                )}
                            </div>
                        </div>

                        <div className="text-center sm:text-left space-y-2 flex-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${data.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                                    {data.status || 'Pendente'}
                                </span>
                                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                    <History size={12} /> Atualizado hoje
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">{data.nome}</h1>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                                <span>{calculateAge(data.data_nascimento) || '-'} anos</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>CPF: {data.cpf || '-'}</span>
                                {data.rg && <>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span>RG: {data.rg}</span>
                                </>}
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full xl:w-auto gap-3 z-10">
                        <button className="flex-1 xl:flex-none px-6 py-3 border border-slate-200 bg-white text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                            <Printer size={18} /> Imprimir
                        </button>
                    </div>
                </div>

                {/* Routed Content */}
                {activeTab === 'Dados pessoais' && (
                    <BeneficiaryPersonalData
                        beneficiaryId={beneficiaryId}
                        data={data}
                        setData={setData}
                        loading={loading}
                        onRefresh={fetchBeneficiary}
                    />
                )}

                {activeTab === 'Arquivos' && (
                    <BeneficiaryFiles beneficiaryId={beneficiaryId} />
                )}

                {activeTab === 'Benefícios' && (
                    <BeneficiaryBenefits
                        beneficiaryId={beneficiaryId}
                        data={data}
                        onRefresh={fetchBeneficiary}
                    />
                )}

                {activeTab === 'Judicialização' && (
                    <BeneficiaryJudicialization
                        beneficiaryId={beneficiaryId}
                        data={data}
                        onRefresh={fetchBeneficiary}
                    />
                )}

                {activeTab === 'Histórico' && (
                    <BeneficiaryHistory beneficiaryId={beneficiaryId} />
                )}

                {activeTab === 'Acompanhantes' && (
                    <BeneficiaryCompanions beneficiaryId={beneficiaryId} />
                )}

                {activeTab === 'Tratamento' && (
                    <BeneficiaryTreatment
                        beneficiaryId={beneficiaryId}
                        data={data}
                        onRefresh={fetchBeneficiary}
                    />
                )}

                {/* Placeholder for others */}
                {!['Dados pessoais', 'Arquivos', 'Benefícios', 'Judicialização', 'Histórico', 'Acompanhantes', 'Tratamento'].includes(activeTab) && (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Em Desenvolvimento</h3>
                        <p className="text-slate-500">A seção <strong>{activeTab}</strong> estará disponível em breve.</p>
                    </div>
                )}

            </main>
        </div>
    );
};

export default BeneficiaryProfilePage;
