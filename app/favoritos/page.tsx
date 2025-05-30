"use client";

import { Heart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "@/components/productos/ProductCard";
import { useFavorites } from "@/hooks/productos/useFavorites";
import { Favorite } from "@/types/producto_admin";

export default function FavoritosPage() {
  const { favorites, toggleFavorite, isLoadingFavorites } = useFavorites();
  const [allFavoriteEntries, setAllFavoriteEntries] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites");
        const data = await response.json();
        setAllFavoriteEntries(data.favorites || []);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const visibleFavorites = allFavoriteEntries.filter((f) =>
    favorites.includes(f.productId)
  );

  if (isLoading || isLoadingFavorites) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (visibleFavorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">No tienes favoritos</h1>
          <p className="text-gray-500 mb-6">
            Aún no has añadido ningún producto a tus favoritos.
          </p>
          <Button asChild>
            <Link href="/productos">Ver Productos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {visibleFavorites.map((fav) => (
          <ProductCard
            key={fav.id}
            product={fav.product}
            isFavorite={favorites.includes(fav.product.id)}
            onToggleFavorite={() => toggleFavorite(fav.product)}
          />
        ))}
      </div>
    </div>
  );
}
