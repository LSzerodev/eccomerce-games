import prisma from '../../lib/prisma.js';

class DeleteItemToProductService {
  async execute(cartUuid: string, productOptionId: string) {
    const cart = await prisma.cart.findUnique({
      where: { uuid: cartUuid },
    });

    if (!cart) throw new Error('Cart not found');

    const productOption = await prisma.productOption.findUnique({
      where: { id: productOptionId },
    });

    if (!productOption) throw new Error('Product option not found');

    const item = await prisma.cartItem.delete({
      where: {
        cartId_productOptionId: {
          cartId: cart.id,
          productOptionId: productOption.id,
        },
      },
    });

    return item;
  }
}

export { DeleteItemToProductService };
