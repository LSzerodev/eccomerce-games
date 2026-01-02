import { NextFunction, Request, Response } from 'express';

/**
 * Middleware simples de autenticação admin usando API Key
 * Valida se a requisição contém a API Key correta no header
 */
export function adminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Obter a API Key do header
    const apiKey = req.headers['x-api-key'] || req.headers['authorization'];

    // Verificar se a API Key foi fornecida
    if (!apiKey) {
      console.log('[AdminAuth] API Key não fornecida. Headers recebidos:', {
        'x-api-key': req.headers['x-api-key'],
        authorization: req.headers['authorization'],
        method: req.method,
        url: req.url,
      });
      return res.status(401).json({
        error: "API Key não fornecida. Adicione o header 'x-api-key' com sua chave de acesso.",
      });
    }

    // Obter a API Key esperada do ambiente
    const expectedApiKey = process.env.ADMIN_SECRET_KEY;

    if (!expectedApiKey) {
      console.error('ADMIN_SECRET_KEY não configurado no .env');
      return res.status(500).json({
        error: 'Erro de configuração do servidor',
      });
    }

    // Se vier no formato "Bearer <key>", extrair apenas a key
    const providedKey =
      typeof apiKey === 'string' && apiKey.startsWith('Bearer ')
        ? apiKey.substring(7).trim()
        : String(apiKey).trim();

    // Comparar as chaves (trim para evitar problemas com espaços)
    const expectedKeyTrimmed = expectedApiKey.trim();

    if (providedKey !== expectedKeyTrimmed) {
      console.log('[AdminAuth] API Key inválida. Comparação:', {
        providedLength: providedKey.length,
        expectedLength: expectedKeyTrimmed.length,
        providedStartsWith: providedKey.substring(0, 5) + '...',
        expectedStartsWith: expectedKeyTrimmed.substring(0, 5) + '...',
        method: req.method,
        url: req.url,
      });
      return res.status(403).json({
        error: 'API Key inválida. Acesso negado.',
      });
    }

    // Autenticação bem-sucedida, continuar
    console.log('[AdminAuth] Autenticação bem-sucedida para:', req.method, req.url);
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
