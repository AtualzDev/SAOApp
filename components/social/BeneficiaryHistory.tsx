import React, { useEffect, useState } from 'react';
import { History, Plus, Calendar, User, Trash2, Edit2, Save } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface BeneficiaryHistoryProps {
    beneficiaryId: string;
}

const BeneficiaryHistory: React.FC<BeneficiaryHistoryProps> = ({ beneficiaryId }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
    }, [beneficiaryId]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('timeline_social')
                .select('*')
                .eq('assistido_id', beneficiaryId)
                .order('data_evento', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('timeline_social')
                    .update({ titulo: title, conteudo: content })
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('timeline_social')
                    .insert([{ assistido_id: beneficiaryId, titulo: title, conteudo: content }]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            resetForm();
            fetchHistory();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar histórico');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este registro?')) return;
        try {
            const { error } = await supabase.from('timeline_social').delete().eq('id', id);
            if (error) throw error;
            fetchHistory();
        } catch (error) { alert('Erro ao excluir'); }
    };

    const handleEdit = (event: any) => {
        setTitle(event.titulo);
        setContent(event.conteudo);
        setEditingId(event.id);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setEditingId(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Histórico Social</h2>
                    <p className="text-sm text-slate-500">Linha do tempo de atendimentos e evoluções.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={18} /> Novo Histórico
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">{editingId ? 'Editar Registro' : 'Novo Registro'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Título / Assunto</label>
                                <input
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Ex: Relato de Atendimento Social - CAPEC"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Relato Detalhado</label>
                                <textarea
                                    className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 resize-none leading-relaxed"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Descreva os detalhes do atendimento..."
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:bg-slate-50 rounded-lg font-bold text-sm">Cancelar</button>
                                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20">Salvar Registro</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 min-h-[400px]">
                <h3 className="text-lg font-bold text-slate-800 mb-8 pb-4 border-b border-slate-50">Linha do Tempo Social</h3>

                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {events.map((evt) => (
                        <div key={evt.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Dot */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <History size={18} />
                            </div>

                            {/* Content Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">Social</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(evt)} className="p-1 hover:bg-white rounded text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(evt.id)} className="p-1 hover:bg-white rounded text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>

                                <h4 className="font-bold text-slate-800 mb-2 text-base">{evt.titulo}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{evt.conteudo}</p>

                                <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center gap-4 text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(evt.data_evento).toLocaleDateString()} às {new Date(evt.data_evento).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="flex items-center gap-1"><User size={12} /> Admin</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {events.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            <p>Nenhum registro encontrado no histórico.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryHistory;
