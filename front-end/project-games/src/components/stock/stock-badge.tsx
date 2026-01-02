import styles from './stock-badge.module.css';
import { BsBoxSeam } from "react-icons/bs";

type StockBadgeProps = {
    stock: number | undefined;
    className?: string;
}

export function StockBadge({ stock, className }: StockBadgeProps) {
    return (
        <div className={`${styles.stockBadge} ${className}`}>
            <BsBoxSeam color='#12FF89' size={18}/>
            <span className={styles.stockText}>{stock} em estoque</span>
        </div>
    );
}
