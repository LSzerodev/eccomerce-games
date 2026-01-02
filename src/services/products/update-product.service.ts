import prisma from '../../lib/prisma.js';

interface IUpdateProductService {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  stock?: number;
  productOptionId?: string;
}

class UpdateProductService {
  async execute(
    productId: string,
    { name, price, description, imageUrl, stock, productOptionId }: IUpdateProductService
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { productOptions: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description: description ?? null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl ?? null }),
      },
    });

    if (price !== undefined || stock !== undefined) {
      const optionId = productOptionId || product.productOptions[0]?.id;

      if (optionId) {
        await prisma.productOption.update({
          where: { id: optionId },
          data: {
            ...(price !== undefined && { price }),
            ...(stock !== undefined && { stock }),
          },
        });
      } else {
        await prisma.productOption.create({
          data: {
            productId: product.id,
            name: `${product.name} - Padrão`,
            description: product.description ?? null,
            price: price || 0,
            stock: stock || 0,
          },
        });
      }
    }

    return await prisma.product.findUnique({
      where: { id: productId },
      include: {
        productOptions: true,
      },
    });
  }
}

export { UpdateProductService };
