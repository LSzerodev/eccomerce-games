'use client';

import styles from './header.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BsCart3, BsSearch } from 'react-icons/bs';
import { useCart } from '@/context/CartProvider';

export function Header() {
  const router = useRouter();
  const { itemCount } = useCart();

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <BsSearch className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.actions}>
          <button
            className={styles.cartButton}
            aria-label="Carrinho de compras"
            onClick={handleCartClick}
          >
            <BsCart3 size={24} />
            {itemCount > 0 && (
              <span className={styles.cartBadge}>{itemCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
