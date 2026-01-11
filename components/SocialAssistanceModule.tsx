
import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  HandHelping,
  Stethoscope,
  History,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hospital,
  ArrowRight,
  User,
  ShoppingBag,
  Filter,
  Calendar,
  FileText,
  CheckCircle,
  X,
  PlayCircle,
  UserPlus,
  ChevronRight
} from 'lucide-react';
import SocialRequestModal from './SocialRequestModal';
import SocialRequestDetailsModal from './SocialRequestDetailsModal';
import CancelRequestModal from './CancelRequestModal';
import BeneficiaryServiceHubModal from './BeneficiaryServiceHubModal';

export type SubTab = 'visao-geral' | 'solicitacoes' | 'acompanhamento-externo' | 'historico';

interface Request {
  id: string;
  date: string;
  user: string;
  beneficiary: string;
  items: string;
  status: string;
}

interface Beneficiary {
  id: string;
  nome: string;
  status: 'Assistido' | 'Desativado';
  cpf: string;
  contato: string;
}

interface SocialAssistanceModuleProps {
  initialTab?: SubTab;
  onTabChange?: (tab: SubTab) => void;
}

const SocialAssistanceModule: React.FC<SocialAssistanceModuleProps> = ({ initialTab = 'visao-geral', onTabChange }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>(initialTab);
  const [historySearch, setHistorySearch] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isServiceHubOpen, setIsServiceHubOpen] = useState(false);

  const [requestModalMode, setRequestModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  const [requests, setRequests] = useState<Request[]>([
    { id: '1', date: '06/01/2026', user: 'Ana Paula (A.S.)', beneficiary: 'Maria Auxiliadora', items: '2x Cesta Básica, 1x Kit Higiene', status: 'Aguardando' },
    { id: '2', date: '05/01/2026', user: 'Beatriz Lima (A.S.)', beneficiary: 'João Silva', items: '1x Cadeira de Rodas Pro', status: 'Entregue' },
    { id: '3', date: '04/01/2026', user: 'Ana Paula (A.S.)', beneficiary: 'Carlos Mendes', items: '5x Fralda G, 2x Leite Especial', status: 'Em Separação' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Sincroniza o estado interno se a prop initialTab mudar via sidebar
  useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: SubTab) => {
    setActiveSubTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [searchResults, setSearchResults] = useState<Beneficiary[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchBeneficiaries = async () => {
      if (searchTerm.length <= 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Import supabase if not available in this scope, but assumed available or will be added to imports
        // I need to add import { supabase } from '../services/supabase'; if not present
        const { supabase } = await import('../services/supabase');

        const { data, error } = await supabase
          .from('ASSISTIDOS')
          .select('id, nome, cpf, status')
          .or(`nome.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`)
          .limit(5);

        if (data) {
          setSearchResults(data.map(b => ({
            id: b.id.toString(), // Ensure string if bigint
            nome: b.nome,
            status: b.status as 'Assistido' | 'Desativado',
            cpf: b.cpf,
            contato: '' // Contato might not be in the search result selection, can be added if needed
          })));
        }
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      searchBeneficiaries();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setSelectedBeneficiary(b);
    setSearchTerm(b.nome);
    setShowSearchResults(false);
  };

  // ... (rest of functions)

  // In the render return:
  {/* Sugestões de Busca */ }
  {
    showSearchResults && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-[24px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
        <div className="p-2">
          {isSearching && <p className="p-4 text-center text-xs text-slate-400">Buscando...</p>}
          {!isSearching && searchResults.length === 0 && <p className="p-4 text-center text-xs text-slate-400">Nenhum beneficiário encontrado.</p>}

          {searchResults.map((b) => (
            <button
              key={b.id}
              onClick={() => handleSelectBeneficiary(b)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <User size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-700">{b.nome}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">CPF: {b.cpf}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-500" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  const handleStartService = () => {
    setIsServiceHubOpen(true);
  };

  const handleCreateRequest = () => {
    setRequestModalMode('create');
    setIsServiceHubOpen(false);
    setIsRequestModalOpen(true);
  };

  const handleEditRequest = () => {
    setRequestModalMode('edit');
    setIsDetailsModalOpen(false);
    setIsRequestModalOpen(true);
  };

  const handleCancelRequest = () => {
    setIsDetailsModalOpen(false);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = (reason: string) => {
    if (selectedRequest) {
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Cancelado' } : r));
      setCancelFeedback(`A solicitação #${selectedRequest.id.padStart(4, '0')} de ${selectedRequest.beneficiary} foi cancelada com sucesso.`);
    }
    setIsCancelModalOpen(false);
  };

  const handleSaveRequest = (data: any) => {
    setIsRequestModalOpen(false);
  };

  const handleViewDetails = (req: Request) => {
    setSelectedRequest(req);
    setIsDetailsModalOpen(true);
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl"><HandHelping size={24} /></div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Solicitações</p>
              <h3 className="text-2xl font-black text-slate-800">{requests.filter(r => r.status !== 'Cancelado').length}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-pink-600 bg-pink-50/50 p-2 rounded-lg"><AlertCircle size={14} /> 4 aguardando liberação do estoque</div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Hospital size={24} /></div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Externos</p>
              <h3 className="text-2xl font-black text-slate-800">08</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50/50 p-2 rounded-lg"><Clock size={14} /> 2 altas previstas para hoje</div>
        </div>
        <div className="bg-[#1E40AF] p-6 rounded-[32px] shadow-xl shadow-blue-200 text-white">
          <h4 className="font-bold text-sm mb-2">Meta de Atendimento</h4>
          <div className="flex justify-between items-end mb-2"><span className="text-3xl font-black">85%</span><span className="text-[10px] font-bold uppercase opacity-60">Mensal</span></div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden"><div className="bg-white h-full w-[85%] rounded-full" /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800">Linha do Tempo Social</h2>
            <button onClick={() => handleTabChange('historico')} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline group">Ver histórico completo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
          </div>
          <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {[
              { type: 'donation', user: 'Maria das Graças', desc: 'Recebeu Cesta Básica e Kit Higiene', time: '10:30', icon: <ShoppingBag size={14} />, color: 'bg-emerald-500' },
              { type: 'hospital', user: 'João Silva', desc: 'Internado no Hospital Santa Casa (Quarto 402)', time: '09:15', icon: <Hospital size={14} />, color: 'bg-blue-500' },
              { type: 'visit', user: 'Francisca Lima', desc: 'Visita domiciliar realizada pela Assistente Social', time: 'Ontem', icon: <User size={14} />, color: 'bg-indigo-500' },
            ].map((item, i) => (
              <div key={i} className="relative pl-12">
                <div className={`absolute left-0 top-1 w-10 h-10 rounded-full ${item.color} text-white flex items-center justify-center border-4 border-white shadow-sm z-10`}>{item.icon}</div>
                <div><div className="flex items-center justify-between"><h4 className="text-sm font-bold text-slate-700">{item.user}</h4><span className="text-[10px] font-bold text-slate-400 uppercase">{item.time}</span></div><p className="text-xs text-slate-500 mt-1 font-medium">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px]">
            <h3 className="text-rose-800 font-bold text-sm mb-4 flex items-center gap-2"><AlertCircle size={18} /> Prioridade Alta</h3>
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-rose-100"><p className="text-[11px] font-bold text-slate-800">Renata Oliveira</p><p className="text-[10px] text-rose-600 mt-1">Solicitação de cadeira de rodas urgente.</p></div>
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-rose-100"><p className="text-[11px] font-bold text-slate-800">Antônio José</p><p className="text-[10px] text-rose-600 mt-1">Vencimento de laudo social em 2 dias.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Solicitações de Itens</h2>
          <p className="text-sm text-slate-400 font-medium">Itens solicitados ao estoque para doação</p>
        </div>
        <button onClick={handleCreateRequest} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
          <Plus size={18} /> Nova Solicitação
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-4">SOLICITANTE / DATA</th>
              <th className="px-8 py-4">ASSISTIDO BENEFICIADO</th>
              <th className="px-8 py-4">ITENS SOLICITADOS</th>
              <th className="px-8 py-4">STATUS ESTOQUE</th>
              <th className="px-8 py-4 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5"><div className="flex flex-col"><span className="text-sm font-bold text-slate-700">{req.user}</span><span className="text-[10px] text-slate-400 font-medium">{req.date}</span></div></td>
                <td className="px-8 py-5 text-sm font-semibold text-slate-600">{req.beneficiary}</td>
                <td className="px-8 py-5 text-xs text-slate-500 font-medium max-w-xs">{req.items}</td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${req.status === 'Entregue' ? 'bg-emerald-100 text-emerald-600' :
                    req.status === 'Cancelado' ? 'bg-rose-100 text-rose-600' :
                      req.status === 'Aguardando' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>{req.status}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => handleViewDetails(req)} className="text-blue-600 font-bold text-xs hover:underline decoration-2 underline-offset-4">Ver Detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full relative">
      {/* Toast Feedback */}
      {cancelFeedback && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#1E40AF] text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-blue-400/30">
            <div className="bg-white/20 p-2 rounded-xl"><CheckCircle size={20} className="text-emerald-400" /></div>
            <div><p className="text-sm font-black tracking-tight">Solicitação Cancelada</p><p className="text-[10px] font-medium text-blue-100">{cancelFeedback}</p></div>
            <button onClick={() => setCancelFeedback(null)} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-all"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#1E40AF] text-white rounded-2xl shadow-lg shadow-blue-500/20"><HeartHandshake size={32} /></div>
          <div><h1 className="text-3xl font-black text-slate-800 tracking-tight">Assistência Social</h1><p className="text-sm text-slate-400 font-medium">Gestão humana, acolhimento e impacto social</p></div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner overflow-x-auto scrollbar-hide">
          <button onClick={() => handleTabChange('visao-geral')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeSubTab === 'visao-geral' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Visão Geral</button>
          <button onClick={() => handleTabChange('historico')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeSubTab === 'historico' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Histórico</button>
          <button onClick={() => handleTabChange('solicitacoes')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeSubTab === 'solicitacoes' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Solicitações</button>
          <button onClick={() => handleTabChange('acompanhamento-externo')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeSubTab === 'acompanhamento-externo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Acompanhamento</button>
        </div>
      </div>

      {/* Busca e Iniciar Atendimento */}
      <div className="space-y-6">
        <div className="relative max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar assistido para ver prontuário social..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchResults(e.target.value.length > 2);
              }}
              className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
            />
          </div>

          {/* Sugestões de Busca */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-[24px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-2">
                {searchResults.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelectBeneficiary(b)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-700">{b.nome}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">CPF: {b.cpf}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card do Assistido Selecionado com Botão Iniciar */}
        {selectedBeneficiary && (
          <div className="max-w-4xl bg-white p-6 rounded-[32px] border border-blue-100 shadow-xl shadow-blue-500/5 animate-in slide-in-from-left-4 duration-500 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[20px] flex items-center justify-center border border-blue-100">
                <User size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">{selectedBeneficiary.nome}</h3>
                <div className="flex items-center gap-4 mt-0.5">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">CPF: {selectedBeneficiary.cpf}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span className="text-xs text-blue-600 font-bold uppercase tracking-widest">{selectedBeneficiary.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setSelectedBeneficiary(null)}
                className="p-4 text-slate-400 hover:text-rose-500 bg-slate-50 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
              <button
                onClick={handleStartService}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-[#1E40AF] text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-95"
              >
                <UserPlus size={20} /> Iniciar Atendimento
              </button>
            </div>
          </div>
        )}
      </div>

      {activeSubTab === 'visao-geral' && renderOverview()}
      {activeSubTab === 'solicitacoes' && renderRequests()}

      {/* Fallback de telas vazias */}
      {(activeSubTab === 'acompanhamento-externo' || activeSubTab === 'historico') && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center">
          {activeSubTab === 'historico' ? <History size={48} className="text-slate-200 mb-4" /> : <Clock size={48} className="text-slate-200 mb-4" />}
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Carregando informações...</p>
        </div>
      )}

      {/* Modais de Fluxo */}
      <SocialRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSave={handleSaveRequest}
        mode={requestModalMode}
        initialData={selectedRequest}
      />

      <SocialRequestDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={handleEditRequest}
        onCancel={handleCancelRequest}
        request={selectedRequest}
      />

      <CancelRequestModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        requestId={selectedRequest?.id || ''}
      />

      <BeneficiaryServiceHubModal
        isOpen={isServiceHubOpen}
        onClose={() => setIsServiceHubOpen(false)}
        beneficiary={selectedBeneficiary}
        onNewRequest={handleCreateRequest}
        onViewHistory={() => {
          setIsServiceHubOpen(false);
          handleTabChange('historico');
        }}
        onSchedule={() => {
          setIsServiceHubOpen(false);
          // Redirecionar para agenda ou abrir modal de agendamento (futuro)
          alert('Redirecionando para Agenda...');
        }}
      />
    </div>
  );
};

export default SocialAssistanceModule;
