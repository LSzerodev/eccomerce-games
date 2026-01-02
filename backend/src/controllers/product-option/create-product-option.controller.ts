import type { Request, Response } from 'express';
import { CreateProductOptionService } from '../../services/product-option/create-product-option.service.js';

export class CreateProductOptionController {
  async handle(req: Request, res: Response) {
    try {
      const { productId, name, description, price, stock } = req.body;

      const createProductOptionService = new CreateProductOptionService();
      const productOption = await createProductOptionService.execute({
        productId,
        name,
        description,
        price,
        stock,
      });

      return res.status(201).json(productOption);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
