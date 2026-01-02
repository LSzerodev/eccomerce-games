import prisma from "../../lib/prisma.js";

export class DeleteProductByIdService {
    async execute(productId: string){
        try {
            const product = await prisma.product.delete({
                where: {
                    id: productId
                }
            })
            if(!product) throw new Error("Product not found")

            return product
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}