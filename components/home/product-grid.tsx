"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductQuickView from "./product-quick-view";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Product } from "@/types/producto_admin";
import { useProductActions } from "@/hooks/productos/useProductActions";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  const { isAuthenticated, isGuest } = useAuth();
  const { toast } = useToast();
  const { toggleFavoriteAndUpdate } = useProductActions();

  // Fetch productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch favoritos
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || isGuest) return;
      try {
        const res = await fetch("/api/favorites");
        const data = await res.json();
        setFavorites(data.favorites?.map((f: any) => f.productId) || []);
      } catch (err) {
        console.error("Error al cargar favoritos:", err);
      }
    };
    fetchFavorites();
  }, [isAuthenticated, isGuest]);

  // Agregar a favoritos
  const handleToggleFavorite = (product: Product) => {
    toggleFavoriteAndUpdate(
      product,
      favorites.includes(product.id),
      (newStatus) => {
        setFavorites((prev) =>
          newStatus
            ? [...prev, product.id]
            : prev.filter((id) => id !== product.id)
        );
      },
      () => {}
    );
  };

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
            onToggleFavorite={() => handleToggleFavorite(product)}
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
