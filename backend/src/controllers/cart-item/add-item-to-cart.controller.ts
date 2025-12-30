import type { Request, Response } from 'express';
import { AddItemToCardService } from '../../services/cart-item/add-item-to-cart.service.js';

class AddItemToCartController {
  async handle(req: Request, res: Response) {
    try {
      const { cartUuid } = req.params;
      const { productOptionId, quantity } = req.body;

      if (!cartUuid) {
        return res.status(400).json({ error: 'Missing required parameter: cartUuid' });
      }

      const addItemToCartService = new AddItemToCardService();
      const item = await addItemToCartService.execute({
        cartUuid,
        productOptionId,
        quantity: Number(quantity),
      });

      return res.status(201).json(item);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { AddItemToCartController };
