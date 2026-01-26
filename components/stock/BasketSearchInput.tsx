import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBasket } from 'lucide-react';

interface BasketSearchInputProps {
    baskets: any[];
    onSelect: (basket: any) => void;
    selectedBasketId?: string;
    initialValue?: string;
}

const BasketSearchInput: React.FC<BasketSearchInputProps> = ({ baskets, onSelect, selectedBasketId, initialValue }) => {
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
        if (selectedBasketId) {
            const basket = baskets.find(b => b.id === selectedBasketId);
            if (basket) {
                setSearchTerm(basket.nome);
            } else if (initialValue) {
                setSearchTerm(initialValue);
            }
        } else {
            if (initialValue) {
                setSearchTerm(initialValue);
            } else {
                setSearchTerm('');
            }
        }
    }, [selectedBasketId, baskets, initialValue]);

    const filteredBaskets = baskets.filter(b =>
        b.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    className="w-full h-11 pl-10 pr-3 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-700 placeholder:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="Carregar itens de..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                <ShoppingBasket className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={16} />
            </div>

            {isOpen && (searchTerm.length > 0 || filteredBaskets.length > 0) && (
                <div className="absolute z-50 left-0 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto animate-in fade-in zoom-in-95">
                    {filteredBaskets.length > 0 ? (
                        filteredBaskets.map(basket => (
                            <button
                                key={basket.id}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors flex flex-col gap-0.5"
                                onClick={() => {
                                    onSelect(basket);
                                    setSearchTerm(basket.nome);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="text-sm font-bold text-slate-700">{basket.nome}</span>
                                {basket.descricao && (
                                    <span className="text-xs text-slate-400 truncate">{basket.descricao}</span>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="p-4 text-center text-slate-400 text-sm">
                            Nenhuma cesta encontrada.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BasketSearchInput;
