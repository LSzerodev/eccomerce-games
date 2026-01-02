export interface ProductOption {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  createdAt: string;
}

export interface CreateProductOptionData {
  name: string;
  description?: string;
  price: number;
  stock?: number;
}
