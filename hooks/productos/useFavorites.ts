// hooks/favoritos/useFavorites.ts
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Product } from "@/types/producto_admin";
import { useProductActions } from "@/hooks/productos/useProductActions";

export function useFavorites() {
  const { isAuthenticated, isGuest } = useAuth();
  const { toggleFavoriteAndUpdate } = useProductActions();

  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // Cargar favoritos
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || isGuest) {
        setIsLoadingFavorites(false);
        return;
      }

      try {
        const res = await fetch("/api/favorites");
        const data = await res.json();
        setFavorites(data.favorites?.map((f: any) => f.productId) || []);
      } catch (err) {
        console.error("Error al cargar favoritos:", err);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, isGuest]);

  // Alternar favoritos
  const toggleFavorite = (product: Product) => {
    const isFav = favorites.includes(product.id);
    toggleFavoriteAndUpdate(
      product,
      isFav,
      (newStatus) => {
        setFavorites((prev) =>
          newStatus
            ? [...prev, product.id]
            : prev.filter((id) => id !== product.id)
        );
      },
      () => {} // puedes agregar un estado de loading individual si lo deseas
    );
  };

  return {
    favorites,
    isLoadingFavorites,
    toggleFavorite,
  };
}
