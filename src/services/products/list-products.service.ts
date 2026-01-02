import prisma from '../../lib/prisma.js';

export class ListProductsService {
  async execute() {
    try {
      const products = await prisma.product.findMany({
        include: {
          productOptions: true,
        },
      });
      return products;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
