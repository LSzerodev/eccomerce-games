import type { Request, Response } from 'express';
import { DeleteItemToProductService } from '../../services/cart-item/Delete-item-to-product.service.js';

class DeleteItemToProductController {
  async handle(req: Request, res: Response) {
    try {
      const { cartUuid, productOptionId } = req.params;

      if (!cartUuid) {
        return res.status(400).json({ error: 'Missing required parameter: cartUuid' });
      }

      if (!productOptionId) {
        return res.status(400).json({ error: 'Missing required parameter: productOptionId' });
      }

      const deleteItemToProductService = new DeleteItemToProductService();
      await deleteItemToProductService.execute(cartUuid, productOptionId);

      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteItemToProductController };
