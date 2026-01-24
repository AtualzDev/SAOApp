
import React, { useState } from 'react';
import { MapPin, User, Car, Clock, Plus, X, Search, CheckCircle2 } from 'lucide-react';

interface RouteFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

const RouteForm: React.FC<RouteFormProps> = ({ onCancel, onSave }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  
  // Mock de agendamentos do dia para vincular à rota
  const dailyAppointments = [
    { id: '1', nome: 'Maria Auxiliadora', servico: 'Cesta Básica', bairro: 'Centro' },
    { id: '2', nome: 'João Pereira', servico: 'Atendimento Social', bairro: 'Vila Norte' },
    { id: '3', nome: 'Francisca Lima', servico: 'Medicamentos', bairro: 'Santa Luzia' },
  ];

  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const togglePatient = (id: string) => {
    setSelectedPatients(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#1E40AF] rounded-2xl">
            <Car size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Configurar Nova Rota</h1>
            <p className="text-sm text-slate-400 font-medium">Vincule motorista, veículo e assistidos para hoje.</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Configurações */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-blue-500" /> Logística da Rota
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-600">Motorista Responsável</label>
                <select 
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-blue-400 transition-all cursor-pointer"
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                >
                  <option value="">Selecione um motorista</option>
                  <option value="Carlos Silva">Carlos Silva</option>
                  <option value="Renata - Teste">Renata - Teste</option>
                  <option value="Daniel Luiz">Daniel Luiz</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-600">Veículo Disponível</label>
                <select 
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-blue-400 transition-all cursor-pointer"
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                >
                  <option value="">Selecione um veículo</option>
                  <option value="Van 01 (12 Lugares)">Van 01 (12 Lugares)</option>
                  <option value="Fiat Argo (4 Lugares)">Fiat Argo (4 Lugares)</option>
                  <option value="Kombi (9 Lugares)">Kombi (9 Lugares)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Data e Hora de Saída</label>
              <input 
                type="datetime-local" 
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={16} className="text-blue-500" /> Agendamentos Pendentes (Hoje)
              </h3>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Sincronizado com Agenda</span>
            </div>

            <div className="space-y-3">
              {dailyAppointments.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => togglePatient(app.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPatients.includes(app.id) 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedPatients.includes(app.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'
                    }`}>
                      {selectedPatients.includes(app.id) && <CheckCircle2 size={14} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{app.nome}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{app.servico} • {app.bairro}</p>
                    </div>
                  </div>
                  <MapPin size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Resumo */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Resumo da Rota</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Motorista</span>
                 <span className="text-sm font-bold">{selectedDriver || '--'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Passageiros</span>
                 <span className="text-sm font-bold">{selectedPatients.length} Assistidos</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status Inicial</span>
                 <span className="bg-[#FFB932] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Pendente</span>
              </div>
            </div>
            <Car size={120} className="absolute -bottom-8 -right-8 text-white/5 -rotate-12" />
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-[32px]">
            <h4 className="text-blue-800 font-bold text-sm mb-2">Dica de Logística</h4>
            <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
              Ao selecionar assistidos do mesmo bairro, o sistema otimiza o tempo de deslocamento do motorista. Certifique-se de que a capacidade do veículo atende ao número de passageiros.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <button 
          onClick={onCancel}
          className="px-10 py-3 text-slate-400 font-bold hover:text-slate-600 transition-all"
        >
          Cancelar
        </button>
        <button 
          onClick={() => onSave({})}
          className="px-14 py-3 bg-[#1E40AF] text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-95 flex items-center gap-2"
        >
          Finalizar Rota <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default RouteForm;
