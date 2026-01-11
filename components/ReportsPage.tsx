
import React from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  FileText, 
  ChevronRight, 
  Download,
  Info
} from 'lucide-react';

interface ReportItemProps {
  title: string;
  description: string;
  onDownload: (format: 'csv' | 'pdf') => void;
}

const ReportItem: React.FC<ReportItemProps> = ({ title, description, onDownload }) => (
  <div className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0 group">
    <div className="space-y-1">
      <h4 className="text-lg font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{title}</h4>
      <p className="text-sm text-slate-400 font-medium">{description}</p>
    </div>
    <div className="flex items-center gap-3">
      <button 
        onClick={() => onDownload('csv')}
        className="flex flex-col items-center justify-center w-12 h-14 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm group/btn"
        title="Baixar CSV"
      >
        <FileSpreadsheet size={20} className="text-slate-300 group-hover/btn:text-emerald-500 transition-colors" />
        <span className="text-[9px] font-black text-slate-400 group-hover/btn:text-emerald-600 mt-1">CSV</span>
      </button>
      <button 
        onClick={() => onDownload('pdf')}
        className="flex flex-col items-center justify-center w-12 h-14 bg-white border border-slate-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 transition-all shadow-sm group/btn"
        title="Baixar PDF"
      >
        <FileText size={20} className="text-slate-300 group-hover/btn:text-rose-500 transition-colors" />
        <span className="text-[9px] font-black text-slate-400 group-hover/btn:text-rose-600 mt-1">PDF</span>
      </button>
    </div>
  </div>
);

const ReportsPage: React.FC = () => {
  const handleDownload = (name: string, format: 'csv' | 'pdf') => {
    console.log(`Iniciando download do relatório: ${name} em formato ${format.toUpperCase()}`);
    // Simulação de download
    alert(`Gerando arquivo ${format.toUpperCase()} para o relatório: ${name}`);
  };

  const reportSections = [
    {
      category: "Assistidos",
      items: [
        { title: "Dados Pessoais", description: "Dados Cadastrais do Assistido" },
        { title: "Doações Realizadas", description: "Dados de Doações Realizadas" },
        { title: "Hospedagem", description: "Dados de Hospedagem dos Assistidos" },
        { title: "Dados de Saúde", description: "Dados de Saúde do Assistido" },
      ]
    },
    {
      category: "Agenda",
      items: [
        { title: "Agenda", description: "Dados de Agendamento" },
      ]
    },
    {
      category: "Rotas Viagens",
      items: [
        { title: "Rotas de Viagens", description: "Qtd viagens realizadas por períodos por motoristas, carro, nº passageiros (Qtd Asssitidos)" },
      ]
    },
    {
      category: "Estoque",
      items: [
        { title: "Entradas", description: "Dados de tudo que entrou no estoque" },
        { title: "Saídas", description: "Dados de tudo que saiu no estoque" },
      ]
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <BarChart3 size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Relatórios</h1>
        </div>
        <p className="text-sm text-slate-400 font-medium ml-1">Emita o relatório das principais funcionalidades do sistema.</p>
      </div>

      {/* Categories Grid */}
      <div className="space-y-10">
        {reportSections.map((section, idx) => (
          <section key={idx} className="space-y-4 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-center gap-3">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{section.category}:</h3>
               <div className="h-px bg-slate-100 flex-1" />
            </div>
            
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <ReportItem 
                  key={itemIdx}
                  title={item.title}
                  description={item.description}
                  onDownload={(format) => handleDownload(item.title, format)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-[32px] flex items-start gap-4 max-w-3xl">
        <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-blue-900">Privacidade e Auditoria</h4>
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            Todos os relatórios gerados ficam registrados nos logs do sistema por questões de segurança. Certifique-se de tratar dados de assistidos com a devida confidencialidade conforme a LGPD.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
