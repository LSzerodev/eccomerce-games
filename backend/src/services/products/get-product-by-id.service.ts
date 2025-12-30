import prisma from '../../lib/prisma.js';

export class FindProductByIdService {
  async execute(productId: string) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        productOptions: true,
      },
    });

    if (!product) throw new Error('Product not found');

    return product;
  }
}
