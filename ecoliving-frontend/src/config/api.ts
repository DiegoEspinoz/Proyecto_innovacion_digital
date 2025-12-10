// Configuración de la API
export const API_CONFIG = {
  // ⭐⭐ SIEMPRE apuntar a Render (tu backend) ⭐⭐
  baseURL: 'https://proyecto-innovacion-digital.onrender.com',
  timeout: 15000, // Aumenta timeout para Render
};

// Helper para construir URLs de la API
export const buildApiUrl = (endpoint: string): string => {
  // ⭐⭐ NUNCA usar proxy cuando el backend está en Render ⭐⭐
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_CONFIG.baseURL}${normalizedEndpoint}`;
  
  console.log(`🔗 Construyendo URL para frontend local → Render: ${url}`);
  return url;
};