
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MapPin, 
  BarChart3, 
  Package, 
  HeartHandshake, 
  ShieldCheck, 
  Bell, 
  Settings, 
  LogOut,
  PlusCircle,
  PackagePlus,
  PackageMinus,
  Layers,
  Map,
  ClipboardList,
  History,
  Activity
} from 'lucide-react';
import { Launch, SidebarItem } from './types';

export const MOCK_LAUNCHES: Launch[] = [
  { codigo: "#2YSJDZYE", recebimento: "15/08/25", fornecedor: "ENTRE AMIGOS", notaFiscal: "0", tipo: "Doação" },
  { codigo: "#TYZ4AWW0", recebimento: "14/09/25", fornecedor: "MAXILONA", notaFiscal: "Sem nota", tipo: "Doação" },
  { codigo: "#VS80POYE", recebimento: "27/10/21", fornecedor: "ENTRE AMIGOS", notaFiscal: "Sem nota", tipo: "Doação" },
  { codigo: "#KYFXIGPO", recebimento: "27/10/25", fornecedor: "Capec", notaFiscal: "Sem nota", tipo: "Doação" },
  { codigo: "#J79F8FD6", recebimento: "27/10/25", fornecedor: "Capec", notaFiscal: "Sem nota", tipo: "Doação" },
  { codigo: "#33OP6IUL", recebimento: "27/10/25", fornecedor: "Capec", notaFiscal: "Sem nota", tipo: "Doação" },
  { codigo: "#SQ7AK85B", recebimento: "27/10/25", fornecedor: "Capec", notaFiscal: "Sem nota", tipo: "Doação" },
  { codigo: "#HM2BKRBU", recebimento: "27/10/25", fornecedor: "ENTRE AMIGOS", notaFiscal: "Sem nota", tipo: "Doação" },
  { codigo: "#SV0M193E", recebimento: "27/10/25", fornecedor: "Capec", notaFiscal: "Sem nota", tipo: "Compra" },
  { codigo: "#SZ2XOOHJ", recebimento: "08/10/25", fornecedor: "ENTRE AMIGOS", notaFiscal: "Sem nota", tipo: "Doação" },
  { codigo: "#XXVGULK8", recebimento: "14/03/25", fornecedor: "RODARTE CONSULTORIA E SEGURIDADE LTDA", notaFiscal: "327687", tipo: "Doação" },
  { codigo: "#VLZ9OFAL", recebimento: "14/03/25", fornecedor: "RODARTE CONSULTORIA E SEGURIDADE LTDA", notaFiscal: "327687", tipo: "Doação" },
  { codigo: "#7OZ5VXUA", recebimento: "14/03/25", fornecedor: "RODARTE CONSULTORIA E SEGURIDADE LTDA", notaFiscal: "327687", tipo: "Doação" },
  { codigo: "#BULIL5GI", recebimento: "11/03/25", fornecedor: "Roberta Mendonça", notaFiscal: "51280", tipo: "Doação" },
];

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'inicio', label: 'Início', icon: <LayoutDashboard size={20} />, path: '/' },
  { id: 'assistidos', label: 'Assistidos', icon: <Users size={20} />, path: '/assistidos' },
  { id: 'agenda', label: 'Agenda', icon: <Calendar size={20} />, path: '/agenda' },
  { id: 'rotas', label: 'Rotas de Atendimento', icon: <MapPin size={20} />, path: '/rotas' },
  { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 size={20} />, path: '/relatorios' },
  { 
    id: 'estoque', 
    label: 'Estoque', 
    icon: <Package size={20} />, 
    path: '/estoque',
    children: [
      { id: 'estoque-visao-geral', label: 'Visão Geral', icon: <LayoutDashboard size={18} />, path: '/estoque/visao-geral' },
      { id: 'entradas', label: 'Entradas', icon: <PackagePlus size={18} />, path: '/estoque/entradas' },
      { id: 'produtos', label: 'Produtos/Itens', icon: <Layers size={18} />, path: '/estoque/produtos' },
      { id: 'saidas', label: 'Saídas', icon: <PackageMinus size={18} />, path: '/estoque/saidas' },
      { id: 'categorias', label: 'Categorias', icon: <ClipboardList size={18} />, path: '/estoque/categorias' },
      { id: 'setores', label: 'Setores', icon: <Map size={18} />, path: '/estoque/setores' },
      { id: 'auditoria', label: 'Auditoria', icon: <ShieldCheck size={18} />, path: '/estoque/auditoria' },
    ]
  },
  { 
    id: 'assistencia', 
    label: 'Assistência Social', 
    icon: <HeartHandshake size={20} />, 
    path: '/assistencia',
    children: [
      { id: 'soc-visao-geral', label: 'Visão Geral', icon: <LayoutDashboard size={18} />, path: '/assistencia/visao-geral' },
      { id: 'soc-historico', label: 'Histórico', icon: <History size={18} />, path: '/assistencia/historico' },
      { id: 'soc-solicitacoes', label: 'Solicitações', icon: <ClipboardList size={18} />, path: '/assistencia/solicitacoes' },
      { id: 'soc-acompanhamento', label: 'Acompanhamento', icon: <Activity size={18} />, path: '/assistencia/acompanhamento' },
    ]
  },
  { id: 'gestor', label: 'Gestor', icon: <ShieldCheck size={20} />, path: '/gestor' },
  { id: 'notificacao', label: 'Notificação', icon: <Bell size={20} />, path: '/notificacao', badge: 0 },
  { id: 'configuracoes', label: 'Configurações', icon: <Settings size={20} />, path: '/configuracoes' },
];
