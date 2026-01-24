
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Pencil, Trash2, AlertTriangle, PackageCheck, PackageX } from 'lucide-react';
import { inventoryService, Product } from '../../services/inventoryService';

interface ProductTableProps {
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ onEdit, onView }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.listProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      alert('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await inventoryService.deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto. Verifique se não há lançamentos associados.');
    }
  };

  const getStockStatus = (estoque: number, minimo: number) => {
    if (estoque === 0) return { label: 'ESGOTADO', color: 'bg-rose-100 text-rose-600', icon: <PackageX size={14} /> };
    if (estoque <= minimo) return { label: 'CRÍTICO', color: 'bg-amber-100 text-amber-600', icon: <AlertTriangle size={14} /> };
    return { label: 'EM ESTOQUE', color: 'bg-emerald-100 text-emerald-600', icon: <PackageCheck size={14} /> };
  };

  const filteredProducts = products.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.codigo && p.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-700">Catálogo de Produtos</h2>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
            {filteredProducts.length} itens
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
            Filtrar <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">PRODUTO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CATEGORIA</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ESTOQUE ATUAL</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">UNIDADE</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  Carregando produtos...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  Nenhum produto encontrado
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const status = getStockStatus(product.estoque_atual, product.estoque_minimo || 0);
                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{product.nome}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{product.codigo || 'S/CÓDIGO'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {product.categoria || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{product.estoque_atual}</span>
                        <span className="text-[10px] text-slate-400 font-medium">mín: {product.estoque_minimo || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{product.unidade_medida || 'UN'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {onView && (
                          <button
                            onClick={() => onView(product)}
                            className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Visualizar"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(product)}
                            className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
        <p className="text-xs text-slate-400 font-medium">Página 1 de 1</p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-400 disabled:opacity-30" disabled>Anterior</button>
          <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white transition-colors">Próximo</button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
