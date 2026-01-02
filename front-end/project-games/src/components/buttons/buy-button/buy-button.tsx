import styles from './buy-button.module.css';

interface BuyButtonProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export function BuyButton({ children, className, onClick, disabled }: BuyButtonProps) {
    return (
        <button className={`${styles.buyButton} ${className}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}
