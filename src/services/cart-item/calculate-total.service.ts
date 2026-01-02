import prisma from '../../lib/prisma.js';
import { calculateCartTotal } from '../../utils/calculate-cart-total.js';

class CalculateTotalService {
  async execute(cartUuid: string) {
    const cart = await prisma.cart.findUnique({
      where: { uuid: cartUuid },
    });

    if (!cart) throw new Error('Cart not found');

    const items = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
      },
      include: {
        productOption: true,
      },
    });

    if (items.length === 0) return 0;
    return calculateCartTotal(items);
  }
}

export { CalculateTotalService };
