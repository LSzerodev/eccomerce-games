import { ProductOption } from './product-option.types';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price?: number | string;
  stock?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  productOptions?: ProductOption[];
}

export interface CreateProductData {
  name: string;
  imageUrl: string;
  description: string;
}
