import { api } from '../api';

export const CartServices = {
  async createCart() {
    return await api.post('/carts');
  },
  async getAllListCarts() {
    return await api.get('/carts');
  },
  async deleteCart(uuid: string) {
    return await api.delete(`/carts/${uuid}`);
  },
};
