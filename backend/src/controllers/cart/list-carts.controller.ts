import { ListCartsService } from "../../services/cart/list-carts.service.js"
import type { Request, Response } from "express"

class ListCartsController {
    async handle(req: Request, res: Response){
        try{
            const listCartsService = new ListCartsService()
            const carts = await listCartsService.execute()
            return res.status(200).json(carts)
        }catch(error: any){
            return res.status(400).json({error: error.message})
        }
    }
}

export { ListCartsController }
