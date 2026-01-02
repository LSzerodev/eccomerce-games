import prisma from '../../lib/prisma.js';

class ListItemsToCartService {
  async execute(cartUuid: string) {
    const cart = await prisma.cart.findUnique({
      where: { uuid: cartUuid },
    });

    if (!cart) throw new Error('Cart not found');

    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        productOption: {
          include: {
            product: true,
          },
        },
      },
    });

    return items;
  }
}

export { ListItemsToCartService };
