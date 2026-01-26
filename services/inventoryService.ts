
const API_URL = 'http://localhost:3001/api/inventory';

export interface Product {
    id: string;
    nome: string;
    codigo?: string;
    descricao?: string;
    categoria_id?: string; // Category ID (UUID) - Foreign Key
    categoria_nome?: string; // Category name for display
    categoria_setor_id?: string; // Category's sector ID
    setor_id?: string; // Product-specific sector (UUID) - Foreign Key
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
    setor_id?: string; // Sector ID (UUID) - Foreign Key
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
    sectorId?: string;
    notes?: string;
    items: LaunchItem[];
    noteNumber?: string;
}

export interface Transaction {
    id: string;
    tipo: string;
    category?: 'entry' | 'exit';
    status: string;
    data_lancamento?: string; // or created_at
    created_at: string;
    data_recebimento?: string;
    // Entry fields
    fornecedor?: string;
    instituicao_beneficiada?: string;
    valor_total?: number;
    numero_nota?: string;
    // Exit fields
    data_saida?: string;
    destino_local?: string;
    solicitante_ou_assistido?: string;
    setor_id?: string;
    // Items
    items: {
        id: string;
        produto: { nome: string };
        quantidade: number;
        valor_unitario?: number;
        validade?: string; // Add validity
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

    // --- Entries (Lançamentos) ---
    async listEntries(): Promise<any[]> {
        const response = await fetch(`${API_URL}/entries`);
        if (!response.ok) throw new Error('Failed to fetch entries');
        return response.json();
    },

    // --- Baskets (Cestas) ---
    async listBaskets(): Promise<any[]> {
        const response = await fetch(`${API_URL}/baskets`);
        if (!response.ok) throw new Error('Failed to fetch baskets');
        return response.json();
    },

    async getBasket(id: string): Promise<any> {
        const response = await fetch(`${API_URL}/baskets/${id}`);
        if (!response.ok) throw new Error('Failed to fetch basket');
        return response.json();
    },

    async getEntry(id: string): Promise<any> {
        const response = await fetch(`${API_URL}/entries/${id}`);
        if (!response.ok) throw new Error('Failed to fetch entry');
        return response.json();
    },

    async createEntry(launch: LaunchData): Promise<any> {
        const response = await fetch(`${API_URL}/entries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(launch),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create entry');
        }
        return response.json();
    },

    async updateEntry(id: string, launch: LaunchData): Promise<any> {
        const response = await fetch(`${API_URL}/entries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(launch),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update entry');
        }
        return response.json();
    },

    async deleteEntry(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/entries/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete entry');
    },

    // --- Exits (Saídas) ---
    async listExits(): Promise<any[]> {
        const response = await fetch(`${API_URL}/exits`);
        if (!response.ok) throw new Error('Failed to fetch exits');
        return response.json();
    },

    async getExit(id: string): Promise<any> {
        const response = await fetch(`${API_URL}/exits/${id}`);
        if (!response.ok) throw new Error('Failed to fetch exit');
        return response.json();
    },

    async createExit(launch: LaunchData): Promise<any> {
        const response = await fetch(`${API_URL}/exits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(launch),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create exit');
        }
        return response.json();
    },

    async updateExit(id: string, launch: LaunchData): Promise<any> {
        const response = await fetch(`${API_URL}/exits/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(launch),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update exit');
        }
        return response.json();
    },

    async deleteExit(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/exits/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete exit');
    },

    // --- Legacy / Adapter Methods (to support existing UI until refactored) ---
    // These methods decide which endpoint to call based on the 'type' or context

    async getLaunch(id: string, category?: 'entry' | 'exit'): Promise<any> {
        // Since we don't know checking entry first then exit is what backend used to do.
        // But backend doesn't support generic getLaunch anymore.
        // Frontend must pass category hint if possible, or we try both.
        // Attempting Entry first
        try {
            const response = await fetch(`${API_URL}/entries/${id}`);
            if (response.ok) return response.json();
        } catch (e) { }

        // If not entry, try exit
        const responseExit = await fetch(`${API_URL}/exits/${id}`);
        if (!responseExit.ok) throw new Error('Launch not found in entries or exits');
        return responseExit.json();
    },

    async createLaunch(launch: LaunchData): Promise<any> {
        const EXIT_TYPES = ['Uso Interno', 'Perda', 'Troca', 'Doação (Saída)', 'Saída', 'Venda', 'Cesta'];
        if (EXIT_TYPES.includes(launch.type)) {
            return this.createExit(launch);
        } else {
            return this.createEntry(launch);
        }
    },

    async updateLaunch(id: string, launch: LaunchData): Promise<any> {
        const EXIT_TYPES = ['Uso Interno', 'Perda', 'Troca', 'Doação (Saída)', 'Saída', 'Venda', 'Cesta'];
        if (EXIT_TYPES.includes(launch.type)) {
            return this.updateExit(id, launch);
        } else {
            return this.updateEntry(id, launch);
        }
    },

    async deleteLaunch(id: string, category: 'entry' | 'exit'): Promise<void> {
        if (category === 'exit') {
            return this.deleteExit(id);
        } else {
            return this.deleteEntry(id);
        }
    }
};
