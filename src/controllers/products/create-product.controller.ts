import type { Request, Response } from "express";
import { CreateProductService } from "../../services/products/create-product.service.js";

export class CreateProductController {
    async handle(req: Request, res: Response){
        try {
            const { name, price, description, imageUrl, stock } = req.body
            const createProductService = new CreateProductService()
            const product = await createProductService.execute({
                name,
                description,
                imageUrl,
            })

            return res.status(201).json(product)
        } catch (error: any) {
            return res.status(400).json({error: error.message})
        }
    }
}
