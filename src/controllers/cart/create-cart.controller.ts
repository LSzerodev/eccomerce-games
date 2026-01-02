import type { Request, Response } from "express";
import { CreateCartService } from "../../services/cart/create-cart.service.js";

class CreateCartController {
    async handle(req: Request, res: Response){
        try{
            const createCartService = new CreateCartService()
            const cart = await createCartService.execute()
            return res.status(201).json(cart)
        }catch(error: any){
            return res.status(400).json({error: error.message})
        }
    }
}

export { CreateCartController }
