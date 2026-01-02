import prisma from '../../lib/prisma.js';

export class DeleteProductOptionService {
  async execute(productOptionId: string) {
    const productOption = await prisma.productOption.findUnique({
      where: { id: productOptionId },
    });

    if (!productOption) throw new Error('Product option not found');

    await prisma.productOption.delete({
      where: { id: productOptionId },
    });

    return { message: 'Product option deleted successfully' };
  }
}


