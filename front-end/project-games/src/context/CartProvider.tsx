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
  addItemToCart: (productOptionId: string, quantity?: number, skipRefresh?: boolean) => Promise<void>;
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
    } catch (error: any) {
      console.error("Erro ao carregar itens do carrinho:", error);
      // Se o carrinho não existir mais, limpa o localStorage e cria um novo
      if (error?.response?.status === 400 && error?.response?.data?.error?.includes('Cart not found')) {
        localStorage.removeItem(CART_UUID_KEY);
        setCartUuid(null);
        // Cria um novo carrinho
        try {
          const response = await CartServices.createCart();
          const newUuid = response.data.uuid;
          localStorage.setItem(CART_UUID_KEY, newUuid);
          setCartUuid(newUuid);
        } catch (createError) {
          console.error("Erro ao criar novo carrinho:", createError);
        }
      }
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

  async function refreshCart(uuid?: string) {
    const targetUuid = uuid || cartUuid || localStorage.getItem(CART_UUID_KEY);
    if (!targetUuid) return;
    await loadCartItems(targetUuid);
  }

  async function addItemToCart(productOptionId: string, quantity: number = 1, skipRefresh: boolean = false) {
    // Se não houver cartUuid, tenta obter do localStorage ou criar um novo
    let currentCartUuid = cartUuid;

    if (!currentCartUuid) {
      currentCartUuid = localStorage.getItem(CART_UUID_KEY);

      if (!currentCartUuid) {
        try {
          const response = await CartServices.createCart();
          currentCartUuid = response.data.uuid;
          localStorage.setItem(CART_UUID_KEY, currentCartUuid as string);
          setCartUuid(currentCartUuid);
        } catch (error) {
          console.error("Erro ao criar carrinho:", error);
          throw new Error("Não foi possível criar o carrinho. Tente novamente.");
        }
      } else {
        setCartUuid(currentCartUuid);
      }
    }

    try {
      const response = await CartItemServices.addItemToCart(currentCartUuid, productOptionId, quantity);

      // Atualizar estado diretamente com a resposta do backend
      if (response.data?.item && response.data?.total !== undefined) {
        const updatedItem = response.data.item;
        setCartTotal(String(response.data.total));

        // Se skipRefresh, atualizar estado otimisticamente e fazer refresh assíncrono
        if (skipRefresh) {
          // Atualizar item se existir, caso contrário fazer refresh assíncrono
          setCartItems(prevItems => {
            const existingIndex = prevItems.findIndex(
              item => item.productOptionId === updatedItem.productOptionId
            );

            if (existingIndex >= 0) {
              // Item já existe, atualizar
              const newItems = [...prevItems];
              newItems[existingIndex] = updatedItem;
              return newItems;
            }
            // Item não existe na lista, fazer refresh assíncrono sem bloquear
            refreshCart(currentCartUuid).catch(err => console.error("Erro no refresh assíncrono:", err));
            return prevItems;
          });
        } else {
          // Fazer refresh completo para garantir sincronização
          await refreshCart(currentCartUuid);
        }
      } else {
        // Fallback: fazer refresh completo se resposta não tiver formato esperado
        if (!skipRefresh) {
          await refreshCart(currentCartUuid);
        } else {
          // Se skipRefresh e resposta inválida, fazer refresh assíncrono
          refreshCart(currentCartUuid).catch(err => console.error("Erro no refresh assíncrono:", err));
        }
      }
    } catch (error: any) {
      console.error("Erro ao adicionar item ao carrinho:", error);
      // Se o carrinho não existir mais, limpa e cria um novo
      if (error?.response?.status === 400 && error?.response?.data?.error?.includes('Cart not found')) {
        localStorage.removeItem(CART_UUID_KEY);
        setCartUuid(null);
        try {
          const response = await CartServices.createCart();
          const newUuid = response.data.uuid;
          localStorage.setItem(CART_UUID_KEY, newUuid);
          setCartUuid(newUuid);
          // Tenta adicionar novamente com o novo carrinho
          await CartItemServices.addItemToCart(newUuid, productOptionId, quantity);
          if (!skipRefresh) {
            await refreshCart(newUuid);
          }
          return;
        } catch (createError) {
          console.error("Erro ao criar novo carrinho:", createError);
          throw new Error("Carrinho não encontrado. Um novo carrinho foi criado, mas não foi possível adicionar o item. Tente novamente.");
        }
      }
      throw error;
    }
  }

  async function updateItemQuantity(productOptionId: string, quantity: number) {
    if (!cartUuid) return;

    // Optimistic update - salvar estado anterior para reverter em caso de erro
    const previousItems = [...cartItems];
    const previousTotal = cartTotal;

    // Calcular total otimisticamente antes de atualizar
    const optimisticTotal = cartItems.reduce((sum, item) => {
      const qty = item.productOptionId === productOptionId ? quantity : item.quantity;
      return sum + Number(item.productOption.price) * qty;
    }, 0);

    // Atualizar estado otimisticamente
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.productOptionId === productOptionId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
    setCartTotal(String(optimisticTotal));

    try {
      const response = await CartItemServices.updateItemQuantity(cartUuid, productOptionId, quantity);

      // Atualizar estado com resposta do backend
      if (response.data?.item && response.data?.total !== undefined) {
        const updatedItem = response.data.item;
        setCartTotal(String(response.data.total));

        setCartItems(prevItems => {
          return prevItems.map(item => {
            if (item.productOptionId === productOptionId) {
              return updatedItem;
            }
            return item;
          });
        });
      }
    } catch (error) {
      // Reverter optimistic update em caso de erro
      setCartItems(previousItems);
      setCartTotal(previousTotal);
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
