import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { inventoryService, Product, Category } from '../../services/inventoryService';

interface ProductEditModalProps {
    product: Product | null;
    onClose: () => void;
    onSave: () => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ product, onClose, onSave }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        nome: '',
        codigo: '',
        categoria_id: '',
        setor: '',
        unidade_medida: 'UN',
        estoque_minimo: 0,
        valor_referencia: 0,
        descricao: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
        if (product) {
            setFormData({
                nome: product.nome || '',
                codigo: product.codigo || '',
                // Fix: Use product.categoria (the ID field) for categoria_id
                categoria_id: product.categoria || product.categoria_id || '',
                setor: product.setor || '',
                unidade_medida: product.unidade_medida || 'UN',
                estoque_minimo: product.estoque_minimo || 0,
                valor_referencia: product.valor_referencia || 0,
                descricao: product.descricao || ''
            });
        }
    }, [product]);

    const loadCategories = async () => {
        try {
            const data = await inventoryService.listCategories();
            setCategories(data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nome.trim()) {
            alert('Nome do produto é obrigatório');
            return;
        }

        try {
            setLoading(true);

            if (product?.id) {
                console.log('Atualizando produto:', product.id, formData);
                await inventoryService.updateProduct(product.id, formData);
            } else {
                console.log('Criando novo produto:', formData);
                await inventoryService.createProduct(formData);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estoque_minimo' || name === 'valor_referencia' ? Number(value) : value
        }));
    };

    if (!product && product !== null) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Package className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {product ? 'Editar Produto' : 'Novo Produto'}
                            </h2>
                            <p className="text-blue-100 text-sm">
                                {product ? `Código: ${product.codigo || 'S/CÓDIGO'}` : 'Cadastrar novo item no catálogo'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="text-white" size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nome */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Nome do Produto *
                            </label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                placeholder="Ex: Arroz Integral 5kg"
                            />
                        </div>

                        {/* Código */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Código
                            </label>
                            <input
                                type="text"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                placeholder="PROD-001"
                            />
                        </div>

                        {/* Categoria */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Categoria
                            </label>
                            <select
                                name="categoria_id"
                                value={formData.categoria_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            >
                                <option value="">Selecione...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                ))}
                            </select>
                        </div>

                        {/* Setor */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Setor
                            </label>
                            <select
                                name="setor"
                                value={formData.setor}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            >
                                <option value="">Selecione...</option>
                                <option value="Alimentação">Alimentação</option>
                                <option value="Limpeza">Limpeza</option>
                                <option value="Escritório">Escritório</option>
                                <option value="Higiene">Higiene</option>
                                <option value="Vestuário">Vestuário</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>

                        {/* Unidade de Medida */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Unidade de Medida
                            </label>
                            <select
                                name="unidade_medida"
                                value={formData.unidade_medida}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            >
                                <option value="UN">UN</option>
                                <option value="Caixa">Caixa</option>
                                <option value="Litro">Litro</option>
                                <option value="Kg">Kg</option>
                                <option value="g">g</option>
                                <option value="Pacote">Pacote</option>
                                <option value="Fardo">Fardo</option>
                            </select>
                        </div>

                        {/* Estoque Mínimo */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Estoque Mínimo
                            </label>
                            <input
                                type="number"
                                name="estoque_minimo"
                                value={formData.estoque_minimo}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* Valor de Referência */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Valor de Referência (R$)
                            </label>
                            <input
                                type="number"
                                name="valor_referencia"
                                value={formData.valor_referencia}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* Descrição */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Descrição
                            </label>
                            <textarea
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                                placeholder="Informações adicionais sobre o produto..."
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        <Save size={16} />
                        {loading ? 'Salvando...' : 'Salvar Produto'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductEditModal;
