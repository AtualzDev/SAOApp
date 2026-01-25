
import React, { useState, useEffect } from 'react';
import { Search, Filter, Pencil, Trash2, LayoutGrid, Utensils, Shirt, PencilRuler, Heart, Box, Briefcase, Coffee, Archive } from 'lucide-react';
import { inventoryService, Category } from '../../services/inventoryService';
import DeleteConfirmModal from './DeleteConfirmModal';
import CategoryForm from './CategoryForm';

// Helper para gerar visual consistente baseado no setor ou nome
const getCategoryVisuals = (name: string, sector: string) => {
  const nameLower = name.toLowerCase();
  const sectorLower = (sector || '').toLowerCase();

  if (nameLower.includes('ali') || sectorLower.includes('cozinha')) return { color: 'bg-amber-500', icon: <Utensils size={18} /> };
  if (nameLower.includes('roup') || nameLower.includes('vest') || sectorLower.includes('bazar')) return { color: 'bg-indigo-500', icon: <Shirt size={18} /> };
  if (nameLower.includes('escrit') || sectorLower.includes('admin')) return { color: 'bg-blue-500', icon: <PencilRuler size={18} /> };
  if (nameLower.includes('hig') || nameLower.includes('limp')) return { color: 'bg-emerald-500', icon: <Heart size={18} /> };
  if (nameLower.includes('saud') || nameLower.includes('enf')) return { color: 'bg-rose-500', icon: <LayoutGrid size={18} /> };

  // Defaults baseados em hash simples do nome para consistência
  const colors = ['bg-cyan-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-lime-500'];
  const icons = [<Box size={18} />, <Briefcase size={18} />, <Coffee size={18} />, <Archive size={18} />];

  const hash = name.length % colors.length;
  return { color: colors[hash], icon: icons[hash] };
};

const CategoryTable: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategories, setActiveCategories] = useState<Category[]>([]); // Categorias filtradas
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Controle de Modais
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; category: Category | null }>({
    isOpen: false,
    category: null
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
    setCurrentPage(1); // Resetar para primeira página ao filtrar
  }, [searchTerm, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.listCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    if (!searchTerm) {
      setActiveCategories(categories);
      return;
    }
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = categories.filter(cat =>
      cat.nome.toLowerCase().includes(lowerTerm) ||
      (cat.setor && cat.setor.toLowerCase().includes(lowerTerm))
    );
    setActiveCategories(filtered);
  };

  // Lógica de Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activeCategories.length / itemsPerPage);

  const handleDeleteClick = (category: Category) => {
    setDeleteModal({ isOpen: true, category });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.category) return;

    try {
      await inventoryService.deleteCategory(deleteModal.category.id);
      setDeleteModal({ isOpen: false, category: null });
      loadCategories(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria');
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
  };

  const handleEditSave = () => {
    setEditingCategory(null);
    loadCategories(); // Recarrega após edição
  };

  // Se estiver editando, mostra o form de edição (reusando CategoryForm)
  if (editingCategory) {
    return (
      <CategoryForm
        onCancel={() => setEditingCategory(null)}
        initialData={editingCategory}
        onSuccess={handleEditSave}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-700">Categorias de Estoque</h2>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
            {activeCategories.length} categorias
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
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
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">IDENTIFICAÇÃO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SETOR RELACIONADO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">QTD. DE ITENS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  Carregando categorias...
                </td>
              </tr>
            ) : activeCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            ) : (
              currentItems.map((cat) => {
                const visual = getCategoryVisuals(cat.nome, cat.setor || '');
                return (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${visual.color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                          {visual.icon}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-700 block">{cat.nome}</span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ID: #{cat.id.substring(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">
                        {cat.setor || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">0</span>
                        <span className="text-[10px] text-slate-400 font-medium italic">itens ativos</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-600">
                        Ativa
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(cat)}
                          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
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

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        productName={deleteModal.category?.nome || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, category: null })}
      />

      {/* Paginação e Remoção do Rodapé antigo */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, activeCategories.length)} de {activeCategories.length} categorias
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-xs font-bold text-slate-600">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;

