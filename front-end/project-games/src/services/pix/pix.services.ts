import { api } from '../api';

export const PixServices = {
  async generatePix(cartUuid: string, description?: string) {
    return await api.post(`/carts/${cartUuid}/pix`, { description });
  },
};
