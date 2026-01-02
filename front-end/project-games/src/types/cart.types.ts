import { Product, ProductOption } from './index';

export interface CartItem {
  id: string;
  cartId: string;
  productOptionId: string;
  quantity: number;
  createdAt: string;
  productOption: ProductOption & {
    product: Product;
  };
}

export interface Cart {
  id: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface CartTotal {
  total: string;
}
