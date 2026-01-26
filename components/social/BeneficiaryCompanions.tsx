import React, { useEffect, useState } from 'react';
import { Users, Plus, Search, Phone, Clock, User, Trash2 } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface BeneficiaryCompanionsProps {
    beneficiaryId: string;
}

const BeneficiaryCompanions: React.FC<BeneficiaryCompanionsProps> = ({ beneficiaryId }) => {
    const [companions, setCompanions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ nome: '', parentesco: '', contato: '' });

    useEffect(() => {
        fetchCompanions();
    }, [beneficiaryId]);

    const fetchCompanions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('acompanhantes')
                .select('*')
                .eq('assistido_id', beneficiaryId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCompanions(data || []);
        } catch (error) {
            console.error('Error fetching companions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('acompanhantes')
                .insert([{ ...formData, assistido_id: beneficiaryId }]);

            if (error) throw error;
            setIsModalOpen(false);
            setFormData({ nome: '', parentesco: '', contato: '' });
            fetchCompanions();
        } catch (error) { alert('Erro ao salvar'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remover este acompanhante?')) return;
        try {
            await supabase.from('acompanhantes').delete().eq('id', id);
            fetchCompanions();
        } catch (e) { alert('Erro'); }
    }

    const filtered = companions.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Acompanhantes</h2>
                    <p className="text-sm text-slate-500">Gerencie contatos e visitas de familiares.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#4f46e5] transition-colors font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                    <Plus size={18} /> Add Acompanhante
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Novo Acompanhante</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                                <input className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-indigo-500" required value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Parentesco</label>
                                <input className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-indigo-500" required value={formData.parentesco} onChange={e => setFormData({ ...formData, parentesco: e.target.value })} placeholder="Ex: Filho(a)" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Contato</label>
                                <input className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-indigo-500" value={formData.contato} onChange={e => setFormData({ ...formData, contato: e.target.value })} placeholder="(00) 00000-0000" />
                            </div>
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 mt-2">Cadastrar Acompanhante</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h3 className="font-bold text-slate-800">Acompanhantes Cadastrados</h3>
                    <div className="relative w-full sm:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-300 transition-colors"
                            placeholder="Buscar por nome..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    {filtered.map(comp => (
                        <div key={comp.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-lg">
                                    {comp.nome.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{comp.nome}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                        <Clock size={12} /> Última visita: {comp.ultima_visita ? new Date(comp.ultima_visita).toLocaleDateString() : '-'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="hidden sm:inline-flex px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100">
                                    {comp.parentesco}
                                </span>
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1 justify-end"><Phone size={12} /> Contato</p>
                                    <p className="text-sm font-semibold text-slate-700">{comp.contato || '-'}</p>
                                </div>
                                <button onClick={() => handleDelete(comp.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {filtered.length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                        <Users size={32} className="mx-auto mb-2 opacity-20" />
                        <p>Nenhum acompanhante encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BeneficiaryCompanions;
