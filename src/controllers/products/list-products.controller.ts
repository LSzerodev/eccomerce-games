import type { Request, Response } from "express";
import { ListProductsService } from "../../services/products/list-products.service.js";

export class ListProductsController {
    async handle(req: Request, res: Response){
        try {
            const listProductsService = new ListProductsService()
            const products = await listProductsService.execute()
            return res.status(200).json(products)
        } catch (error: any) {
            return res.status(400).json({error: error.message})
        }
    }
}