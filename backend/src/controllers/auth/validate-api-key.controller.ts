import type { Request, Response } from 'express';
import { ValidateApiKeyService } from '../../services/auth/validate-api-key.service.js';

export class ValidateApiKeyController {
  async handle(req: Request, res: Response) {
    try {
      const apiKey = req.headers['x-api-key'] || req.headers['authorization'];

      if (!apiKey) {
        return res.status(401).json({
          valid: false,
          error: "API Key não fornecida. Adicione o header 'x-api-key' com sua chave de acesso.",
        });
      }

      const providedKey =
        typeof apiKey === 'string' && apiKey.startsWith('Bearer ')
          ? apiKey.substring(7).trim()
          : String(apiKey).trim();

      const validateApiKeyService = new ValidateApiKeyService();
      const isValid = await validateApiKeyService.execute(providedKey);

      if (!isValid) {
        return res.status(403).json({
          valid: false,
          error: 'API Key inválida. Acesso negado.',
        });
      }

      return res.status(200).json({
        valid: true,
        message: 'API Key válida.',
      });
    } catch (error: any) {
      return res.status(500).json({
        valid: false,
        error: error.message || 'Erro interno do servidor',
      });
    }
  }
}
