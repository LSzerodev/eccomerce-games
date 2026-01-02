import { useEffect, useState } from "react";
import { ProductServices } from "@/services/products/products.services";
import { Product } from "@/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const response = await ProductServices.getAllListProducts();
        setProducts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erro ao carregar produtos"));
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return { products, loading, error };
}

