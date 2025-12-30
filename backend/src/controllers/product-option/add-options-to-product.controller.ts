import type { Request, Response } from 'express';
import { AddOptionsToProductService } from '../../services/product-option/add-options-to-product.service.js';

export class AddOptionsToProductController {
  async handle(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { name, description, price, stock } = req.body;

      if (!productId) {
        return res.status(400).json({
          error: 'Product ID is required',
        });
      }

      if (!name || price === undefined) {
        return res.status(400).json({
          error: 'Name and price are required',
        });
      }

      const addOptionsToProductService = new AddOptionsToProductService();
      const productOption = await addOptionsToProductService.execute({
        productId,
        name,
        description,
        price: Number(price),
        stock: stock ? Number(stock) : 0,
      });

      return res.status(201).json(productOption);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
