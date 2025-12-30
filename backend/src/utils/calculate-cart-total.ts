import type { CartItem, ProductOption } from '@prisma/client';

interface CartItemWithProductOption extends CartItem {
  productOption: ProductOption;
}

function calculateCartTotal(items: CartItemWithProductOption[]) {
  return items.reduce((acumulator, item) => {
    const itemTotal = Number(item.productOption.price) * Number(item.quantity);
    return acumulator + itemTotal;
  }, 0);
}

export { calculateCartTotal };
