import { useState } from "react";
import styles from "./product-option-form.module.css";
import { FiPackage, FiDollarSign, FiFileText, FiSave, FiRefreshCw } from "react-icons/fi";
import { CreateProductOptionData } from "@/types";

interface ProductOptionFormProps {
  selectedProductId: string;
  loading: boolean;
  formData: {
    name: string;
    description: string;
    price: string;
    stock: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

export function ProductOptionForm({
  selectedProductId,
  loading,
  formData,
  onInputChange,
  onSubmit,
  onClear,
}: ProductOptionFormProps) {
  return (
    <div className={styles.formSection}>
      <div className={styles.formWrapper}>
        <form className={styles.productForm} onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              <FiPackage className={styles.labelIcon} size={16} />
              Nome da Opção *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              placeholder="Ex: Edição Padrão, Edição Premium, etc."
              value={formData.name}
              onChange={onInputChange}
              required
              disabled={!selectedProductId}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              <FiFileText className={styles.labelIcon} size={16} />
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              placeholder="Descreva esta opção..."
              rows={4}
              value={formData.description}
              onChange={onInputChange}
              disabled={!selectedProductId}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                <FiDollarSign className={styles.labelIcon} size={16} />
                Preço *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className={styles.input}
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={onInputChange}
                required
                disabled={!selectedProductId}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="stock" className={styles.label}>
                <FiPackage className={styles.labelIcon} size={16} />
                Estoque
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className={styles.input}
                placeholder="0"
                min="0"
                value={formData.stock}
                onChange={onInputChange}
                disabled={!selectedProductId}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!selectedProductId || loading}
            >
              {loading ? (
                <>
                  <FiRefreshCw className={styles.buttonIcon} size={20} />
                  Adicionando...
                </>
              ) : (
                <>
                  <FiSave className={styles.buttonIcon} size={20} />
                  Adicionar Opção
                </>
              )}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClear}
              disabled={!selectedProductId || loading}
            >
              Limpar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
