import prisma from '../../lib/prisma.js';

interface IUpdateItemQuantityService {
  cartUuid: string;
  productOptionId: string;
  quantity: number;
}

class UpdateItemQuantityService {
  async execute(data: IUpdateItemQuantityService) {
    const cart = await prisma.cart.findUnique({
      where: { uuid: data.cartUuid },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const productOption = await prisma.productOption.findUnique({
      where: { id: data.productOptionId },
    });

    if (!productOption) {
      throw new Error('Product option not found');
    }

    if (data.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productOptionId: {
          cartId: cart.id,
          productOptionId: productOption.id,
        },
      },
    });

    if (!existingItem) {
      throw new Error('Item not found in cart');
    }

    if (data.quantity > productOption.stock) {
      throw new Error(
        `Insufficient stock. Available: ${productOption.stock}, Requested: ${data.quantity}`
      );
    }

    const item = await prisma.cartItem.update({
      where: {
        cartId_productOptionId: {
          cartId: cart.id,
          productOptionId: productOption.id,
        },
      },
      data: {
        quantity: data.quantity,
      },
      include: {
        productOption: {
          include: {
            product: true,
          },
        },
      },
    });

    return item;
  }
}

export { UpdateItemQuantityService };
