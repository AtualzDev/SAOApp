
const API_URL = 'http://localhost:3001/api/inventory';

export interface Product {
    id: string;
    nome: string;
    codigo?: string;
    descricao?: string;
    categoria?: string; // Category ID (UUID)
    categoria_id?: string;
    categoria_nome?: string; // Category name for display
    categoria_setor?: string; // Category's default sector
    setor?: string; // Product-specific sector (can override category default)
    unidade_medida?: string;
    estoque_minimo?: number;
    estoque_inicial?: number; // Para criação de produto
    estoque_atual: number;
    valor_referencia?: number;
}

export interface Unit {
    id: string;
    nome: string;
    descricao?: string;
}

export interface Category {
    id: string;
    nome: string;
    setor?: string;
    descricao?: string;
}

export interface LaunchItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    validity?: string;
    sector?: string;
    category?: string;
    unit?: string;
}

export interface LaunchData {
    type: string;
    status: string;
    emissionDate?: string;
    receptionDate?: string;
    provider?: string;
    unit?: string;
    notes?: string;
    items: LaunchItem[];
    noteNumber?: string;
}

export interface Transaction {
    id: string;
    tipo: string;
    status: string;
    data_lancamento?: string; // or created_at
    created_at: string;
    data_recebimento?: string;
    fornecedor?: string;
    instituicao_beneficiada?: string;
    valor_total: number;
    items: {
        id: string;
        produto: { nome: string };
        quantidade: number;
        valor_unitario: number;
    }[];
}

export const inventoryService = {
    // --- Products ---
    async listProducts(): Promise<Product[]> {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    async createProduct(product: Partial<Product>): Promise<Product> {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error('Failed to create product');
        return response.json();
    },

    async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error('Failed to update product');
        return response.json();
    },

    async deleteProduct(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete product');
    },

    // --- Units ---
    async listUnits(): Promise<Unit[]> {
        const response = await fetch(`${API_URL}/units`);
        if (!response.ok) throw new Error('Failed to fetch units');
        return response.json();
    },

    async createUnit(unit: { name: string; observation: string }): Promise<Unit> {
        const response = await fetch(`${API_URL}/units`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(unit),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || 'Failed to create unit');
        }
        return response.json();
    },

    // --- Sectors ---
    async listSectors(): Promise<any[]> {
        const response = await fetch(`${API_URL}/sectors`);
        if (!response.ok) throw new Error('Failed to fetch sectors');
        return response.json();
    },

    async createSector(sector: { name: string; description: string }): Promise<any> {
        const response = await fetch(`${API_URL}/sectors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sector),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to create sector');
        }
        return response.json();
    },

    async updateSector(id: string, sector: { name: string; description: string }): Promise<any> {
        const response = await fetch(`${API_URL}/sectors/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sector),
        });
        if (!response.ok) throw new Error('Failed to update sector');
        return response.json();
    },

    async deleteSector(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/sectors/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete sector');
    },

    // --- Categories ---
    async listCategories(): Promise<Category[]> {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
    },

    async createCategory(category: { name: string; sector: string; description: string }): Promise<Category> {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
        });
        if (!response.ok) throw new Error('Failed to create category');
        return response.json();
    },

    async updateCategory(id: string, category: { name: string; sector: string; description: string }): Promise<Category> {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
        });
        if (!response.ok) throw new Error('Failed to update category');
        return response.json();
    },

    async deleteCategory(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete category');
    },

    // --- Suppliers ---
    async listSuppliers(): Promise<any[]> {
        const response = await fetch(`${API_URL}/suppliers`);
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        return response.json();
    },

    async createSupplier(supplier: { name: string; cnpj?: string; observation?: string }): Promise<any> {
        const response = await fetch(`${API_URL}/suppliers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(supplier),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || 'Failed to create supplier');
        }
        return response.json();
    },

    // --- Transactions / Launches ---
    async listTransactions(): Promise<Transaction[]> {
        const response = await fetch(`${API_URL}/transactions`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return response.json();
    },

    async createLaunch(launch: LaunchData): Promise<any> {
        const response = await fetch(`${API_URL}/launch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(launch),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create launch');
        }
        return response.json();
    },

    async updateLaunch(id: string, launch: LaunchData): Promise<any> {
        const response = await fetch(`${API_URL}/launch/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(launch),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update launch');
        }
        return response.json();
    }
};
