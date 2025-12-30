import type { Request, Response } from "express";
import { DeleteCartService } from "../../services/cart/delete-cart.service.js";

class DeleteCartController {
    async handle(req: Request, res: Response){
        try{
            const { uuid } = req.params
            const deleteCartService = new DeleteCartService()
            await deleteCartService.execute(uuid as string)

            return res.status(204).send()
        }catch(error: any){
            return res.status(400).json({error: error.message})
        }
    }
}

export { DeleteCartController }
