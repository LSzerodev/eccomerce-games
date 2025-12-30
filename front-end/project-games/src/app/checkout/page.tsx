"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoArrowBack, IoCopyOutline, IoCheckmarkCircle, IoQrCodeOutline } from "react-icons/io5";

import styles from "./checkout.module.css";
import { WhatsAppModal } from "@/components/whatsapp-modal/whatsapp-modal";
import { useCart } from "@/context/CartProvider";
import { PixServices } from "@/services/pix/pix.services";
import { isValidUrl } from "@/lib/utils";

interface PixData {
  transactionId: string;
  pixCopiaECola: string;
  qrCodeBase64: string;
  total: number;
  cartUuid: string;
  description?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, cartUuid, isLoading } = useCart();
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [copied, setCopied] = useState(false);
  const [description, setDescription] = useState("");
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!cartUuid || cartItems.length === 0)) {
      router.push("/cart");
    }
  }, [cartUuid, cartItems, isLoading, router]);

  const handleGeneratePix = async () => {
    if (!cartUuid) return;

    setIsGeneratingPix(true);
    try {
      const response = await PixServices.generatePix(cartUuid, description || undefined);
      setPixData(response.data);
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
      alert("Erro ao gerar código PIX. Tente novamente.");
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const handleCopyPixCode = async () => {
    if (!pixData?.pixCopiaECola) return;

    try {
      await navigator.clipboard.writeText(pixData.pixCopiaECola);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar código:", error);
      alert("Erro ao copiar código. Tente selecionar e copiar manualmente.");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.productOption.price) * item.quantity;
  }, 0);

  const formattedTotal = cartTotal
    ? Number(cartTotal).toFixed(2).replace(".", ",")
    : subtotal.toFixed(2).replace(".", ",");

  if (isLoading) {
    return (
      <section className={styles.container}>
        <div className={styles.loading}>
          <p>Carregando checkout...</p>
        </div>
      </section>
    );
  }

  if (!cartUuid || cartItems.length === 0) {
    return null;
  }

  return (
    <section className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => router.push("/cart")}
        aria-label="Voltar"
      >
        <IoArrowBack size={24} color="#FFFFFF" />
      </button>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Finalizar Compra</h1>
          <p className={styles.subtitle}>Complete seu pedido e finalize o pagamento</p>
        </div>

        <div className={styles.checkoutContent}>
          <div className={styles.leftSection}>
            <div className={styles.orderSummary}>
              <h2 className={styles.sectionTitle}>Resumo do Pedido</h2>
              <div className={styles.itemsList}>
                {cartItems.map((item) => {
                  const product = item.productOption.product;
                  const productOption = item.productOption;
                  const itemTotal = Number(productOption.price) * item.quantity;

                  return (
                    <div key={item.id} className={styles.orderItem}>
                      <div className={styles.orderItemImage}>
                        {isValidUrl(product.imageUrl) ? (
                          <Image
                            src={product.imageUrl!}
                            alt={product.name}
                            width={80}
                            height={80}
                            className={styles.productImage}
                          />
                        ) : (
                          <div className={styles.placeholderImage}>Sem imagem</div>
                        )}
                      </div>
                      <div className={styles.orderItemInfo}>
                        <h3 className={styles.orderItemName}>{product.name}</h3>
                        <p className={styles.orderItemOption}>Opção: {productOption.name}</p>
                        <p className={styles.orderItemQuantity}>Qtd: {item.quantity}</p>
                      </div>
                      <div className={styles.orderItemPrice}>
                        R$ {itemTotal.toFixed(2).replace(".", ",")}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.orderTotal}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Subtotal:</span>
                  <span className={styles.totalValue}>
                    R$ {subtotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabelFinal}>Total:</span>
                  <span className={styles.totalValueFinal}>R$ {formattedTotal}</span>
                </div>
              </div>
            </div>

            {!pixData && (
              <div className={styles.paymentSection}>
                <h2 className={styles.sectionTitle}>Pagamento</h2>
                <div className={styles.paymentMethod}>
                  <div className={styles.paymentMethodHeader}>
                    <IoQrCodeOutline size={24} />
                    <span>PIX</span>
                  </div>
                  <p className={styles.paymentMethodDescription}>
                    Gere o código PIX para finalizar o pagamento. O pagamento é processado
                    instantaneamente.
                  </p>
                  <div className={styles.descriptionInput}>
                    <label htmlFor="description">Descrição (opcional)</label>
                    <input
                      id="description"
                      type="text"
                      placeholder="Adicione uma descrição para o pagamento"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <button
                    className={styles.generatePixButton}
                    onClick={handleGeneratePix}
                    disabled={isGeneratingPix}
                  >
                    {isGeneratingPix ? "Gerando PIX..." : "Gerar Código PIX"}
                  </button>
                </div>
              </div>
            )}

            {pixData && (
              <div className={styles.pixSection}>
                <h2 className={styles.sectionTitle}>Pagamento PIX</h2>
                <div className={styles.pixContainer}>
                  <div className={styles.qrCodeContainer}>
                    <h3 className={styles.qrCodeTitle}>Escaneie o QR Code</h3>
                    <div className={styles.qrCodeWrapper}>
                      <Image
                        src={pixData.qrCodeBase64}
                        alt="QR Code PIX"
                        width={256}
                        height={256}
                        className={styles.qrCode}
                      />
                    </div>
                  </div>

                  <div className={styles.pixCodeContainer}>
                    <h3 className={styles.pixCodeTitle}>Ou copie o código PIX</h3>
                    <div className={styles.pixCodeWrapper}>
                      <p className={styles.pixCode}>{pixData.pixCopiaECola}</p>
                      <button
                        className={styles.copyButton}
                        onClick={handleCopyPixCode}
                        aria-label="Copiar código PIX"
                      >
                        {copied ? (
                          <>
                            <IoCheckmarkCircle size={20} />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <IoCopyOutline size={20} />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className={styles.pixInfo}>
                    <div className={styles.pixInfoRow}>
                      <span>Valor:</span>
                      <span className={styles.pixInfoValue}>
                        R$ {pixData.total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className={styles.pixInfoRow}>
                      <span>ID da Transação:</span>
                      <span className={styles.pixInfoValue}>{pixData.transactionId}</span>
                    </div>
                  </div>

                  <button
                    className={styles.whatsappButton}
                    onClick={() => setIsWhatsAppModalOpen(true)}
                  >
                    Resgatar item via WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.rightSection}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryCardTitle}>Resumo</h3>
              <div className={styles.summaryCardContent}>
                <div className={styles.summaryCardRow}>
                  <span>Itens:</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className={styles.summaryCardRow}>
                  <span>Total:</span>
                  <span className={styles.summaryCardTotal}>R$ {formattedTotal}</span>
                </div>
              </div>
              {pixData && (
                <div className={styles.paymentStatus}>
                  <div className={styles.statusIndicator}></div>
                  <span>Aguardando pagamento</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />
    </section>
  );
}
