"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { useCart } from "./cart-provider";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import ProductQuickView from "@/components/home/product-quick-view";
import { formatPrice } from "@/lib/utils";

interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  images: ProductImage[];
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { user, isGuest } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState<number | null>(
    null
  );
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products/featured");
        if (!response.ok)
          throw new Error("Error al cargar productos destacados");

        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
        // Usar datos de ejemplo si falla la carga
        setProducts([
          {
            id: 1,
            name: "Bolso Artesanal Modelo Primavera",
            price: 89.99,
            stock: 10,
            category: "Bolsos",
            images: [
              {
                id: 1,
                url: "/placeholder.svg?height=300&width=300&text=Bolso+1",
                isMain: true,
              },
            ],
          },
          {
            id: 2,
            name: "Collar de Piedras Naturales",
            price: 45.5,
            stock: 15,
            category: "Bisutería",
            images: [
              {
                id: 2,
                url: "/placeholder.svg?height=300&width=300&text=Collar+1",
                isMain: true,
              },
            ],
          },
          {
            id: 3,
            name: "Bolso de Cuero Vintage",
            price: 129.99,
            stock: 5,
            category: "Bolsos",
            images: [
              {
                id: 3,
                url: "/placeholder.svg?height=300&width=300&text=Bolso+2",
                isMain: true,
              },
            ],
          },
          {
            id: 4,
            name: "Pulsera Tejida a Mano",
            price: 29.99,
            stock: 20,
            category: "Bisutería",
            images: [
              {
                id: 4,
                url: "/placeholder.svg?height=300&width=300&text=Pulsera+1",
                isMain: true,
              },
            ],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Cargar favoritos del usuario
  useEffect(() => {
    if (isGuest || !user) return;

    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites");
        if (!response.ok) return;

        const data = await response.json();
        setFavorites(data.favorites.map((fav: any) => fav.productId));
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    };

    fetchFavorites();
  }, [user, isGuest]);

  const handleAddToCart = (product: Product) => {
    setIsAddingToCart(product.id);
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image:
          product.images && product.images.length > 0
            ? product.images.find((img) => img.isMain)?.url ||
              product.images[0].url
            : "/placeholder.svg?height=80&width=80",
      });
      setIsAddingToCart(null);
      toast({
        title: "Producto añadido",
        description: `${product.name} ha sido añadido al carrito`,
      });
    }, 500);
  };

  const handleToggleFavorite = async (productId: number) => {
    if (isGuest) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para añadir productos a favoritos",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToFavorites(productId);
    try {
      if (favorites.includes(productId)) {
        // Eliminar de favoritos
        const response = await fetch(`/api/favorites/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Error al eliminar de favoritos");

        setFavorites(favorites.filter((id) => id !== productId));
        toast({
          title: "Eliminado de favoritos",
          description: "El producto ha sido eliminado de tus favoritos",
        });
      } else {
        // Añadir a favoritos
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        if (!response.ok) throw new Error("Error al añadir a favoritos");

        setFavorites([...favorites, productId]);
        toast({
          title: "Añadido a favoritos",
          description: "El producto ha sido añadido a tus favoritos",
        });
      }
    } catch (error) {
      console.error("Error al gestionar favoritos:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al gestionar favoritos",
        variant: "destructive",
      });
    } finally {
      setIsAddingToFavorites(null);
    }
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find((img) => img.isMain);
      return mainImage ? mainImage.url : product.images[0].url;
    }
    return "/placeholder.svg?height=300&width=300";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden group h-full flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden">
              <Link href={`/producto/${product.id}`}>
                <img
                  src={getProductImage(product) || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Acciones rápidas */}
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className={`h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                    favorites.includes(product.id)
                      ? "bg-red-100 text-red-500"
                      : ""
                  }`}
                  onClick={() => handleToggleFavorite(product.id)}
                  disabled={isAddingToFavorites === product.id}
                >
                  {isAddingToFavorites === product.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(product.id) ? "fill-red-500" : ""
                      }`}
                    />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setQuickViewProduct(product)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Etiquetas */}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="secondary" className="absolute top-2 left-2">
                  ¡Últimas unidades!
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive" className="absolute top-2 left-2">
                  Agotado
                </Badge>
              )}
              {product.category && (
                <Badge
                  variant="outline"
                  className="absolute bottom-2 left-2 bg-white/80"
                >
                  {product.category}
                </Badge>
              )}
            </div>

            <CardContent className="p-4 flex-grow">
              <Link
                href={`/producto/${product.id}`}
                className="hover:underline"
              >
                <h3 className="font-medium line-clamp-2">{product.name}</h3>
              </Link>
              <p className="text-lg font-bold mt-2">
                {formatPrice(product.price)}
              </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0 || isAddingToCart === product.id}
              >
                {isAddingToCart === product.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Añadiendo...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Añadir al carrito
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/productos">Ver Todos los Productos</Link>
        </Button>
      </div>

      {/* Modal de vista rápida */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
