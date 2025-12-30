import prisma from '../../lib/prisma.js';

interface ICreateProductService {
  name: string;
  description?: string;
  imageUrl?: string;
}

export class CreateProductService {
  async execute(data: ICreateProductService) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Product name is required');
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
      },
    });

    if (!product) throw new Error('Product not created');

    return product;
  }
}
