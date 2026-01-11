
import React, { useState } from 'react';
import { SIDEBAR_ITEMS } from '../constants';
import { 
  ChevronRight, 
  ChevronDown, 
  LogOut, 
  ChevronLeft, 
  Settings,
  BarChart3,
  CircleDollarSign,
  CreditCard,
  Building2,
  Users2,
  Headphones
} from 'lucide-react';

interface SidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
  isManagementMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeId, onSelect, isManagementMode = false }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Itens do menu para o modo Super Admin (Gestor)
  const managementItems = [
    { id: 'gestor-painel', label: 'Painel geral', icon: <BarChart3 size={20} /> },
    { id: 'gestor-financeiro', label: 'Financeiro', icon: <CircleDollarSign size={20} /> },
    { id: 'gestor-assinaturas', label: 'Assinaturas e Planos', icon: <CreditCard size={20} /> },
    { id: 'gestor-ongs', label: 'Ongs', icon: <Building2 size={20} /> },
    { id: 'gestor-leads', label: 'Leads', icon: <Users2 size={20} /> },
    { id: 'gestor-suporte', label: 'Suporte', icon: <Headphones size={20} /> },
  ];

  // Filtra itens normais ou usa os de gestão
  const mainItems = isManagementMode 
    ? managementItems 
    : SIDEBAR_ITEMS.filter(item => !['gestor', 'notificacao', 'configuracoes', 'perfil'].includes(item.id));

  const bottomItems = SIDEBAR_ITEMS.filter(item => ['gestor', 'notificacao', 'configuracoes'].includes(item.id));

  const renderItem = (item: any) => {
    const isExpanded = expandedItems.includes(item.id);
    
    // Lógica especial de active para o item 'gestor'
    let isActive = activeId === item.id || item.children?.some((child: any) => child.id === activeId);
    if (item.id === 'gestor' && isManagementMode) {
      isActive = true;
    }

    return (
      <div key={item.id} className="px-3 mb-1">
        <button
          onClick={() => {
            if (item.children) {
              toggleExpand(item.id);
            } else {
              onSelect(item.id);
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 transition-all rounded-full ${
            isActive 
              ? 'bg-white text-[#1E40AF] font-bold shadow-md' 
              : 'hover:bg-white/10 text-white'
          }`}
        >
          <span className={`${isActive ? 'text-[#1E40AF]' : 'text-white'}`}>{item.icon}</span>
          {!isCollapsed && <span className="flex-1 text-left text-sm whitespace-nowrap">{item.label}</span>}
          {!isCollapsed && item.children && (
            <span className="opacity-60">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          {!isCollapsed && item.badge !== undefined && (
            <span className="bg-white text-[#1E40AF] px-2.5 py-0.5 rounded-lg text-sm font-bold min-w-[28px] text-center shadow-sm">
              {item.badge}
            </span>
          )}
        </button>

        {!isCollapsed && item.children && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children.map((child: any) => (
              <button
                key={child.id}
                onClick={() => onSelect(child.id)}
                className={`w-full flex items-center gap-3 pl-11 pr-4 py-2 transition-all text-xs rounded-full ${
                  activeId === child.id 
                    ? 'bg-white/20 text-white font-bold' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside 
      className={`bg-[#1E40AF] text-white flex flex-col h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'} shadow-xl z-20 sticky top-0`}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img 
              src="https://8e64ecf99bf75c711a4b8d5b4c2fec92.cdn.bubble.io/f1716321160796x918234636571374700/Logo-Primario.svg" 
              alt="SAO Logo" 
              className="h-10 w-auto brightness-0 invert" 
            />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors border border-white/20"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {mainItems.map(renderItem)}
      </nav>

      <div className="py-2">
        {bottomItems.map(renderItem)}
      </div>

      <div className="px-5">
        <hr className="border-white/20 mb-4" />
      </div>

      <div className="p-4 pt-0">
        <div 
          onClick={() => onSelect('perfil')}
          className={`flex items-center gap-3 cursor-pointer group hover:bg-white/10 p-2 rounded-[20px] transition-all ${isCollapsed ? 'justify-center' : ''} ${activeId === 'perfil' ? 'bg-white/20' : ''}`}
        >
          <div className="relative">
             <div className="w-12 h-12 rounded-full bg-slate-400 flex-shrink-0 border-2 border-white/20 overflow-hidden shadow-sm group-hover:border-white transition-all">
                <img src="https://picsum.photos/seed/isaque/100/100" alt="User Profile" />
             </div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate leading-tight group-hover:text-blue-200 transition-colors">Isaque Putumuju</p>
              <p className="text-xs text-white/50 truncate font-medium">Gestor ONG</p>
            </div>
          )}
          {!isCollapsed && (
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white/50 group-hover:text-white">
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
