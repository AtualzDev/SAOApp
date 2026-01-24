
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus } from 'lucide-react';
import { Product } from '../../services/inventoryService';

interface ProductSearchInputProps {
    products: Product[];
    onSelect: (product: Product) => void;
    selectedProductId?: string;
    onAddNew?: () => void;
    initialValue?: string; // New prop
}

const ProductSearchInput: React.FC<ProductSearchInputProps> = ({ products, onSelect, selectedProductId, onAddNew, initialValue }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    useEffect(() => {
        if (selectedProductId) {
            const prod = products.find(p => p.id === selectedProductId);
            if (prod) {
                setSearchTerm(prod.nome);
            } else if (initialValue) {
                setSearchTerm(initialValue); // Fallback to provided name if ID not found in list (or if ID is missing but we have name)
            }
        } else {
            // If NO ID selected, but we have an initialValue (e.g. just text), use it.
            // BUT be careful not to overwrite user typing if this effect runs too often.
            // Actually, if selectedProductId is '' (cleared), we usually want to clear search.
            // But if we are "editing" an item without ID but WITH Name, selectedProductId might be ''.
            if (initialValue) {
                setSearchTerm(initialValue);
            } else {
                setSearchTerm('');
            }
        }
    }, [selectedProductId, products, initialValue]);
    // ...

    const filteredProducts = products.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    className="w-full h-9 pl-8 pr-2 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    placeholder="Buscar item..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>

            {isOpen && (searchTerm.length > 0 || filteredProducts.length > 0 || onAddNew) && (
                <div className="absolute z-50 left-0 top-full mt-1 w-[300px] bg-white rounded-xl shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto">
                    {onAddNew && (
                        <button
                            className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 border-b border-blue-100 text-blue-700 font-bold text-sm flex items-center gap-2 transition-colors sticky top-0"
                            onClick={() => {
                                onAddNew();
                                setIsOpen(false);
                            }}
                        >
                            <Plus size={16} /> Adicionar "{searchTerm || 'Novo Item'}"
                        </button>
                    )}

                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <button
                                key={product.id}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors flex flex-col gap-0.5"
                                onClick={() => {
                                    onSelect(product);
                                    setSearchTerm(product.nome);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="text-sm font-medium text-slate-700">{product.nome}</span>
                                <span className="text-xs text-slate-400">Cod: {product.codigo || 'N/A'} • Est: {product.estoque_atual}</span>
                            </button>
                        ))
                    ) : (
                        <div className="p-4 text-center text-slate-400 text-sm">
                            Nenhum produto encontrado.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductSearchInput;
