
// Add React import to provide access to the React namespace for types like ReactNode
import React from 'react';

export interface Launch {
  codigo: string;
  recebimento: string;
  fornecedor: string;
  notaFiscal: string;
  tipo: 'Doação' | 'Compra';
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: SidebarItem[];
}

export interface CalendarEvent {
  id: string;
  time: string;
  patientName: string;
  color: string;
  procedure?: string;
  complaint?: string;
  sessionNumber?: number;
  totalSessions?: number;
  status?: 'realizado' | 'pendente' | 'cancelado' | 'confirmado';
  date?: Date;
  isMore?: boolean;
  moreCount?: number;
}

export interface DayData {
  day: number;
  month: 'prev' | 'current' | 'next';
  events: CalendarEvent[];
  dateObj: Date;
  isToday?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  secondaryInfo?: string;
  lastVisit?: string;
  status: string;
  image?: string;
}

export type ProcedureType = 'individual' | 'pacote' | 'mensal';

export interface Procedure {
  id: string;
  name: string;
  price: number;
  type: string;
  colorClass: string;
  customColor: string;
  description: string;
  professionalPercentage: number;
  sessions?: number;
}

export interface Evaluation {
  id: string;
  patientName: string;
  date: string;
  type: string;
  status: string;
  professional: string;
}
