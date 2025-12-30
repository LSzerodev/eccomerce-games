"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import { BuyButton } from "@/components/buttons/buy-button/buy-button";
import { IoMdCard } from "react-icons/io";
import styles from "./cart-summary.module.css";

export function CartSummary() {
  const router = useRouter();
  const { cartItems, cartTotal, isLoading } = useCart();

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.productOption.price) * item.quantity;
  }, 0);

  const formattedTotal = cartTotal
    ? Number(cartTotal).toFixed(2).replace(".", ",")
    : subtotal.toFixed(2).replace(".", ",");

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className={styles.summary}>
      <h2 className={styles.summaryTitle}>Resumo do Pedido</h2>

      <div className={styles.summaryContent}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Subtotal:</span>
          <span className={styles.summaryValue}>
            R$ {subtotal.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Total:</span>
          <span className={styles.summaryTotalValue}>R$ {formattedTotal}</span>
        </div>
      </div>

      <div className={styles.summaryActions}>
        <BuyButton
          className={styles.checkoutButton}
          onClick={handleCheckout}
          disabled={isLoading || cartItems.length === 0}
        >
          <IoMdCard size={20} color="#1B1B30" />
          <span>Finalizar Compra</span>
        </BuyButton>

        <button
          className={styles.continueShoppingButton}
          onClick={() => router.push("/")}
        >
          Continuar Comprando
        </button>
      </div>
    </div>
  );
}
