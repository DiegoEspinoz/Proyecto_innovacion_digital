import { buildApiUrl } from '../config/api';
import { Product, Order, AuthResponse, LoginRequest, RegisterRequest } from '../types';

// Servicio genérico para hacer peticiones HTTP
class ApiService {
    private getAuthToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    private getUserId(): number | null {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user.id;
        }
        return null;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        requiresUserId: boolean = false
    ): Promise<T> {
        const url = buildApiUrl(endpoint);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        };

        // Agregar token si existe
        const token = this.getAuthToken();

        // Si es un token demo, permitir solo lectura de órdenes y productos
        if (token && token.startsWith('demo-')) {
            const method = options.method || 'GET';
            console.log('🎭 Token demo detectado:', endpoint, method);

            // Bloquear operaciones de escritura en cart e interests
            if ((endpoint.includes('/cart') || endpoint.includes('/interests')) && method !== 'GET') {
                console.log('⛔ Operación bloqueada para token demo');
                return [] as T;
            }

            // Permitir lectura de órdenes (GET /orders)
            // Bloquear creación de órdenes (POST /orders)
            if (endpoint.includes('/orders') && method !== 'GET') {
                console.log('⛔ Creación de órdenes bloqueada para token demo');
                return {} as T;
            }

            // Para GET de cart e interests, retornar vacío
            if ((endpoint.includes('/cart') || endpoint.includes('/interests')) && method === 'GET') {
                console.log('📭 Retornando datos vacíos para:', endpoint);
                return [] as T;
            }
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Agregar userId si es requerido
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
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            // Si la respuesta está vacía, retornar objeto vacío
            const text = await response.text();
            return text ? JSON.parse(text) : {} as T;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Métodos GET
    async get<T>(endpoint: string, requiresUserId: boolean = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' }, requiresUserId);
    }

    // Métodos POST
    async post<T>(endpoint: string, data?: any, requiresUserId: boolean = false): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }, requiresUserId);
    }

    // Métodos PUT
    async put<T>(endpoint: string, data: any, requiresUserId: boolean = false): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        }, requiresUserId);
    }

    // Métodos DELETE
    async delete<T>(endpoint: string, requiresUserId: boolean = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' }, requiresUserId);
    }
}

export const apiService = new ApiService();

// Servicios específicos para cada entidad

// Productos
export const productService = {
    getAll: () => apiService.get<Product[]>('/products'),
    getById: (id: number) => apiService.get<Product>(`/products/${id}`),
    getByCategory: (category: string) => apiService.get<Product[]>(`/products/category/${category}`),
    search: (query: string) => apiService.get<Product[]>(`/products/search?q=${query}`),
};

// Categorías
export const categoryService = {
    getAll: () => apiService.get<string[]>('/categories'),
};

// Órdenes
export const orderService = {
    getAll: () => apiService.get<Order[]>('/orders'),
    getById: (id: number) => apiService.get<Order>(`/orders/${id}`),
    getByUserId: (userId: number) => apiService.get<Order[]>(`/orders/user/${userId}`),
    create: (orderData: any) => apiService.post<Order>('/orders', orderData, true), // Requiere X-User-Id
};

// Usuarios / Autenticación
export const authService = {
    login: (credentials: LoginRequest) => apiService.post<AuthResponse>('/auth/login', credentials),
    register: (userData: RegisterRequest) => apiService.post<AuthResponse>('/auth/register', userData),
};

// Intereses de productos
export const interestService = {
    trackProductInterest: (productId: number) =>
        apiService.post<void>(`/interests/${productId}`, undefined, true), // Requiere X-User-Id
    getRecommendedProducts: () =>
        apiService.get<Product[]>('/interests/recommended', true), // Requiere X-User-Id
};

// Admin
export const adminService = {
    getStats: () => apiService.get<any>('/admin/stats'),
    getSalesByCategory: () => apiService.get<any>('/admin/sales-by-category'),
    getTopProducts: () => apiService.get<any>('/admin/top-products'),
    getSalesByPayment: () => apiService.get<any>('/admin/sales-by-payment'),
};

// Cart Service
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

// User Service
export const userService = {
    getAll: () => apiService.get<any[]>('/users'),
    getById: (id: number) => apiService.get<any>(`/users/${id}`),
};
