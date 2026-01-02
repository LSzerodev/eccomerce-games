import type { Request, Response } from "express";
import { UpdateProductService } from "../../services/products/update-product.service.js";

class UpdateProductController {
    async handle(req: Request, res: Response){
        try {
            const { id } = req.params
            const { name, price, description, imageUrl, stock } = req.body

            const updateProductService = new UpdateProductService();
            const productUpdated = await updateProductService.execute(id as string, { name, price, description, imageUrl, stock })

            return res.status(200).json(productUpdated)
        } catch(error: any) {
            return res.status(400).json({error: error.message})
        }
    }
}

export { UpdateProductController }
