
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
