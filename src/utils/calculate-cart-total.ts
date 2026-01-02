import type { CartItem, ProductOption } from '@prisma/client';

type CartItemWithProductOption = CartItem & {
  productOption: ProductOption;
};

function calculateCartTotal(items: CartItemWithProductOption[]) {
  return items.reduce((acumulator, item) => {
    const itemTotal = Number(item.productOption.price) * item.quantity;
    return acumulator + itemTotal;
  }, 0);
}

export { calculateCartTotal };
