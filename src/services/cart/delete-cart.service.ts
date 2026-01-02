import prisma from "../../lib/prisma.js";

class DeleteCartService{
    async execute(cartUuid: string){

        const cart = await prisma.cart.delete({
            where: { uuid: cartUuid }
        })

        return cart;
    }
}

export { DeleteCartService }