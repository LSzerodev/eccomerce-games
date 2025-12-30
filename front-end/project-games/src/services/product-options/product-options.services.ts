import { CreateProductOptionData } from '@/types';
import { api } from '../api';

export const ProductOptions = {
  async createProductOptions(data: CreateProductOptionData & { productId: string }) {
    return await api.post('/productOptions', data);
  },
  async addOptionToProduct(productId: string, data: CreateProductOptionData) {
    return await api.post(`/products/${productId}/options`, data);
  },
  async deleteProductOption(productOptionId: string) {
    return await api.delete(`/productOptions/${productOptionId}`);
  },
};
