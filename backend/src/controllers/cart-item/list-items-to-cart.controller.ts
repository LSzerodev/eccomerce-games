import type { Request, Response } from 'express';
import { ListItemsToCartService } from '../../services/cart-item/list-items-to-cart.service.js';

class ListItemsToCartController {
  async handle(req: Request, res: Response) {
    try {
      const { cartUuid } = req.params;
      const listItemsToCartService = new ListItemsToCartService();

      const listItems = await listItemsToCartService.execute(cartUuid as string);

      return res.status(200).json(listItems);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { ListItemsToCartController };
