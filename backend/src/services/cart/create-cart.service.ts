import prisma from "../../lib/prisma.js";
import { randomUUID } from "crypto";

class CreateCartService {
    async execute(){
        const cart = await prisma.cart.create({
            data: { uuid: randomUUID() }
        })

        return cart;
    }
}

export { CreateCartService }