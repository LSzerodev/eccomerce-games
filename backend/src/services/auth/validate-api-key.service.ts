/**
 * Service para validar API Key do admin
 * Compara a chave fornecida com a chave esperada do ambiente
 */
export class ValidateApiKeyService {
  async execute(apiKey: string): Promise<boolean> {
    try {
      const expectedApiKey = process.env.ADMIN_SECRET_KEY;

      if (!expectedApiKey) {
        return false;
      }

      // Comparar com trim para evitar problemas com espaços em branco
      return apiKey.trim() === expectedApiKey.trim();
    } catch (error: any) {
      console.error('Erro ao validar API Key:', error);
      return false;
    }
  }
}
