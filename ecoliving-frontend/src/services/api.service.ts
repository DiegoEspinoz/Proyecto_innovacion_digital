import { buildApiUrl } from '../config/api';
import { Product, Order, AuthResponse, LoginRequest, RegisterRequest } from '../types';

class ApiService {
    private getAuthToken(): string | null {
        return localStorage.getItem('auth_token') || localStorage.getItem('token');
    }

    private getUserId(): number | null {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.id;
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        requiresUserId: boolean = false
    ): Promise<T> {
        const url = buildApiUrl(endpoint);
        
        console.log(`API Call: ${options.method || 'GET'} ${url}`);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Token handling
        const token = this.getAuthToken();
        
        if (token) {
            if (token.startsWith('demo-')) {
                console.log('DEMO MODE active');
                headers['X-Demo-Mode'] = 'true';
                headers['X-Demo-User'] = 'admin@ecoliving.com';
            } else {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        // User ID
        if (requiresUserId) {
            const userId = this.getUserId();
            if (userId) {
                headers['X-User-Id'] = userId.toString();
            }
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                mode: 'cors',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error ${response.status}:`, errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const text = await response.text();
            return text ? JSON.parse(text) : {} as T;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Métodos básicos
    async get<T>(endpoint: string, requiresUserId: boolean = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' }, requiresUserId);
    }

    async post<T>(endpoint: string, data?: any, requiresUserId: boolean = false): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }, requiresUserId);
    }

    async put<T>(endpoint: string, data: any, requiresUserId: boolean = false): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        }, requiresUserId);
    }

    async delete<T>(endpoint: string, requiresUserId: boolean = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' }, requiresUserId);
    }
}

export const apiService = new ApiService();

// Servicios
export const productService = {
    getAll: () => apiService.get<Product[]>('/products'),
    getById: (id: number) => apiService.get<Product>(`/products/${id}`),
    getByCategory: (category: string) => apiService.get<Product[]>(`/products/category/${category}`),
    search: (query: string) => apiService.get<Product[]>(`/products/search?q=${query}`),
};

export const categoryService = {
    getAll: () => apiService.get<string[]>('/categories'),
};

export const orderService = {
    getAll: () => apiService.get<Order[]>('/orders'),
    getById: (id: number) => apiService.get<Order>(`/orders/${id}`),
    getByUserId: (userId: number) => apiService.get<Order[]>(`/orders/user/${userId}`),
    create: (orderData: any) => apiService.post<Order>('/orders', orderData, true),
};

export const authService = {
    login: (credentials: LoginRequest) => apiService.post<AuthResponse>('/auth/login', credentials),
    register: (userData: RegisterRequest) => apiService.post<AuthResponse>('/auth/register', userData),
};

export const adminService = {
    getStats: () => apiService.get<any>('/admin/stats'),
    getSalesByCategory: () => apiService.get<any>('/admin/sales-by-category'),
    getTopProducts: () => apiService.get<any>('/admin/top-products'),
    getSalesByPayment: () => apiService.get<any>('/admin/sales-by-payment'),
};

export const cartService = {
    getCart: () => apiService.get<any>('/cart', true),
    addToCart: (productId: number, quantity: number = 1) =>
        apiService.post<any>('/cart', { productId, quantity }, true),
    updateCartItem: (productId: number, quantity: number) =>
        apiService.put<any>(`/cart/${productId}`, { productId, quantity }, true),
    removeFromCart: (productId: number) =>
        apiService.delete<void>(`/cart/${productId}`, true),
    clearCart: () => apiService.delete<void>('/cart', true),
};