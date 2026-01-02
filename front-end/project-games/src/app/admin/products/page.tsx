"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "../products-list.module.css";
import {
  FiPackage,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiSearch,
  FiPlus,
  FiCheck,
  FiX,
  FiLoader
} from "react-icons/fi";
import { ProductServices } from "@/services/products/products.services";
import { ProductOptions } from "@/services/product-options/product-options.services";
import { Product } from "@/types";
import Image from "next/image";

type StockStatus = "ok" | "low" | "empty";

interface StockStatusInfo {
  label: string;
  class: string;
}

// Funções puras movidas para fora do componente
const getStockStatusType = (stock: number | undefined): StockStatus => {
  const stockValue = stock ?? 0;
  if (stockValue === 0) return "empty";
  if (stockValue < 5) return "low";
  return "ok";
};

const getStockStatus = (stock: number | undefined): StockStatusInfo => {
  const stockValue = stock ?? 0;
  if (stockValue === 0) return { label: "Sem Estoque", class: styles.stockEmpty };
  if (stockValue < 5) return { label: "Estoque Baixo", class: styles.stockLow };
  return { label: "Em Estoque", class: styles.stockOk };
};

export default function ProductsListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>({});
  const [savingStock, setSavingStock] = useState<{ [key: string]: boolean }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<StockStatus | "all">("all");
  const [deletingOptionId, setDeletingOptionId] = useState<string | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ProductServices.getAllListProducts();
      setProducts(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao carregar produtos:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleUpdateProductStock = useCallback(async (productId: string, newStock: number) => {
    try {
      setSavingStock((prev) => ({ ...prev, [productId]: true }));

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      await ProductServices.updateProduct(productId, {
        stock: newStock,
        name: product.name,
        description: product.description || undefined,
        imageUrl: product.imageUrl || undefined,
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
      );

      setEditingStock((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao atualizar estoque:", errorMessage);
      alert("Erro ao atualizar estoque. Tente novamente.");
    } finally {
      setSavingStock((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }
  }, [products]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      setDeletingId(productId);
      await ProductServices.deleteProduct(productId);

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setShowDeleteConfirm(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao excluir produto:", errorMessage);
      alert("Erro ao excluir produto. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleEditProduct = useCallback((productId: string) => {
    router.push(`/admin/create-product?id=${productId}`);
  }, [router]);

  const handleDeleteProductOption = useCallback(async (productOptionId: string, productId: string) => {
    try {
      setDeletingOptionId(productOptionId);
      await ProductOptions.deleteProductOption(productOptionId);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                productOptions: p.productOptions?.filter((opt) => opt.id !== productOptionId) || [],
              }
            : p
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao excluir opção do produto:", errorMessage);
      alert("Erro ao excluir opção do produto. Tente novamente.");
    } finally {
      setDeletingOptionId(null);
    }
  }, []);

  const toggleProductExpansion = useCallback((productId: string) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  const filteredProducts = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        (product.description?.toLowerCase().includes(lowerSearchTerm) ?? false);

      const stockStatus = getStockStatusType(product.stock);
      const matchesFilter = filterStatus === "all" || stockStatus === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [products, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => getStockStatusType(p.stock) === "ok").length;
    const lowStock = products.filter((p) => getStockStatusType(p.stock) === "low").length;
    const outOfStock = products.filter((p) => getStockStatusType(p.stock) === "empty").length;

    return { total, inStock, lowStock, outOfStock };
  }, [products]);

  return (
    <div className={styles.productsContainer}>
      <div className={styles.productsHeader}>
        <div>
          <h1 className={styles.productsTitle}>
            <FiPackage className={styles.titleIcon} size={32} />
            Lista de Produtos
          </h1>
          <p className={styles.productsSubtitle}>
            Gerencie todos os produtos do sistema
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.createButton}
            onClick={() => router.push("/admin/create-product")}
          >
            <FiPlus size={18} />
            Novo Produto
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardSuccess}`}>
          <div className={styles.statValue}>{stats.inStock}</div>
          <div className={styles.statLabel}>Em Estoque</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardWarning}`}>
          <div className={styles.statValue}>{stats.lowStock}</div>
          <div className={styles.statLabel}>Estoque Baixo</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardDanger}`}>
          <div className={styles.statValue}>{stats.outOfStock}</div>
          <div className={styles.statLabel}>Sem Estoque</div>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} size={20} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar produtos por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterButton} ${filterStatus === "all" ? styles.filterButtonActive : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            Todos
          </button>
          <button
            className={`${styles.filterButton} ${filterStatus === "ok" ? styles.filterButtonActive : ""}`}
            onClick={() => setFilterStatus("ok")}
          >
            Em Estoque
          </button>
          <button
            className={`${styles.filterButton} ${filterStatus === "low" ? styles.filterButtonActive : ""}`}
            onClick={() => setFilterStatus("low")}
          >
            Estoque Baixo
          </button>
          <button
            className={`${styles.filterButton} ${filterStatus === "empty" ? styles.filterButtonActive : ""}`}
            onClick={() => setFilterStatus("empty")}
          >
            Sem Estoque
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <FiLoader className={styles.loadingIcon} size={32} />
          <p>Carregando produtos...</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Opções</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    <FiPackage size={48} className={styles.emptyIcon} />
                    <p>Nenhum produto encontrado</p>
                    {searchTerm && (
                      <p className={styles.emptySubtext}>
                        Tente ajustar sua busca ou filtros
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  const currentStock = editingStock[product.id] ?? (product.stock ?? 0);
                  const isSaving = savingStock[product.id];
                  const isDeleting = deletingId === product.id;
                  const showConfirm = showDeleteConfirm === product.id;

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className={styles.productInfo}>
                          <div className={styles.productImagePlaceholder}>
                            {product.imageUrl ? (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={80}
                                height={80}
                                className={styles.productImage}
                              />
                            ) : (
                              <FiImage className={styles.placeholderIcon} size={24} />
                            )}
                          </div>
                          <div className={styles.productDetails}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <p className={styles.productDescription}>
                              {product.description || "Sem descrição"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.priceValue}>
                          R$ {typeof product.price === 'number'
                            ? product.price.toFixed(2)
                            : Number(product.price || 0).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.stockControl}>
                          <input
                            type="number"
                            className={styles.stockInput}
                            value={currentStock}
                            min="0"
                            disabled={isSaving}
                            onChange={(e) => {
                              const newStock = parseInt(e.target.value) || 0;
                              setEditingStock((prev) => ({
                                ...prev,
                                [product.id]: newStock,
                              }));
                            }}
                            onBlur={() => {
                              if (editingStock[product.id] !== undefined && !isSaving) {
                                const newStock = editingStock[product.id];
                                if (newStock !== (product.stock ?? 0)) {
                                  handleUpdateProductStock(product.id, newStock);
                                }
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !isSaving) {
                                const newStock = editingStock[product.id];
                                if (newStock !== undefined && newStock !== (product.stock ?? 0)) {
                                  handleUpdateProductStock(product.id, newStock);
                                }
                              }
                            }}
                          />
                          {isSaving ? (
                            <FiLoader className={styles.savingIcon} size={16} />
                          ) : editingStock[product.id] !== undefined ? (
                            <FiCheck className={styles.checkIcon} size={16} />
                          ) : null}
                          <span className={styles.stockUnit}>unidades</span>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${stockStatus.class}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td>
                        <div className={styles.optionsSection}>
                          <button
                            className={styles.toggleOptionsButton}
                            onClick={() => toggleProductExpansion(product.id)}
                            title={expandedProducts.has(product.id) ? "Ocultar opções" : "Mostrar opções"}
                          >
                            {product.productOptions?.length || 0} opções
                            {expandedProducts.has(product.id) ? " ▲" : " ▼"}
                          </button>
                          {expandedProducts.has(product.id) && (
                            <div className={styles.optionsList}>
                              {product.productOptions && product.productOptions.length > 0 ? (
                                product.productOptions.map((option) => (
                                  <div key={option.id} className={styles.optionItem}>
                                    <div className={styles.optionInfo}>
                                      <span className={styles.optionName}>{option.name}</span>
                                      <span className={styles.optionPrice}>
                                        R$ {Number(option.price).toFixed(2)}
                                      </span>
                                      <span className={styles.optionStock}>
                                        Estoque: {option.stock}
                                      </span>
                                    </div>
                                    <button
                                      className={styles.deleteOptionButton}
                                      onClick={() => handleDeleteProductOption(option.id, product.id)}
                                      disabled={deletingOptionId === option.id}
                                      title="Excluir opção"
                                    >
                                      {deletingOptionId === option.id ? (
                                        <FiLoader className={styles.actionIcon} size={14} />
                                      ) : (
                                        <FiTrash2 className={styles.actionIcon} size={14} />
                                      )}
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div className={styles.noOptions}>
                                  <p>Nenhuma opção cadastrada</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {showConfirm ? (
                          <div className={styles.confirmDelete}>
                            <span className={styles.confirmText}>Confirmar?</span>
                            <button
                              className={styles.confirmButton}
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <FiLoader className={styles.actionIcon} size={14} />
                              ) : (
                                <FiCheck className={styles.actionIcon} size={14} />
                              )}
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={() => setShowDeleteConfirm(null)}
                              disabled={isDeleting}
                            >
                              <FiX className={styles.actionIcon} size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEditProduct(product.id)}
                              title="Editar produto"
                            >
                              <FiEdit2 className={styles.actionIcon} size={16} />
                              Editar
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => setShowDeleteConfirm(product.id)}
                              title="Excluir produto"
                              disabled={isDeleting}
                            >
                              <FiTrash2 className={styles.actionIcon} size={16} />
                              Excluir
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
