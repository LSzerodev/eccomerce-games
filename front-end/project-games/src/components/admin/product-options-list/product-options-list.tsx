import styles from "./product-options-list.module.css";
import { FiList, FiPackage, FiRefreshCw } from "react-icons/fi";
import { ProductOption } from "@/types";

interface ProductOptionsListProps {
  selectedProductId: string;
  loadingOptions: boolean;
  productOptions: ProductOption[];
  selectedProductName?: string;
}

export function ProductOptionsList({
  selectedProductId,
  loadingOptions,
  productOptions,
  selectedProductName,
}: ProductOptionsListProps) {
  return (
    <div className={styles.optionsSection}>
      <div className={styles.optionsHeader}>
        <h2 className={styles.optionsTitle}>
          <FiList className={styles.titleIcon} size={24} />
          Opções do Produto
        </h2>
        {selectedProductName && (
          <span className={styles.optionsCount}>
            {productOptions.length} {productOptions.length === 1 ? "opção" : "opções"}
          </span>
        )}
      </div>

      {!selectedProductId ? (
        <div className={styles.emptyState}>
          <FiPackage size={48} className={styles.emptyIcon} />
          <p>Selecione um produto para ver suas opções</p>
        </div>
      ) : loadingOptions ? (
        <div className={styles.emptyState}>
          <FiRefreshCw size={48} className={styles.loadingIcon} />
          <p>Carregando opções...</p>
        </div>
      ) : productOptions.length === 0 ? (
        <div className={styles.emptyState}>
          <FiList size={48} className={styles.emptyIcon} />
          <p>Nenhuma opção cadastrada para este produto</p>
          <p className={styles.emptySubtext}>Adicione opções usando o formulário ao lado</p>
        </div>
      ) : (
        <div className={styles.optionsList}>
          {productOptions.map((option) => (
            <div key={option.id} className={styles.optionCard}>
              <div className={styles.optionHeader}>
                <h3 className={styles.optionName}>{option.name}</h3>
                <span className={styles.optionPrice}>
                  R$ {parseFloat(option.price).toFixed(2)}
                </span>
              </div>
              {option.description && (
                <p className={styles.optionDescription}>{option.description}</p>
              )}
              <div className={styles.optionFooter}>
                <span className={styles.optionStock}>
                  Estoque: <strong>{option.stock}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
