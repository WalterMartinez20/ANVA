"use client";

import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Favorite } from "@/types/producto_admin";
import { useProductActions } from "@/hooks/productos/useProductActions";

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isGuest } = useAuth();
  const { toast } = useToast();
  const { toggleFavoriteAndUpdate } = useProductActions();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || isGuest) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/favorites");
        if (!response.ok) throw new Error("Error al cargar favoritos");

        const data = await response.json();
        setFavorites(data.favorites || []);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar tus favoritos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, isGuest, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || isGuest) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">
            Inicia sesión para ver tus favoritos
          </h1>
          <p className="text-gray-500 mb-6">
            Necesitas iniciar sesión para guardar y ver tus productos favoritos
          </p>
          <Button asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">No tienes favoritos</h1>
          <p className="text-gray-500 mb-6">
            Aún no has añadido ningún producto a tus favoritos. Explora nuestra
            tienda y guarda tus productos preferidos.
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
        {favorites.map((fav) => (
          <ProductCard
            key={fav.id}
            product={fav.product}
            isFavorite={true}
            onToggleFavorite={() =>
              toggleFavoriteAndUpdate(
                fav.product,
                true,
                () =>
                  setFavorites((prev) =>
                    prev.filter((f) => f.productId !== fav.productId)
                  ),
                () => {}
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
