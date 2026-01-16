"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";
import { IoMdCard } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";

import styles from "./productDetail.module.css";
import nuvemBackground from "./nuvemBanckground.png";
import gridBackground from "./Grid.png";
import backgroundImage from "./background.png";

import { StockBadge } from "@/components/stock/stock-badge";
import { BuyButton } from "@/components/buttons/buy-button/buy-button";
import { OptionDropdown } from "@/components/product/option-dropdown/option-dropdown";
import { SupportSection } from "@/components/product/support-section/support-section";

import { useProduct } from "@/context/ProductsProvider";
import { useCart } from "@/context/CartProvider";
import { Product, ProductOption } from "@/types";
import { ProductServices } from "@/services/products/products.services";
import { isValidUrl } from "@/lib/utils";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const allProducts = useProduct();
  const { addItemToCart, cartUuid, isLoading: cartLoading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("Selecione uma opção");
  const [selectedProductOption, setSelectedProductOption] = useState<ProductOption | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;

      try {
        setLoading(true);
        const cachedProduct = allProducts.find(p => p.id === productId);

        if (cachedProduct) {
          setProduct(cachedProduct);
          // Seleciona automaticamente a primeira opção se houver
          if (cachedProduct.productOptions && cachedProduct.productOptions.length > 0) {
            const firstOption = cachedProduct.productOptions[0];
            setSelectedOption(firstOption.name);
            setSelectedProductOption(firstOption);
          }
          setLoading(false);
        } else {
          const response = await ProductServices.getProductById(productId);
          const fetchedProduct = response.data;
          setProduct(fetchedProduct);
          // Seleciona automaticamente a primeira opção se houver
          if (fetchedProduct.productOptions && fetchedProduct.productOptions.length > 0) {
            const firstOption = fetchedProduct.productOptions[0];
            setSelectedOption(firstOption.name);
            setSelectedProductOption(firstOption);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }finally{
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId, allProducts]);

  const handleOptionSelect = (optionName: string) => {
    setSelectedOption(optionName);
    const option = product?.productOptions?.find(opt => opt.name === optionName);
    setSelectedProductOption(option || null);
  };

  const dropdownOptions = product?.productOptions?.map(opt => opt.name) || [];
  const displayPrice = selectedProductOption?.price || product?.productOptions?.[0]?.price || "0,00";
  const displayStock = selectedProductOption?.stock || product?.productOptions?.[0]?.stock || 0;

  const handleAddToCart = async () => {
    const optionToAdd = selectedProductOption || product?.productOptions?.[0];

    if (!optionToAdd) {
      alert("Por favor, selecione uma opção do produto");
      return;
    }

    if (!optionToAdd.id) {
      console.error("ProductOption sem ID:", optionToAdd);
      alert("Erro: Opção do produto sem ID. Tente recarregar a página.");
      return;
    }

    if (displayStock <= 0) {
      alert("Produto sem estoque disponível");
      return;
    }

    setIsAddingToCart(true);
    try {
      console.log("Adicionando ao carrinho:", { productOptionId: optionToAdd.id, quantity: 1 });
      await addItemToCart(optionToAdd.id, 1);
      alert("Produto adicionado ao carrinho!");
    } catch (error: any) {
      console.error("Erro ao adicionar ao carrinho:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Erro ao adicionar produto ao carrinho. Tente novamente.";
      alert(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    const optionToAdd = selectedProductOption || product?.productOptions?.[0];

    if (!optionToAdd) {
      alert("Por favor, selecione uma opção do produto");
      return;
    }

    if (!optionToAdd.id) {
      console.error("ProductOption sem ID:", optionToAdd);
      alert("Erro: Opção do produto sem ID. Tente recarregar a página.");
      return;
    }

    if (displayStock <= 0) {
      alert("Produto sem estoque disponível");
      return;
    }

    setIsBuying(true);
    try {
      console.log("Comprando agora:", { productOptionId: optionToAdd.id, quantity: 1 });
      // Adicionar item com skipRefresh=true para redirecionar imediatamente
      await addItemToCart(optionToAdd.id, 1, true);
      router.push("/checkout");
    } catch (error: any) {
      console.error("Erro ao adicionar ao carrinho:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Erro ao adicionar produto ao carrinho. Tente novamente.";
      alert(errorMessage);
    } finally {
      setIsBuying(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.container}>
        <p>Carregando produto...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className={styles.container}>
        <button
          className={styles.backButton}
          onClick={() => router.back()}
          aria-label="Voltar"
        >
          <IoArrowBack size={24} color="#FFFFFF" />
        </button>
        <p>Produto não encontrado</p>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => router.back()}
        aria-label="Voltar"
      >
        <IoArrowBack size={24} color="#FFFFFF" />
      </button>
      <div className={styles.backgroundImageWrapper}>
        <Image
          src={gridBackground}
          alt="Background grid"
          fill
          className={styles.gridBackground}
          priority
        />
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          className={styles.backgroundImage}
          priority
        />
        <Image
          src={nuvemBackground}
          alt="Background nuvens"
          fill
          className={styles.nuvemBackground}
          priority
        />
      </div>
      <div className={styles.productDetail}>
        <div className={styles.cardImage}>
          <div className={styles.productImageCard}>
            <Image
              src={isValidUrl(product.imageUrl) ? product.imageUrl! : "/placeholder-product.png"}
              alt={product.name}
              width={500}
              height={500}
              className={styles.productImage}
              priority
            />
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.stockWrapper}>
            <StockBadge stock={displayStock} className={styles.stockBadge} />
          </div>

          <h1 className={styles.productTitle}>{product.name}</h1>

          <div className={styles.priceSection}>
            <p className={styles.priceLabel}>Preço</p>
            <h4 className={styles.priceValue}>R$ {displayPrice}</h4>
          </div>

          {product.productOptions && product.productOptions.length > 0 && (
            <OptionDropdown
              options={dropdownOptions}
              selectedOption={selectedOption}
              onSelectOption={handleOptionSelect}
            />
          )}

          <div className={styles.botoes}>
            <div className={styles.buttonWrapper}>
              <BuyButton
                className={styles.buttonComprar}
                onClick={handleBuyNow}
                disabled={isBuying || cartLoading || displayStock <= 0}
              >
                <IoMdCard size={20} color="#1B1B30"/>
                <span className={styles.buttonComprarText}>
                  {isBuying ? "Processando..." : "Comprar agora"}
                </span>
              </BuyButton>
              <button
                className={styles.addToCartButton}
                onClick={handleAddToCart}
                disabled={isAddingToCart || cartLoading || displayStock <= 0}
              >
                <FaCartShopping size={20} color="#DFC7F9"/>
                <span>{isAddingToCart ? "Adicionando..." : "Adicionar ao carrinho"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {product.description && (
        <div className={styles.productDescription}>
          <h2 className={styles.descriptionTitle}>Descrição</h2>
          <div className={styles.descriptionContent}>
            {product.description.split('\n').map((line, index) => (
              <p key={index} className={styles.descriptionText}>
                {line}
              </p>
            ))}
            <button className={styles.readMoreButton}>Ler mais</button>
          </div>
        </div>
      )}

      <SupportSection />
    </section>
  );
}
