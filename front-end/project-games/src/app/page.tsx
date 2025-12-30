"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "../styles/page.module.css";
import background from "../backgrund.png";
import bg1 from '@/Frame 81.png';
import bg from '@/bg (1).png';

import { StockBadge } from "../components/stock/stock-badge";
import { BuyButton } from "../components/buttons/buy-button/buy-button";
import { useProduct } from "@/context/ProductsProvider";
import { isValidUrl } from "@/lib/utils";

const backgrounds = [
  background,
  bg,
  bg1,
];

const textHero = [
  {
    title: 'CONTAS ROBLOX PREMIUM',
    description: 'Comece no Roblox com contas já evoluídas, itens raros e progresso avançado. Economize tempo, pule o começo chato e jogue direto no nível que você merece.'
  },
  {
    title: 'STEAM KEYS',
    description: 'Adquira Steam Keys originais para jogos e conteúdos digitais. Ative diretamente na Steam, economize dinheiro e tenha acesso rápido aos seus jogos favoritos com segurança e praticidade.'
  },
  {
    title: 'CONTAS VALORANT',
    description: 'Compre contas de Valorant com skins, ranks e progresso avançado. Opções de Full Access e NFA disponíveis. Economize tempo, entre direto no jogo e aproveite a experiência completa com rapidez e praticidade.'
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const listProducts = useProduct();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % backgrounds.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  if (!listProducts.length) return <p>Carregando produtos...</p>;

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  function handleSendProduct(id: string) {
    router.push(`/${id}`);
  }

  return (
    <>
      <section className={styles.ContainerSection1}>
        <div className={styles.backgroundImg}>
          {backgrounds.map((bg, index) => (
            <Image
              key={index}
              src={bg}
              alt={`Background ${index + 1}`}
              fill
              priority={index === 0}
              className={`${styles.bgImage} ${
                index === currentSlide ? styles.bgImageActive : styles.bgImageInactive
              }`}
            />
          ))}
        </div>

        <div className={styles.dotsContainer}>
          {backgrounds.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentSlide ? styles.dotActive : ""
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>

        {textHero.map((item, index) => (
          <div
            key={index}
            className={`${styles.contentWrapper} ${
              index === currentSlide ? styles.active : styles.inactive
            }`}
          >
            <h1 className={styles.titleSection1}>{item.title}</h1>
            <p className={styles.descriptionSection1}>
              {item.description}
            </p>
          </div>
        ))}
      </section>

      <section className={styles.productsSection}>
        <h3 className={styles.sectionTitle}>Disponiveis</h3>
        <div className={styles.Sectionproducts}>
          {listProducts.map((item) => (
            <article className={styles.product} key={item.id}>
              {isValidUrl(item.imageUrl) && (
                <Image
                  src={item.imageUrl!}
                  alt={item.name || "Produto"}
                  width={200}
                  height={200}
                  className={styles.backgroundProductImage}
                />
              )}
              <div className={styles.productGraphic}>
                <div className={styles.productGraphicContent}>
                  {isValidUrl(item.imageUrl) && (
                    <Image
                      src={item.imageUrl!}
                      alt={item.name || "Produto"}
                      width={200}
                      height={200}
                      className={styles.productImage}
                    />
                  )}
                  <div className={styles.productCharacter}>
                  </div>
                </div>
              </div>

              <div className={styles.productDetails}>
                <StockBadge stock={item.productOptions?.[0]?.stock ?? 0} className={styles.stockBadge} />
                <p className={styles.productDescription}>
                  {item.name}
                </p>
                <hr className={styles.productDivider} />
                <p className={styles.productPrice}>R$ {item.productOptions?.[0]?.price || "0,00"} • Entrega rapida</p>
                <BuyButton onClick={() => handleSendProduct(item.id)}>
                  <span className={styles.buttonComprarText}>Comprar agora</span>
                </BuyButton>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
