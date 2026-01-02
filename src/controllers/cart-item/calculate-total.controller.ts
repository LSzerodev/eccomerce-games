import type { Request, Response } from "express";
import { CalculateTotalService } from "../../services/cart-item/calculate-total.service.js";

class CalculateTotalController {
    async handle(req: Request, res: Response){
        try{
            const { cartUuid } = req.params;

            if(!cartUuid) return res.status(400).json({ error: 'Missing required parameter: cartUuid' });

            const calculateTotalService = new CalculateTotalService();
            const total = await calculateTotalService.execute(cartUuid);

            return res.status(200).json({ total });
        }catch(error: any){
            return res.status(400).json({ error: error.message });
        }
    }
}

export { CalculateTotalController };
