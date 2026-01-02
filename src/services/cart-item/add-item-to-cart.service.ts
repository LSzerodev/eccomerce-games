import prisma from '../../lib/prisma.js';

interface IAddItemToCardService {
  cartUuid: string;
  productOptionId: string;
  quantity: number;
}

class AddItemToCardService {
  async execute(data: IAddItemToCardService) {
    const cart = await prisma.cart.findUnique({
      where: { uuid: data.cartUuid },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const productOption = await prisma.productOption.findUnique({
      where: { id: data.productOptionId },
    });

    if (!productOption) throw new Error('Product option not found');

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

    const totalQuantity = existingItem ? existingItem.quantity + data.quantity : data.quantity;

    if (totalQuantity > productOption.stock) {
      throw new Error(
        `Insufficient stock. Available: ${productOption.stock}, Requested: ${totalQuantity}`
      );
    }

    let item;

    if (existingItem) {
      item = await prisma.cartItem.update({
        where: {
          cartId_productOptionId: {
            cartId: cart.id,
            productOptionId: productOption.id,
          },
        },
        data: {
          quantity: existingItem.quantity + data.quantity,
        },
      });
    } else {
      item = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productOptionId: productOption.id,
          quantity: data.quantity,
        },
      });
    }

    return item;
  }
}

export { AddItemToCardService };
