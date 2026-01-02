import prisma from '../../lib/prisma.js';

interface ICreateProductOptionService {
  productId: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
}

export class CreateProductOptionService {
  async execute(data: ICreateProductOptionService) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) throw new Error('Product not found');

    const productOption = await prisma.productOption.create({
      data: {
        productId: data.productId,
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        stock: data.stock ?? 0,
      },
    });

    return productOption;
  }
}
