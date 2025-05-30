"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import ProductCard from "@/components/productos/ProductCard";
import ProductQuickView from "./product-quick-view";

import { Product } from "@/types/producto_admin";
import { useFavorites } from "@/hooks/productos/useFavorites";

interface ProductGridProps {
  products?: Product[];
  favorites?: number[];
  onToggleFavorite?: (product: Product) => void;
}

export default function ProductGrid({
  products: externalProducts,
  favorites: externalFavorites,
  onToggleFavorite,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(externalProducts || []);
  const [isLoading, setIsLoading] = useState(!externalProducts);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  const { favorites: internalFavorites, toggleFavorite: internalToggle } =
    useFavorites();
  const favorites = externalFavorites ?? internalFavorites;
  const toggleFavorite = onToggleFavorite ?? internalToggle;

  // 🟢 Actualizar estado interno cuando cambien los props
  useEffect(() => {
    setProducts(externalProducts || []);
  }, [externalProducts]);

  // Solo se ejecuta si no se pasan productos desde afuera (fallback general)
  useEffect(() => {
    if (externalProducts) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        // Silencioso, pero podrías mostrar un mensaje si quieres
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [externalProducts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">
          No hay productos disponibles
        </h2>
        <p className="text-muted-foreground">
          Vuelve más tarde para ver nuestros productos
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={() => toggleFavorite(product)}
          />
        ))}
      </div>

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
