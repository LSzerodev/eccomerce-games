import type { Request, Response } from 'express';
import { UpdateItemQuantityService } from '../../services/cart-item/update-item-quantity.service.js';

class UpdateItemQuantityController {
  async handle(req: Request, res: Response) {
    try {
      const { cartUuid, productOptionId } = req.params;
      const { quantity } = req.body;

      const updateItemQuantityService = new UpdateItemQuantityService();
      const item = await updateItemQuantityService.execute({
        cartUuid: cartUuid as string,
        productOptionId: productOptionId as string,
        quantity: Number(quantity),
      });

      return res.status(200).json(item);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateItemQuantityController };
