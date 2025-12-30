import type { Request, Response } from 'express';
import { PixGeneratorService } from '../../services/pix/pix-generator.service.js';

class PixGeneratorController {
  async handle(req: Request, res: Response) {
    try {
      const { cartUuid } = req.params;
      const { description } = req.body;

      if (!cartUuid) {
        return res.status(400).json({
          message: 'cartUuid é obrigatório',
        });
      }

      const pixGeneratorService = new PixGeneratorService();
      const pix = await pixGeneratorService.execute({
        cartUuid,
        description,
      });

      return res.status(200).json(pix);
    } catch (erro: any) {
      console.error('Erro ao gerar PIX:', erro);
      console.error('Stack trace:', erro.stack);

      if (erro.message === 'Cart not found') {
        return res.status(404).json({
          message: 'Carrinho não encontrado',
          error: erro.message,
        });
      }

      if (erro.message === 'Carrinho vazio ou sem itens válidos' || erro.message === 'Valor do carrinho deve ser maior que zero') {
        return res.status(400).json({
          message: erro.message,
        });
      }

      if (erro.message && erro.message.includes('Erro ao gerar código PIX')) {
        return res.status(500).json({
          message: 'Erro ao gerar código PIX',
          error: erro.message,
          details: 'Verifique se os dados da chave PIX estão corretos',
        });
      }

      if (erro.message && erro.message.includes('Erro ao gerar QR Code')) {
        return res.status(500).json({
          message: 'Erro ao gerar QR Code',
          error: erro.message,
        });
      }

      return res.status(500).json({
        message: 'Erro ao gerar PIX',
        error: erro.message || 'Erro desconhecido',
      });
    }
  }
}

export { PixGeneratorController };
