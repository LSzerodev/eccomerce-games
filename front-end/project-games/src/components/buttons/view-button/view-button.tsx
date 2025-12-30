import styles from './view-button.module.css';

interface ViewButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export function ViewButton({ onClick, children }: ViewButtonProps) {
  return (
    <div className={styles.buttonWrapper}>
      <span className={styles.decorativeTopLeft}></span>
      <span className={styles.decorativeBottomRight}></span>
      <button className={styles.button} onClick={onClick}>
        <span className={styles.buttonText}>{children || 'visualizar'}</span>
      </button>
    </div>
  );
}
