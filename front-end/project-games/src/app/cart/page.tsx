"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import styles from "./cart.module.css";
import { CartItemCard } from "@/components/cart/cart-item-card/cart-item-card";
import { CartSummary } from "@/components/cart/cart-summary/cart-summary";
import { useCart } from "@/context/CartProvider";
import { IoArrowBack } from "react-icons/io5";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, isLoading, refreshCart, cartTotal } = useCart();

  useEffect(() => {
    refreshCart();
  }, []);

  if (isLoading) {
    return (
      <section className={styles.container}>
        <div className={styles.loading}>
          <p>Carregando carrinho...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => router.back()}
        aria-label="Voltar"
      >
        <IoArrowBack size={24} color="#FFFFFF" />
      </button>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meu Carrinho</h1>
          <p className={styles.subtitle}>
            {cartItems.length === 0
              ? "Seu carrinho está vazio"
              : `${cartItems.length} ${cartItems.length === 1 ? "item" : "itens"}`}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <div className={styles.emptyCartIcon}>🛒</div>
            <h2 className={styles.emptyCartTitle}>Seu carrinho está vazio</h2>
            <p className={styles.emptyCartText}>
              Adicione produtos ao seu carrinho para continuar comprando
            </p>
            <button
              className={styles.emptyCartButton}
              onClick={() => router.push("/")}
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.itemsSection}>
              {cartItems.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            <div className={styles.summarySection}>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
