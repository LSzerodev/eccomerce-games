
export class ValidateApiKeyService {
  async execute(apiKey: string): Promise<boolean> {
    try {
      const expectedApiKey = process.env.ADMIN_SECRET_KEY;

      if (!expectedApiKey) {
        return false;
      }

      return apiKey.trim() === expectedApiKey.trim();
    } catch (error: any) {
      console.error('Erro ao validar API Key:', error);
      return false;
    }
  }
}
