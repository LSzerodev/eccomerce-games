import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhes do Produto",
  description: "Visualize detalhes, preços e opções do produto. Adicione ao carrinho e finalize sua compra.",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


