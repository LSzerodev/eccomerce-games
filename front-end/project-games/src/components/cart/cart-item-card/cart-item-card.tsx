"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import { CartItem } from "@/types";
import { IoTrashOutline, IoAdd, IoRemove } from "react-icons/io5";
import Image from "next/image";
import styles from "./cart-item-card.module.css";
import { isValidUrl } from "@/lib/utils";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const router = useRouter();
  const { updateItemQuantity, removeItemFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const product = item.productOption.product;
  const productOption = item.productOption;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemove();
      return;
    }

    setIsUpdating(true);
    try {
      await updateItemQuantity(item.productOptionId, newQuantity);
    } catch (error: any) {
      console.error("Erro ao atualizar quantidade:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItemFromCart(item.productOptionId);
    } catch (error) {
      console.error("Erro ao remover item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProductClick = () => {
    router.push(`/${product.id}`);
  };

  const itemTotal = Number(productOption.price) * item.quantity;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer} onClick={handleProductClick}>
        {isValidUrl(product.imageUrl) ? (
          <Image
            src={product.imageUrl!}
            alt={product.name}
            width={120}
            height={120}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.placeholderImage}>Sem imagem</div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.productInfo}>
          <h3 className={styles.productName} onClick={handleProductClick}>
            {product.name}
          </h3>
          <p className={styles.productOption}>Opção: {productOption.name}</p>
          <p className={styles.price}>
            R$ {Number(productOption.price).toFixed(2).replace(".", ",")} cada
          </p>
        </div>

        <div className={styles.actions}>
          <div className={styles.quantityControl}>
            <button
              className={styles.quantityButton}
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              aria-label="Diminuir quantidade"
            >
              <IoRemove size={18} />
            </button>
            <span className={styles.quantity}>{item.quantity}</span>
            <button
              className={styles.quantityButton}
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= productOption.stock}
              aria-label="Aumentar quantidade"
            >
              <IoAdd size={18} />
            </button>
          </div>

          <div className={styles.totalPrice}>
            <p className={styles.totalLabel}>Total:</p>
            <p className={styles.totalValue}>
              R$ {itemTotal.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <button
            className={styles.removeButton}
            onClick={handleRemove}
            disabled={isUpdating}
            aria-label="Remover item"
          >
            <IoTrashOutline size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
