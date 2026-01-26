import React, { useState, useEffect } from 'react';
import { Pencil, Plus, Trash2, Save, X, FileText, Check, Search, PackageMinus, MapPin, User, FileWarning } from 'lucide-react';
import UnitSelectionModal from './UnitSelectionModal';
import AddCategoryModal from './AddCategoryModal';
import SupplierSelectionModal from './SupplierSelectionModal';
import ProductSearchInput from './ProductSearchInput';
import AddSimpleModal from './AddSimpleModal';
import Toast from '../common/Toast';
import { inventoryService, Product, Transaction } from '../../services/inventoryService';

interface ExitFormProps {
  onCancel: () => void;
  initialData?: Transaction | null;
}

const ExitForm: React.FC<ExitFormProps> = ({ onCancel, initialData }) => {
  const [launchId] = useState(() => initialData ? '#' + initialData.id.slice(0, 8).toUpperCase() : 'OUT' + Math.random().toString(36).substr(2, 6).toUpperCase());

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  // Form State
  const [exitType, setExitType] = useState(initialData?.tipo || 'Uso Interno');
  const [destination, setDestination] = useState(initialData?.instituicao_beneficiada || ''); // Destino
  const [requester, setRequester] = useState(initialData?.fornecedor || ''); // Solicitante (Mapped to provider)
  const [exitDate, setExitDate] = useState(initialData?.data_lancamento ? new Date(initialData.data_lancamento).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.instituicao_beneficiada || '');

  const [products, setProducts] = useState<Product[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [selectedSectorId, setSelectedSectorId] = useState('');

  // Item Line State
  const [items, setItems] = useState<any[]>(initialData?.items.map(i => ({
    id: i.id || Math.random(),
    productId: i.produto?.id,
    productName: i.produto?.nome,
    quantity: i.quantidade,
    stock: 0, // Will update when products load
    unit: i.produto?.unidade_medida || 'UN',
    obs: ''
  })) || []);

  const [currentItem, setCurrentItem] = useState<{
    id?: number;
    productId: string;
    productName: string;
    quantity: number;
    stock: number; // Current stock of selected product
    unit: string;
  }>({
    productId: '',
    productName: '',
    quantity: 1,
    stock: 0,
    unit: ''
  });

  useEffect(() => {
    // Load sectors
    inventoryService.listSectors()
      .then(setSectors)
      .catch(console.error);

    // Load products
    inventoryService.listProducts()
      .then(prodList => {
        setProducts(prodList);
        // Update stock info for existing items if editing
        if (items.length > 0) {
          setItems(prevItems => prevItems.map(item => {
            const prod = prodList.find(p => p.id === item.productId);
            return { ...item, stock: prod ? prod.estoque_atual : 0 };
          }));
        }
      })
      .catch(console.error);
  }, []);

  const handleAddItem = () => {
    if ((!currentItem.productId && !currentItem.productName.trim())) {
      setToast({ message: 'Selecione um produto', type: 'warning' });
      return;
    }

    if (!currentItem.quantity || currentItem.quantity <= 0) {
      setToast({ message: 'Quantidade deve ser maior que zero', type: 'warning' });
      return;
    }

    // Check stock availability
    if (currentItem.productId) {
      const prod = products.find(p => p.id === currentItem.productId);
      if (prod && currentItem.quantity > prod.estoque_atual) {
        setToast({ message: `Estoque insuficiente! Disponível: ${prod.estoque_atual}`, type: 'error' });
        return;
      }
    }

    const newItemId = currentItem.id || Date.now();
    setItems([...items, { ...currentItem, id: newItemId }]);

    setToast({
      message: currentItem.id ? 'Item atualizado!' : 'Item adicionado à saída!',
      type: 'success'
    });

    setCurrentItem({
      id: undefined,
      productId: '',
      productName: '',
      quantity: 1,
      stock: 0,
      unit: ''
    });
  };

  const handleEditItem = (item: any) => {
    setCurrentItem({
      id: item.id,
      productId: item.productId,
      productName: item.productName || products.find(p => p.id === item.productId)?.nome || '',
      quantity: item.quantity,
      stock: item.stock || 0,
      unit: item.unit || ''
    });
    setItems(items.filter(i => i.id !== item.id));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
    setToast({ message: 'Item removido!', type: 'info' });
  };

  const handleSaveExit = async () => {
    if (items.length === 0) {
      setToast({ message: 'Adicione pelo menos um item', type: 'warning' });
      return;
    }

    if (!requester.trim()) {
      setToast({ message: 'Informe o solicitante', type: 'warning' });
      return;
    }

    if (!destination.trim()) {
      setToast({ message: 'Informe o destino', type: 'warning' });
      return;
    }

    // Fix ambiguity for "Doação" -> "Doação (Saída)" if user selected "Doação"
    // Though I will probably put "Doação (Saída)" in the select directly if I can
    let typeToSend = exitType;
    if (exitType === 'Doação') typeToSend = 'Doação (Saída)';

    const launchData = {
      type: typeToSend,
      status: 'Concluído', // Saídas are usually immediate
      emissionDate: exitDate,
      receptionDate: exitDate,
      provider: requester, // Saving Solicitante in Provider field
      unit: destination, // Saving Destino Name
      sectorId: selectedSectorId, // Saving Sector ID
      notes,
      items: items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: 0, // Internal use/exit usually has no price, or we could fetch ref value
        unit: i.unit
      }))
    };

    try {
      if (initialData && initialData.id) {
        await inventoryService.updateLaunch(initialData.id, launchData);
      } else {
        await inventoryService.createLaunch(launchData);
      }
      setIsSuccessModalOpen(true);
    } catch (e: any) {
      alert("Erro ao salvar saída: " + e.message);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
            <PackageMinus size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-700">Nova Saída de Estoque</h1>
            <p className="text-sm text-slate-400">Registre saídas por uso, perda, troca ou doação</p>
          </div>
        </div>
        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
          {launchId}
        </span>
      </div>

      {/* Form Grid */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Tipo de Saída */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Saída</label>
          <select
            value={exitType}
            onChange={(e) => setExitType(e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          >
            <option value="Uso Interno">Uso Interno</option>
            <option value="Perda">Perda / Avaria</option>
            <option value="Troca">Troca</option>
            <option value="Doação (Saída)">Doação</option>
          </select>
        </div>

        {/* Destino */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Destino / Local</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={selectedSectorId}
              onChange={(e) => {
                const sec = sectors.find(s => s.id === e.target.value);
                setSelectedSectorId(e.target.value);
                setDestination(sec ? sec.nome : '');
              }}
              className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all appearance-none"
            >
              <option value="">Selecione um setor...</option>
              {sectors.map(s => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Solicitante / Assistido */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            {exitType === 'Doação' || exitType === 'Doação (Saída)' ? 'Nome do Assistido' : 'Solicitante'}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              placeholder={exitType === 'Doação' || exitType === 'Doação (Saída)' ? "Nome do beneficiário..." : "Quem solicitou/retirou?"}
              className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
            {/* Visual Indicator for Donation */}
            {(exitType === 'Doação' || exitType === 'Doação (Saída)') && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-[10px] lowercase bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">assistido</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Item Input Area */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <PackageMinus size={16} className="text-rose-500" />
          Adicionar Produtos
        </h3>

        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-bold text-slate-400">Produto</label>
            <ProductSearchInput
              products={products}
              onSelect={(p) => {
                setCurrentItem({
                  ...currentItem,
                  productId: p.id,
                  productName: p.nome,
                  unit: p.unidade_medida || 'UN',
                  stock: p.estoque_atual
                });
              }}
              selectedProductId={currentItem.productId}
              initialValue={currentItem.productName}
              onAddNew={() => { }} // Disable clean add in exit? Or allow? Assuming allow but usually exits are for existing items.
            />
            {currentItem.stock > 0 && (
              <p className="text-xs text-slate-400">
                Disponível: <span className="font-bold text-slate-600">{currentItem.stock} {currentItem.unit}</span>
              </p>
            )}
          </div>

          <div className="w-32 space-y-2">
            <label className="text-xs font-bold text-slate-400">Quantidade</label>
            <input
              type="number"
              min="1"
              value={currentItem.quantity}
              onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <button
            onClick={handleAddItem}
            disabled={!currentItem.productId}
            className="h-10 px-6 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
          >
            <Plus size={18} /> Adicionar
          </button>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                <th className="px-6 py-4 font-bold text-xs uppercase">Produto</th>
                <th className="px-6 py-4 font-bold text-xs uppercase">Unidade</th>
                <th className="px-6 py-4 font-bold text-xs uppercase text-center">Quantidade</th>
                <th className="px-6 py-4 font-bold text-xs uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 flex flex-col items-center">
                    <FileWarning size={32} className="mb-2 opacity-50" />
                    <p>Nenhum item adicionado à lista de saída.</p>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-700">{item.productName}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{item.unit}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700 bg-rose-50/30">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditItem(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveExit}
          disabled={items.length === 0}
          className="px-8 py-2.5 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} /> Confirmar Saída
        </button>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-[24px] shadow-2xl p-8 max-w-sm w-full text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Saída registrada!</h2>
              <p className="text-sm text-slate-500 mt-2">O estoque foi atualizado com sucesso.</p>
            </div>
            <button onClick={() => { setIsSuccessModalOpen(false); onCancel(); }} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
              Voltar para a lista
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ExitForm;
