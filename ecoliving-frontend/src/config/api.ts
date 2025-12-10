// Configuración de la API
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'https://proyecto-innovacion-digital.onrender.com',
  timeout: 10000,
};

// Helper para construir URLs de la API
export const buildApiUrl = (endpoint: string): string => {
  // Si estamos en desarrollo, usar el proxy de Vite
  if (import.meta.env.DEV) {
    return `/api${endpoint}`;
  }
  // En producción, usar la URL completa
  return `${API_CONFIG.baseURL}${endpoint}`;
};
