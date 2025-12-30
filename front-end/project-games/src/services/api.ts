import axios from 'axios';

export const api = axios.create({ baseURL: 'http://localhost:3333' });

// Função auxiliar para obter a chave do cookie
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift() || null;
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
  } catch (error) {
    console.error('Erro ao ler cookie:', error);
  }

  return null;
}

// Interceptor para adicionar API Key nas requisições admin
api.interceptors.request.use(
  (config) => {
    // Obter a API Key do cookie (definido pela API route)
    if (typeof window !== 'undefined') {
      const apiKey = getCookie('admin_key_client');

      if (apiKey) {
        // Lista de rotas que requerem autenticação admin (POST, PUT, DELETE)
        // Nota: /productOptions (camelCase) é a rota correta no backend
        const adminRoutes = ['/products', '/productOptions'];

        // Obter a URL completa ou relativa
        const url = config.url || '';
        const method = (config.method || '').toLowerCase();

        // Verificar se é uma rota admin que requer autenticação
        // (POST, PUT, DELETE em rotas de produtos ou opções de produtos)
        const isAdminRoute = adminRoutes.some((route) => {
          // Verifica se a URL contém a rota (funciona com URLs relativas e absolutas)
          return url.includes(route);
        });

        // Adicionar API Key em requisições admin (POST, PUT, DELETE)
        // GET não precisa de autenticação
        if (isAdminRoute && method !== 'get') {
          config.headers['x-api-key'] = apiKey;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Erro de autenticação:', error.response?.data?.error);
      // Você pode adicionar uma notificação aqui se quiser
    }
    return Promise.reject(error);
  }
);
