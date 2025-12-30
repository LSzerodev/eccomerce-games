import { api } from '../api';

export interface ValidateApiKeyResponse {
  valid: boolean;
  message?: string;
  error?: string;
}

export const AuthServices = {
  async validateApiKey(apiKey: string): Promise<ValidateApiKeyResponse> {
    try {
      const response = await api.post<ValidateApiKeyResponse>(
        '/admin/validate',
        {},
        {
          headers: {
            'x-api-key': apiKey,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: ValidateApiKeyResponse } };
        if (axiosError.response?.data) {
          return axiosError.response.data;
        }
      }
      // Erro de rede ou outro erro
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao validar chave de acesso';
      return {
        valid: false,
        error: errorMessage,
      };
    }
  },
};
