
const API_URL = 'http://localhost:3001/api/baskets';

export interface BasketItem {
    id?: string;
    produto_id: string;
    quantidade: number;
    produto?: {
        nome: string;
        unidade_medida?: string;
    };
}

export interface Basket {
    id: string;
    nome: string;
    descricao?: string;
    itens_count?: number;
    items?: BasketItem[];
    total?: number; // legacy frontend prop compatibility
    qtdItens?: number; // legacy frontend compatibility
}

export const basketService = {
    // List all baskets
    async listBaskets(): Promise<Basket[]> {
        const response = await fetch(`${API_URL}`);
        if (!response.ok) throw new Error('Failed to fetch baskets');
        return response.json();
    },

    // Get specific basket details
    async getBasket(id: string): Promise<Basket> {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch basket');
        return response.json();
    },

    // Create new basket
    async createBasket(data: { name: string, description: string, items: { productId: string, quantity: number }[] }) {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to create basket');
        }
        return response.json();
    },

    // Update basket
    async updateBasket(id: string, data: { name: string, description: string, items: { productId: string, quantity: number }[] }) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to update basket');
        }
        return response.json();
    },

    // Delete basket
    async deleteBasket(id: string) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete basket');
        return true;
    },

    // Donate basket (Create stock exit)
    async donateBasket(id: string, data: { beneficiary: string, notes?: string, date?: string }) {
        const response = await fetch(`${API_URL}/${id}/donate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to donate basket');
        }
        return response.json();
    }
};
