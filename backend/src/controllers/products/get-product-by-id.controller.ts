import type { Request, Response } from "express";
import { FindProductByIdService } from "../../services/products/get-product-by-id.service.js";

export class FindProductByIdController {
    async handle(req: Request, res: Response){
        try{
            const { id } = req.params

            const findProductByIdService = new FindProductByIdService()
            const productbyId = await findProductByIdService.execute(id as string)

            return res.status(200).json(productbyId)

        } catch (error: any) {
            return res.status(400).json({error: error.message})
        }
    }
}
