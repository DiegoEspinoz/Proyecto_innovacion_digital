export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  ecoFeatures: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt?: string;
  token?: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  avenue?: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  shippingAddress?: ShippingAddress;
}

export interface UserSettings {
  darkMode: boolean;
  cookiesAccepted: boolean;
  notifications: boolean;
}

export interface SalesStats {
  daily: number;
  weekly: number;
  monthly: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface Event {
  id: number;
  name: string;
  discountPercentage: number;
  productIds: number[];
  isActive: boolean;
  color: string;
  icon: string;
}

export type EventType = 'summer' | 'winter' | 'patriotic' | 'halloween' | 'christmas' | 'none';

// Tipos para autenticación
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'admin';
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'customer' | 'admin';
}