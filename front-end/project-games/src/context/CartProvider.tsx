"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartServices } from "@/services/cart/cart.services";
import { CartItemServices } from "@/services/cart-item/cart-item.services";
import { CartItem, CartTotal } from "@/types";

interface CartContextType {
  cartUuid: string | null;
  cartItems: CartItem[];
  cartTotal: string | null;
  isLoading: boolean;
  itemCount: number;
  refreshCart: () => Promise<void>;
  addItemToCart: (productOptionId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (productOptionId: string, quantity: number) => Promise<void>;
  removeItemFromCart: (productOptionId: string) => Promise<void>;
  calculateTotal: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_UUID_KEY = "cart_uuid";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartUuid, setCartUuid] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeCart() {
      try {
        let uuid = localStorage.getItem(CART_UUID_KEY);

        if (!uuid) {
          const response = await CartServices.createCart();
          uuid = response.data.uuid;
          localStorage.setItem(CART_UUID_KEY, uuid as string);
        }

        setCartUuid(uuid);
        await loadCartItems(uuid as string);
      } catch (error) {
        console.error("Erro ao inicializar carrinho:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initializeCart();
  }, []);

  async function loadCartItems(uuid: string) {
    try {
      const response = await CartItemServices.getAllListItemsToCart(uuid);
      setCartItems(response.data || []);
      await calculateTotal(uuid);
    } catch (error) {
      console.error("Erro ao carregar itens do carrinho:", error);
      setCartItems([]);
    }
  }

  async function calculateTotal(uuid?: string) {
    const targetUuid = uuid || cartUuid;
    if (!targetUuid) return;

    try {
      const response = await CartItemServices.calculateTotal(targetUuid);
      setCartTotal(String(response.data.total));
    } catch (error) {
      console.error("Erro ao calcular total:", error);
    }
  }

  async function refreshCart() {
    if (!cartUuid) return;
    await loadCartItems(cartUuid);
  }

  async function addItemToCart(productOptionId: string, quantity: number = 1) {
    if (!cartUuid) return;

    try {
      await CartItemServices.addItemToCart(cartUuid, productOptionId, quantity);
      await refreshCart();
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error);
      throw error;
    }
  }

  async function updateItemQuantity(productOptionId: string, quantity: number) {
    if (!cartUuid) return;

    try {
      await CartItemServices.updateItemQuantity(cartUuid, productOptionId, quantity);
      await refreshCart();
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      throw error;
    }
  }

  async function removeItemFromCart(productOptionId: string) {
    if (!cartUuid) return;

    try {
      await CartItemServices.deleteItemToProduct(cartUuid, productOptionId);
      await refreshCart();
    } catch (error) {
      console.error("Erro ao remover item:", error);
      throw error;
    }
  }

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartUuid,
        cartItems,
        cartTotal,
        isLoading,
        itemCount,
        refreshCart,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        calculateTotal: () => calculateTotal(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
