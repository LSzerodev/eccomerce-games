"use client";

import { useState, useEffect } from "react";
import styles from "./create-product-options.module.css";
import { FiPlus, FiPackage, FiInfo } from "react-icons/fi";
import { ProductServices } from "@/services/products/products.services";
import { ProductOptions } from "@/services/product-options/product-options.services";
import { ProductOptionForm } from "@/components/admin/product-option-form/product-option-form";
import { ProductOptionsList } from "@/components/admin/product-options-list/product-options-list";
import { Product, ProductOption } from "@/types";

export default function CreateProductOptionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await ProductServices.getAllListProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    loadProducts();
  }, []);

  const loadProductOptions = async () => {
    if (!selectedProductId) return;

    setLoadingOptions(true);
    try {
      const response = await ProductServices.getProductById(selectedProductId);
      if (response.data && response.data.productOptions) {
        setProductOptions(response.data.productOptions);
      } else {
        setProductOptions([]);
      }
    } catch (error) {
      console.error("Erro ao carregar opções:", error);
      setProductOptions([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    if (selectedProductId) {
      loadProductOptions();
      const product = products.find((p) => p.id === selectedProductId);
      setSelectedProduct(product || null);
    } else {
      setProductOptions([]);
      setSelectedProduct(null);
    }
  }, [selectedProductId, products]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
    });
  };

  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId) {
      alert("Por favor, selecione um produto primeiro");
      return;
    }

    setLoading(true);
    try {
      await ProductOptions.addOptionToProduct(selectedProductId, {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        stock: formData.stock ? parseInt(formData.stock) : 0,
      });

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
      });

      await loadProductOptions();

      alert("Opção adicionada com sucesso!");
    } catch (error: unknown) {
      console.error("Erro ao criar opção:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div className={styles.titleWrapper}>
            <div className={styles.iconCircle}>
              <FiPlus size={24} />
            </div>
            <div>
              <h1 className={styles.pageTitle}>Adicionar Opções ao Produto</h1>
              <p className={styles.pageSubtitle}>
                Crie variações personalizadas para seus produtos com diferentes preços e estoques
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.productSelectionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <FiPackage className={styles.cardIcon} size={20} />
              <h2 className={styles.cardTitle}>Selecionar Produto</h2>
            </div>
            {selectedProduct && (
              <div className={styles.selectedBadge}>
                <FiInfo size={14} />
                <span>Produto Selecionado</span>
              </div>
            )}
          </div>

          <div className={styles.cardBody}>
            <div className={styles.selectWrapper}>
              <label htmlFor="productId" className={styles.selectLabel}>
                Escolha o produto que deseja adicionar opções
              </label>
              <select
                id="productId"
                name="productId"
                className={styles.productSelect}
                value={selectedProductId}
                onChange={handleProductChange}
                required
              >
                <option value="">Selecione um produto...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className={styles.selectedProductInfo}>
                <div className={styles.productInfoCard}>
                  <div className={styles.productInfoHeader}>
                    <FiPackage size={18} />
                    <span className={styles.productInfoTitle}>Produto Selecionado</span>
                  </div>
                  <div className={styles.productInfoContent}>
                    <h3 className={styles.productName}>{selectedProduct.name}</h3>
                    {selectedProduct.description && (
                      <p className={styles.productDescription}>{selectedProduct.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedProductId && (
          <div className={styles.contentGrid}>
            <div className={styles.formSection}>
              <ProductOptionForm
                selectedProductId={selectedProductId}
                loading={loading}
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleCreateOption}
                onClear={handleClearForm}
              />
            </div>

            <div className={styles.listSection}>
              <ProductOptionsList
                selectedProductId={selectedProductId}
                loadingOptions={loadingOptions}
                productOptions={productOptions}
                selectedProductName={selectedProduct?.name}
              />
            </div>
          </div>
        )}

        {!selectedProductId && (
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyStateCard}>
              <div className={styles.emptyStateIcon}>
                <FiPackage size={64} />
              </div>
              <h3 className={styles.emptyStateTitle}>Nenhum produto selecionado</h3>
              <p className={styles.emptyStateText}>
                Selecione um produto acima para começar a adicionar opções personalizadas
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
