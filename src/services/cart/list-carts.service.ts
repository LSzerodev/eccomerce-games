import prisma from "../../lib/prisma.js"

class ListCartsService {
    async execute(){
        const carts = await prisma.cart.findMany()
        return carts
    }
}


export { ListCartsService }
