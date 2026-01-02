import type { Request, Response } from "express";
import { DeleteProductByIdService } from "../../services/products/delete-product-by-id.service.js";

export class DeleteProductByIdController {
    async handle( req: Request, res: Response ){
        try {
            const {id} = req.params
            const deleteProductByIdService = new DeleteProductByIdService();
            await deleteProductByIdService.execute(id as string)

            return res.status(204).send()

        } catch(error: any) {
            return res.status(400).json({error: error.message})
        }
    }
}
