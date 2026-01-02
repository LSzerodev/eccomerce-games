import type { Prisma } from '@prisma/client';

type CartItemWithProductOption = Prisma.CartItemGetPayload<{
  include: { productOption: true };
}>;

function calculateCartTotal(items: CartItemWithProductOption[]) {
  return items.reduce((acumulator, item) => {
    const itemTotal = Number(item.productOption.price) * item.quantity;
    return acumulator + itemTotal;
  }, 0);
}

export { calculateCartTotal };
