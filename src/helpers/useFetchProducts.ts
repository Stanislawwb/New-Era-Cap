import { useState, useEffect } from "react";

interface Product {
  id: number
  name: string
  type: string
  color: string
  price: number
  currency: string
  imageUrl: string
}

interface UseFetchProductsReturn {
  products: Product[]
  loading: boolean;
}

const useFetchProducts = (): UseFetchProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await response.json();

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};

export default useFetchProducts;
