import { CreateProductData } from '@/types';
import { api } from '../api';

export interface UpdateProductData {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  stock?: number;
}

export const ProductServices = {
  async createProduct(data: CreateProductData) {
    return await api.post('/products', data);
  },
  async getAllListProducts() {
    return await api.get('/products');
  },
  async getProductById(id: string) {
    return await api.get(`/products/${id}`);
  },
  async updateProduct(id: string, data: UpdateProductData) {
    return await api.put(`/products/${id}`, data);
  },
  async deleteProduct(id: string) {
    return await api.delete(`/products/${id}`);
  },
};
