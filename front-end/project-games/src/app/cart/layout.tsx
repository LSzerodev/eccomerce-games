 import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrinho de Compras",
  description: "Revise seus itens, ajuste quantidades e finalize sua compra.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
