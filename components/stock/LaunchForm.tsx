import React, { useState, useEffect } from 'react';
import { Pencil, Plus, Trash2, Save, X, FileText, Check } from 'lucide-react';
import UnitSelectionModal from './UnitSelectionModal';
import AddCategoryModal from './AddCategoryModal';
import SupplierSelectionModal from './SupplierSelectionModal';
import ProductSearchInput from './ProductSearchInput';
import AddSimpleModal from './AddSimpleModal';
import Toast from '../common/Toast';
import { inventoryService, Product, Transaction } from '../../services/inventoryService';

interface LaunchFormProps {
  onCancel: () => void;
  initialData?: Transaction | null;
}

const LaunchForm: React.FC<LaunchFormProps> = ({ onCancel, initialData }) => {
  // Generate random ID only if not editing
  const [launchId] = useState(() => initialData ? '#' + initialData.id.slice(0, 8).toUpperCase() : 'LAN' + Math.random().toString(36).substr(2, 6).toUpperCase());

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const [selectedUnit, setSelectedUnit] = useState<any>({ nome: initialData?.instituicao_beneficiada || 'CAPEC 2' });
  const [selectedSupplier, setSelectedSupplier] = useState<any>({ nome: initialData?.fornecedor || '' });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string, nome: string }[]>([]); // To store categories
  const [sectors, setSectors] = useState<{ id: string, nome: string }[]>([]); // Load from database

  // Header State
  const [launchType, setLaunchType] = useState(initialData?.tipo || 'Doação');
  const [status, setStatus] = useState(initialData?.numero_nota ? 'Com nota' : 'Sem nota'); // Improve logic if status field exists
  const [emissionDate, setEmissionDate] = useState(initialData?.data_lancamento ? new Date(initialData.data_lancamento).toISOString().split('T')[0] : ''); // Or use specific field
  const [receptionDate, setReceptionDate] = useState(initialData?.data_recebimento ? new Date(initialData.data_recebimento).toISOString().split('T')[0] : '');
  const [noteNumber, setNoteNumber] = useState(initialData?.numero_nota || ''); // Note: numero_nota is not on Transaction interface yet but on backend it is
  const [notes, setNotes] = useState('');

  // Item Line State
  const [items, setItems] = useState<any[]>(initialData?.items.map(i => ({
    id: i.id || Math.random(),
    productId: i.produto?.id,
    productName: i.produto?.nome, // Capture name
    quantity: i.quantidade,
    unitPrice: i.valor_unitario,
    unit: i.produto?.unidade_medida || 'UN',
    category: i.categoria_id || i.produto?.categoria_id || '', // Use categoria_id
    sector: i.setor_id || i.produto?.setor_id || '', // Use setor_id
    validity: i.validade ? new Date(i.validade).toISOString().split('T')[0] : '',
  })) || []);

  const [currentItem, setCurrentItem] = useState<{
    id?: number; // Optional ID for editing
    productId: string;
    productName: string;
    validity: string;
    quantity: number;
    unitPrice: string;
    sector: string;
    category: string;
    unit: string;
  }>({
    productId: '',
    productName: '',
    validity: '',
    quantity: 1,
    unitPrice: '',
    sector: '',
    category: '',
    unit: ''
  });

  useEffect(() => {
    // Load products, categories and sectors
    Promise.all([
      inventoryService.listProducts(),
      inventoryService.listCategories(),
      inventoryService.listSectors()
    ]).then(([prodList, catList, sectorList]) => {
      setProducts(prodList);
      setCategories(catList);
      setSectors(sectorList);
    }).catch(console.error);
  }, []);

  const handleSelectUnit = (unit: any) => {
    setSelectedUnit(unit);
    setIsUnitModalOpen(false);
  };

  const handleSelectSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsSupplierModalOpen(false);
  };

  const handleSaveCategory = async (data: any) => {
    try {
      await inventoryService.createCategory(data);
      // Refresh categories
      const updatedCats = await inventoryService.listCategories();
      setCategories(updatedCats);
      // Modal fecha automaticamente após sucesso
    } catch (e: any) {
      throw new Error(e.message || "Erro ao criar categoria");
    }
  };

  const handleAddProduct = async (productName: string) => {
    try {
      const newProduct = await inventoryService.createProduct({ nome: productName, estoque_atual: 0 });
      setProducts([...products, newProduct]);
      // Auto select
      setCurrentItem({
        ...currentItem,
        productId: newProduct.id,
        productName: newProduct.nome,
        category: newProduct.categoria_id || '',
        unit: newProduct.unidade_medida || ''
      });
      setIsProductModalOpen(false);
    } catch (e: any) {
      alert("Erro ao criar produto: " + e.message);
    }
  };

  const handleAddSector = async (newSectorName: string) => {
    try {
      const newSector = await inventoryService.createSector({ name: newSectorName, description: '' });
      setSectors([...sectors, newSector]);
      setCurrentItem({ ...currentItem, sector: newSector.id }); // Auto select with ID
      setIsSectorModalOpen(false);
    } catch (e: any) {
      alert("Erro ao criar setor: " + e.message);
    }
  }

  const handleAddItem = () => {
    // Validação: precisa ter produto (ID ou nome) E quantidade
    if ((!currentItem.productId && !currentItem.productName.trim())) {
      setToast({ message: 'Selecione um produto', type: 'warning' });
      return;
    }

    if (!currentItem.quantity || currentItem.quantity <= 0) {
      setToast({ message: 'Quantidade deve ser maior que zero', type: 'warning' });
      return;
    }

    // Use existing ID if editing, or generate new one
    const newItemId = currentItem.id || Date.now();

    setItems([...items, { ...currentItem, id: newItemId }]);

    // Toast de sucesso
    setToast({
      message: currentItem.id ? 'Item atualizado com sucesso!' : 'Item adicionado com sucesso!',
      type: 'success'
    });

    // Reset form
    setCurrentItem({
      id: undefined,
      productId: '',
      productName: '',
      validity: '',
      quantity: 1,
      unitPrice: '',
      sector: '',
      category: '',
      unit: ''
    });
  };

  const handleEditItem = (item: any) => {
    const prodName = item.productName || products.find(p => p.id === item.productId)?.nome || '';
    setCurrentItem({
      id: item.id, // Preserve ID
      productId: item.productId,
      productName: prodName,
      validity: item.validity || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      sector: item.sector || '',
      category: item.category || '',
      unit: item.unit || ''
    });
    setItems(items.filter(i => i.id !== item.id));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
    setToast({ message: 'Item removido com sucesso!', type: 'info' });
  };

  const handleSaveLaunch = async () => {
    if (items.length === 0) {
      alert("Adicione pelo menos um item.");
      return;
    }

    const launchData = {
      type: launchType,
      status,
      emissionDate: status === 'Com nota' ? emissionDate : null,
      receptionDate,
      provider: selectedSupplier.nome,
      unit: selectedUnit.nome,
      noteNumber: status === 'Com nota' ? noteNumber : '',
      notes,
      items
    };

    try {
      if (initialData && initialData.id) {
        // Update existing launch
        await inventoryService.updateLaunch(initialData.id, launchData);
      } else {
        // Create new launch
        await inventoryService.createLaunch(launchData);
      }
      setIsSuccessModalOpen(true);
    } catch (e: any) {
      alert("Erro ao salvar: " + e.message);
    }
  };

  const handleGeneratePDF = () => {
    alert("Gerando PDF... (Funcionalidade mockada)");
    setIsSuccessModalOpen(false);
    onCancel();
  };

  const handleCloseSuccess = () => {
    setIsSuccessModalOpen(false);
    onCancel();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full bg-[#F8FAFC]">
      {/* Header do Formulário */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-700">Novo lançamento</h1>
        <span className="text-slate-400 text-sm font-medium">ID: #{launchId}</span>
      </div>

      {/* Grid Principal de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tipo de lançamento */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-500">Tipo de lançamento</label>
          <div className="relative">
            <select
              value={launchType}
              onChange={(e) => setLaunchType(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all appearance-none cursor-pointer"
            >
              <option>Doação</option>
              <option>Compra</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-500">Status</label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all appearance-none cursor-pointer"
            >
              <option>Com nota</option>
              <option>Sem nota</option>
            </select>
          </div>
        </div>

        {/* Data da Emissão - Condicional */}
        {status === 'Com nota' ? (
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-500">Data da Emissão</label>
            <input
              type="date"
              value={emissionDate}
              onChange={(e) => setEmissionDate(e.target.value)}
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
            />
          </div>
        ) : (
          <div className="space-y-1.5 opacity-50 pointer-events-none">
            <label className="text-[13px] font-medium text-slate-500">Data da Emissão</label>
            <input type="text" disabled value="N/A" className="w-full h-11 px-4 bg-slate-100 border border-slate-200 rounded-lg text-sm" />
          </div>
        )}

        {/* Data do recebimento */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-500">Data do recebimento</label>
          <input
            type="date"
            value={receptionDate}
            onChange={(e) => setReceptionDate(e.target.value)}
            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Nota Fiscal Input if Com Nota */}
      {status === 'Com nota' && (
        <div className="w-full md:w-1/4 space-y-1.5">
          <label className="text-[13px] font-medium text-slate-500">Número da Nota</label>
          <input
            type="text"
            value={noteNumber}
            onChange={(e) => setNoteNumber(e.target.value)}
            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
            placeholder="000.000"
          />
        </div>
      )}

      {/* Seção de Cards (Instituição e Fornecedor) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-600">Instituição beneficiada</h3>
            <button
              onClick={() => setIsUnitModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-blue-600 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors"
            >
              <Pencil size={14} /> Editar
            </button>
          </div>
          <p className="text-lg font-bold text-slate-700">{selectedUnit.nome}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-600">Fornecedor:</h3>
            <button
              onClick={() => setIsSupplierModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-blue-600 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors"
            >
              <Pencil size={14} /> Selecionar
            </button>
          </div>
          <p className="text-lg font-bold text-slate-700">{selectedSupplier.nome || 'Selecione um fornecedor'}</p>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700">Lista de itens</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-visible shadow-sm">
          <div className="overflow-visible">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3 w-8 text-center">#</th>
                  <th className="px-4 py-3 min-w-[250px]">Item</th>
                  <th className="px-4 py-3">VALIDADE</th>
                  <th className="px-4 py-3 min-w-[140px]">SETOR</th>
                  <th className="px-4 py-3 min-w-[140px]">CATEGORIA</th>
                  <th className="px-4 py-3">QUANT.</th>
                  <th className="px-4 py-3 min-w-[90px]">UNI.</th>
                  <th className="px-4 py-3">VALOR UNIT</th>
                  <th className="px-4 py-3">TOTAL</th>
                  <th className="px-4 py-3 text-center">AÇÃO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Input Row at the TOP */}
                <tr className="bg-blue-50/10 relative">
                  <td className="px-4 py-3 text-slate-400 font-medium text-center">+</td>

                  {/* Busca de Item */}
                  <td className="px-4 py-3">
                    <ProductSearchInput
                      products={products}
                      onSelect={(p) => {
                        setCurrentItem({
                          ...currentItem,
                          productId: p.id,
                          productName: p.nome,
                          category: p.categoria_id || '', // Use categoria_id
                          sector: p.setor_id || '',        // Use setor_id
                          unit: p.unidade_medida || ''
                        });
                      }}
                      selectedProductId={currentItem.productId}
                      initialValue={currentItem.productName}
                      onAddNew={() => setIsProductModalOpen(true)}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <input
                      type="date"
                      className="w-full h-9 bg-white border border-slate-200 rounded px-2 w-[110px]"
                      value={currentItem.validity}
                      onChange={(e) => setCurrentItem({ ...currentItem, validity: e.target.value })}
                    />
                  </td>

                  {/* Setor com Add */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <select
                        className="w-full h-9 bg-white border border-slate-200 rounded px-2 w-full"
                        value={currentItem.sector}
                        onChange={(e) => setCurrentItem({ ...currentItem, sector: e.target.value })}
                      >
                        <option value="">Setor...</option>
                        {sectors.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                      </select>
                      <button
                        onClick={() => setIsSectorModalOpen(true)}
                        className="h-9 w-9 flex items-center justify-center bg-blue-100 text-blue-600 rounded border border-blue-200 hover:bg-blue-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>

                  {/* Categoria com Add */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <select
                        className="w-full h-9 bg-white border border-slate-200 rounded px-2 w-full"
                        value={currentItem.category}
                        onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                      >
                        <option value="">Cat...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                      </select>
                      <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="h-9 w-9 flex items-center justify-center bg-blue-100 text-blue-600 rounded border border-blue-200 hover:bg-blue-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <input
                      type="number"
                      className="w-full h-9 bg-white border border-slate-200 rounded px-2 w-16 text-center"
                      value={currentItem.quantity}
                      onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="w-full h-9 bg-white border border-slate-200 rounded px-2 text-xs"
                      value={currentItem.unit}
                      onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value })}
                    >
                      <option value="">Uni...</option>
                      <option value="UN">UN</option>
                      <option value="Caixa">Caixa</option>
                      <option value="Litro">Litro</option>
                      <option value="Kg">Kg</option>
                      <option value="g">g</option>
                      <option value="Pacote">Pacote</option>
                      <option value="Fardo">Fardo</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full h-9 bg-white border border-slate-200 rounded px-2 w-20"
                      value={currentItem.unitPrice}
                      onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-600 text-xs">
                      R$ {(currentItem.quantity * Number(currentItem.unitPrice || 0)).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={handleAddItem}
                      className={`${currentItem.id ? 'text-green-600 hover:bg-green-50' : 'text-blue-600 hover:bg-blue-50'} p-1 rounded transition-colors`}
                      title={currentItem.id ? "Salvar alteração" : "Adicionar item"}
                    >
                      {currentItem.id ? <Check size={20} /> : <Plus size={18} />}
                    </button>
                  </td>
                </tr>

                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3">{products.find(p => p.id === item.productId)?.nome || item.productName || 'Item Desconhecido'}</td>
                    <td className="px-4 py-3">{item.validity && new Date(item.validity).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-500">{sectors.find(s => s.id === item.sector)?.nome || '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{categories.find(c => c.id === item.category)?.nome || '-'}</td>
                    <td className="px-4 py-3 font-bold">{item.quantity}</td>
                    <td className="px-4 py-3 text-slate-500">{item.unit}</td>
                    <td className="px-4 py-3">{item.unitPrice}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">R$ {(Number(item.quantity) * Number(item.unitPrice || 0)).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEditItem(item)}
                          title="Editar item"
                          className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          title="Remover item"
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totalizador */}
        <div className="flex flex-col items-end gap-1 mt-6">
          <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total</span>
          <span className="text-3xl font-bold text-slate-800">
            R$ {(
              items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice || 0)), 0) +
              (Number(currentItem.quantity || 0) * Number(currentItem.unitPrice || 0))
            ).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Anotações */}
      <div className="space-y-1.5 pt-4">
        <label className="text-sm font-bold text-slate-600">Anotações</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações"
          rows={4}
          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-600 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 resize-none transition-all"
        ></textarea>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6">
        <button
          onClick={onCancel}
          className="px-10 py-3 border border-slate-200 text-slate-500 rounded-lg font-bold hover:bg-slate-50 hover:text-slate-700 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveLaunch}
          className="px-14 py-3 bg-[#1E40AF] text-white rounded-lg font-bold hover:bg-blue-800 shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <Save size={18} /> Salvar
        </button>
      </div>

      {/* Modais */}
      <UnitSelectionModal
        isOpen={isUnitModalOpen}
        onClose={() => setIsUnitModalOpen(false)}
        onSelect={handleSelectUnit}
      />

      <SupplierSelectionModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onSelect={handleSelectSupplier}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      <AddSimpleModal
        isOpen={isSectorModalOpen}
        onClose={() => setIsSectorModalOpen(false)}
        onSave={handleAddSector}
        title="Adicionar Novo Setor"
        label="Nome do Setor"
      />

      <AddSimpleModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleAddProduct}
        title="Adicionar Novo Item"
        label="Nome do Item"
      />

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseSuccess}></div>
          <div className="relative bg-white rounded-[24px] shadow-2xl p-8 max-w-sm w-full text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <Save size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Cadastro realizado com sucesso!</h2>
              <p className="text-sm text-slate-500 mt-2">Deseja gerar o comprovante desta doação?</p>
            </div>
            <div className="flex flex-col gap-3">
              {launchType === 'Doação' && (
                <button onClick={handleGeneratePDF} className="w-full py-3 bg-[#1E40AF] text-white font-bold rounded-xl hover:bg-blue-800 flex items-center justify-center gap-2">
                  <FileText size={18} /> Gerar PDF
                </button>
              )}
              <button onClick={handleCloseSuccess} className="w-full py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">
                Voltar para a lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
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

export default LaunchForm;
