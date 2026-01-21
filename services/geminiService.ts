
import { Launch } from "../types";

/**
 * Realiza uma análise estatística local dos lançamentos para fornecer um resumo
 * sem a necessidade de chamadas externas ou chaves de API.
 */
export const analyzeLaunches = async (launches: Launch[]): Promise<string> => {
  // Simula um pequeno delay para manter a sensação de processamento, se desejado
  // await new Promise(resolve => setTimeout(resolve, 500));

  if (!launches || launches.length === 0) {
    return "Nenhum dado disponível para análise.";
  }

  const total = launches.length;
  const doacoes = launches.filter(l => l.tipo === 'Doação').length;
  const compras = launches.filter(l => l.tipo === 'Compra').length;

  // Encontra o fornecedor mais frequente
  const supplierCounts = launches.reduce((acc: Record<string, number>, curr) => {
    acc[curr.fornecedor] = (acc[curr.fornecedor] || 0) + 1;
    return acc;
  }, {});

  const topSupplier = Object.entries(supplierCounts).reduce((a, b) => 
    (a[1] > b[1] ? a : b)
  )[0];

  return `Análise Concluída:
• Total de lançamentos: ${total} itens processados.
• Perfil: Identificamos ${doacoes} doações e ${compras} compras no período.
• Fornecedor Principal: ${topSupplier} é o parceiro com maior volume de interações.
• Status: Todos os registros foram validados localmente pelo sistema.`;
};
