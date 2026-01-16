import { api } from "../api";

export const CartItemServices = {
    async addItemToCart(cartUuid: string, productOptionId: string, quantity: number = 1){
        if (!cartUuid) {
            throw new Error("cartUuid é obrigatório");
        }
        if (!productOptionId) {
            throw new Error("productOptionId é obrigatório");
        }
        if (!quantity || quantity <= 0) {
            throw new Error("quantity deve ser maior que 0");
        }
        return await api.post(`/carts/${cartUuid}/items`, {
            productOptionId,
            quantity
        });
    },
    async getAllListItemsToCart(cartUuid: string){
        return await api.get(`/carts/${cartUuid}/items`);
    },
    async updateItemQuantity(cartUuid: string, productOptionId: string, quantity: number){
        return await api.put(`/carts/${cartUuid}/items/${productOptionId}`, {
            quantity
        });
    },
    async deleteItemToProduct(cartUuid: string, productOptionId: string){
        return await api.delete(`/carts/${cartUuid}/items/${productOptionId}`);
    },
    async calculateTotal(cartUuid: string){
        return await api.get(`/carts/${cartUuid}/total`);
    }
}
