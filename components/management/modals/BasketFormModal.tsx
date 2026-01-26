import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Search, Package } from 'lucide-react';
import { inventoryService, Product } from '../../../services/inventoryService';
import { basketService, Basket, BasketItem } from '../../../services/basketService';

interface BasketFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    basketToEdit?: Basket | null;
}

const BasketFormModal: React.FC<BasketFormModalProps> = ({ isOpen, onClose, onSuccess, basketToEdit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [items, setItems] = useState<{ productId: string; quantity: number; tempId: string }[]>([]);

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadProducts();
            if (basketToEdit) {
                setName(basketToEdit.nome);
                setDescription(basketToEdit.descricao || '');
                // Transform basket items to local state
                if (basketToEdit.items) {
                    setItems(basketToEdit.items.map(i => ({
                        productId: i.produto_id,
                        quantity: i.quantidade,
                        tempId: Math.random().toString(36).substr(2, 9)
                    })));
                } else {
                    // Need to fetch details if items are missing in list view (likely)
                    loadBasketDetails(basketToEdit.id);
                }
            } else {
                resetForm();
            }
        }
    }, [isOpen, basketToEdit]);

    const loadBucketDetails = async (id: string) => {
        // If the list view didn't provide items, fetch them
        try {
            const fullBasket = await basketService.getBasket(id);
            if (fullBasket.items) {
                setItems(fullBasket.items.map(i => ({
                    productId: i.produto_id,
                    quantity: i.quantidade,
                    tempId: Math.random().toString(36).substr(2, 9)
                })));
            }
        } catch (e) {
            console.error("Error loading basket details", e);
        }
    };

    const loadBasketDetails = async (id: string) => {
        try {
            const fullBasket = await basketService.getBasket(id);
            if (fullBasket.items) {
                setItems(fullBasket.items.map(i => ({
                    productId: i.produto_id,
                    quantity: i.quantidade,
                    tempId: Math.random().toString(36).substr(2, 9)
                })));
            }
        } catch (e) {
            console.error("Error loading basket details", e);
        }
    }

    const resetForm = () => {
        setName('');
        setDescription('');
        setItems([]);
        setSearchTerm('');
    };

    const loadProducts = async () => {
        try {
            setLoadingProducts(true);
            const data = await inventoryService.listProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const addItem = (product: Product) => {
        setItems(prev => [
            ...prev,
            { productId: product.id, quantity: 1, tempId: Math.random().toString(36).substr(2, 9) }
        ]);
    };

    const removeItem = (tempId: string) => {
        setItems(prev => prev.filter(i => i.tempId !== tempId));
    };

    const updateQuantity = (tempId: string, qty: number) => {
        if (qty < 1) return;
        setItems(prev => prev.map(i => i.tempId === tempId ? { ...i, quantity: qty } : i));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return alert('Nome da cesta é obrigatório');
        if (items.length === 0) return alert('Adicione pelo menos um item à cesta');

        try {
            setSaving(true);
            const payload = {
                name,
                description,
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
            };

            if (basketToEdit) {
                await basketService.updateBasket(basketToEdit.id, payload);
            } else {
                await basketService.createBasket(payload);
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            alert('Erro ao salvar cesta: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.codigo && p.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {basketToEdit ? 'Editar Cesta' : 'Nova Cesta'}
                        </h2>
                        <p className="text-sm text-slate-400 font-medium mt-1">Configure os itens que compõem esta cesta.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-50/50">

                    {/* Left Column: Form & Selected Items */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-1.5">Nome da Cesta</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Ex: Cesta Básica Tipo 1"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-1.5">Descrição (Opcional)</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Detalhes sobre a destinação ou conteúdo..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-sm focus:border-blue-500 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Package size={16} className="text-blue-600" /> Itens Selecionados ({items.length})
                            </h3>

                            {items.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                                    <p className="text-sm">Nenhum item adicionado.</p>
                                    <p className="text-xs mt-1">Selecione produtos na lista ao lado.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map(item => {
                                        const product = products.find(p => p.id === item.productId);
                                        return (
                                            <div key={item.tempId} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-blue-200 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                        {product?.nome.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{product?.nome}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{product?.unidade_medida}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center bg-white rounded-lg border border-slate-200">
                                                        <button onClick={() => updateQuantity(item.tempId, item.quantity - 1)} className="px-2 py-1 hover:bg-slate-50 text-slate-500 rounded-l-lg font-bold">-</button>
                                                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.tempId, item.quantity + 1)} className="px-2 py-1 hover:bg-slate-50 text-slate-500 rounded-r-lg font-bold">+</button>
                                                    </div>
                                                    <button onClick={() => removeItem(item.tempId)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Product Selector */}
                    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar produtos para adicionar..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                            {loadingProducts ? (
                                <div className="text-center py-8 text-slate-400">Carregando produtos...</div>
                            ) : (
                                filteredProducts.map(product => {
                                    const isAdded = items.some(i => i.productId === product.id);
                                    return (
                                        <button
                                            key={product.id}
                                            disabled={isAdded}
                                            onClick={() => addItem(product)}
                                            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group text-left border border-transparent hover:border-slate-100"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${isAdded ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                                                    {isAdded ? <Plus className="rotate-45" /> : <Plus />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">{product.nome}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">Cód: {product.codigo || 'N/A'} • Estoque: {product.estoque_atual}</p>
                                                </div>
                                            </div>
                                            {isAdded && (
                                                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 px-2 py-1 bg-emerald-50 rounded-md">Adicionado</span>
                                            )}
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-8 py-3 bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? 'Salvando...' : (basketToEdit ? 'Salvar Alterações' : 'Criar Cesta')}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BasketFormModal;
