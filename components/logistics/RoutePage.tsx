
import React, { useState } from 'react';
import { Car, Plus, MapPin } from 'lucide-react';
import RouteTable, { RouteData } from './RouteTable';
import RouteForm from './RouteForm';

const RoutePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [routes, setRoutes] = useState<RouteData[]>([
    { id: 'PVAM5H', dataHora: '09/05/2025', motorista: '', status: 'Pendente', contato: '' },
    { id: '86ZJQQ', dataHora: '23/04/2025', motorista: 'Daniel Luiz', status: 'Pendente', contato: '31992771839' },
    { id: 'MGRRYE', dataHora: '23/04/2025', motorista: '', status: 'Pendente', contato: '' },
    { id: 'TBFMOD', dataHora: '23/04/2025', motorista: 'Renata - Teste', status: 'Pendente', contato: '31988889202' },
    { id: 'F3U737', dataHora: '23/04/2025', motorista: 'Renata - Teste', status: 'Pendente', contato: '31988889202' },
    { id: 'YG5KAD', dataHora: '23/04/2025', motorista: 'Renata - Teste', status: 'Pendente', contato: '31988889202' },
    { id: 'WZTI2Y', dataHora: '23/04/2025', motorista: 'Renata - Teste', status: 'Pendente', contato: '31988889202' },
  ]);

  const handleDelete = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  };

  if (isFormOpen) {
    return <RouteForm onCancel={() => setIsFormOpen(false)} onSave={() => setIsFormOpen(false)} />;
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Rotas de Viagem</h1>
          <p className="text-sm text-slate-400 font-medium">Gestão de transporte para atendimentos e entregas.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-[#1E40AF] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-800 transition-all flex items-center gap-2 text-sm">
            <Car size={20} /> Lista de passageiros
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
            title="Nova Rota"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RouteTable 
          routes={routes} 
          onEdit={() => {}} 
          onDelete={handleDelete}
          onViewPassagers={() => {}}
        />
      </div>

      {/* Nota sobre disponibilidade */}
      <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl max-w-2xl">
        <MapPin size={18} className="text-[#1E40AF]" />
        <p className="text-xs text-indigo-700 font-medium leading-relaxed">
          As rotas são criadas automaticamente com base nos agendamentos confirmados do dia. Verifique a disponibilidade dos veículos antes de finalizar.
        </p>
      </div>
    </div>
  );
};

export default RoutePage;
