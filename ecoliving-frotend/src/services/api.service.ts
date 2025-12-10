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

        console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);

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
                return {
                    id: Date.now(),
                    orderNumber: `DEMO-${Date.now()}`,
                    status: 'COMPLETED',
                    message: 'Orden demo creada exitosamente'
                } as T;
            }

            // Para GET de cart e interests, retornar datos demo
            if ((endpoint.includes('/cart') || endpoint.includes('/interests')) && method === 'GET') {
                console.log('📭 Retornando datos demo para:', endpoint);
                if (endpoint.includes('/cart')) {
                    return [
                        { id: 1, productId: 101, quantity: 2, name: 'Producto Demo 1', price: 99.99 },
                        { id: 2, productId: 102, quantity: 1, name: 'Producto Demo 2', price: 149.99 }
                    ] as T;
                }
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
                mode: 'cors',  // ⭐⭐ IMPORTANTE para CORS ⭐⭐
            });

            console.log(`📊 Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ API Error ${response.status}:`, errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            // Si la respuesta está vacía, retornar objeto vacío
            const text = await response.text();
            return text ? JSON.parse(text) : {} as T;
        } catch (error) {
            console.error('🚨 API request failed:', error);
            console.error('🔍 URL attempted:', url);
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

// ⭐⭐ SERVICIOS CORREGIDOS - TODAS LAS RUTAS CON /api ⭐⭐

// Productos - CON /api/products
export const productService = {
    getAll: () => apiService.get<Product[]>('/api/products'),
    getById: (id: number) => apiService.get<Product>(`/api/products/${id}`),
    getByCategory: (category: string) => apiService.get<Product[]>(`/api/products/category/${category}`),
    search: (query: string) => apiService.get<Product[]>(`/api/products/search?q=${query}`),
};

// Categorías - CON /api/categories
export const categoryService = {
    getAll: () => apiService.get<string[]>('/api/categories'),
};

// Órdenes - CON /api/orders
export const orderService = {
    getAll: () => apiService.get<Order[]>('/api/orders'),
    getById: (id: number) => apiService.get<Order>(`/api/orders/${id}`),
    getByUserId: (userId: number) => apiService.get<Order[]>(`/api/orders/user/${userId}`),
    create: (orderData: any) => apiService.post<Order>('/api/orders', orderData, true), // Requiere X-User-Id
};

// Usuarios / Autenticación - CON /api/auth
export const authService = {
    login: (credentials: LoginRequest) => apiService.post<AuthResponse>('/api/auth/login', credentials),
    register: (userData: RegisterRequest) => apiService.post<AuthResponse>('/api/auth/register', userData),
};

// Intereses de productos - CON /api/interests
export const interestService = {
    trackProductInterest: (productId: number) =>
        apiService.post<void>(`/api/interests/${productId}`, undefined, true), // Requiere X-User-Id
    getRecommendedProducts: () =>
        apiService.get<Product[]>('/api/interests/recommended', true), // Requiere X-User-Id
};

// Admin - CON /api/admin
export const adminService = {
    getStats: () => apiService.get<any>('/api/admin/stats'),
    getSalesByCategory: () => apiService.get<any>('/api/admin/sales-by-category'),
    getTopProducts: () => apiService.get<any>('/api/admin/top-products'),
    getSalesByPayment: () => apiService.get<any>('/api/admin/sales-by-payment'),
};

// Cart Service - CON /api/cart
export const cartService = {
    getCart: () => apiService.get<any>('/api/cart', true),
    addToCart: (productId: number, quantity: number = 1) =>
        apiService.post<any>('/api/cart', { productId, quantity }, true),
    updateCartItem: (productId: number, quantity: number) =>
        apiService.put<any>(`/api/cart/${productId}`, { productId, quantity }, true),
    removeFromCart: (productId: number) =>
        apiService.delete<void>(`/api/cart/${productId}`, true),
    clearCart: () => apiService.delete<void>('/api/cart', true),
};

// User Service - CON /api/users
export const userService = {
    getAll: () => apiService.get<any[]>('/api/users'),
    getById: (id: number) => apiService.get<any>(`/api/users/${id}`),
};