import type { Request, Response } from 'express';
import { DeleteProductOptionService } from '../../services/product-option/delete-product-option.service.js';

export class DeleteProductOptionController {
  async handle(req: Request, res: Response) {
    try {
      const { productOptionId } = req.params;

      if (!productOptionId) {
        return res.status(400).json({ error: 'Missing required parameter: productOptionId' });
      }

      const deleteProductOptionService = new DeleteProductOptionService();
      await deleteProductOptionService.execute(productOptionId);

      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}


