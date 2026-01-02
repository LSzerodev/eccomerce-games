import prisma from '../../lib/prisma.js';

export class DeleteProductOptionService {
  async execute(productId: string) {

    const product = await prisma.product.deleteMany({
      where: {
        id: productId,
      },
    });

    if (!product) throw new Error('Product not found');

    return product;
  }
}
