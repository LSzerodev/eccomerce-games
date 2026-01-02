import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finalizar Compra",
  description: "Complete seu pedido e finalize o pagamento via PIX de forma rápida e segura.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

