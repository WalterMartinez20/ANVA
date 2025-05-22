"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/productos/categorias/breadcrumb";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";

import Gallery from "@/components/productos/Gallery";
import Info from "@/components/productos/Info";
import ColorSelector from "@/components/productos/ColorSelector";
import QuantitySelector from "@/components/productos/QuantitySelector";
import Actions from "@/components/productos/Actions";
import ProductTabs from "@/components/productos/Tabs";
import RelatedProducts from "@/components/productos/Related";
import DeliveryOptions from "@/components/productos/Delivery";
import PaymentMethods from "@/components/productos/PaymentMethods";

import { useProductDetails } from "@/hooks/productos/useProductDetails";
import { useProductActions } from "@/hooks/productos/useProductActions";
import { useAuth } from "@/contexts/auth-context";

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(true);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const { isAuthenticated, isGuest } = useAuth();
  const { addToCartFromDetails, toggleFavoriteAndUpdate } = useProductActions();

  const {
    product,
    isLoading,
    availableColors,
    selectedColor,
    setSelectedColor,
  } = useProductDetails(productId);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!product || !isAuthenticated || isGuest) {
        setCheckingFavorite(false);
        return;
      }

      try {
        const res = await fetch("/api/favorites");
        const data = await res.json();
        const isInFavorites = data.favorites?.some(
          (fav: any) => fav.productId === product.id
        );
        setIsFavorite(!!isInFavorites);
      } catch (err) {
        console.error("Error al verificar favoritos:", err);
      } finally {
        setCheckingFavorite(false);
      }
    };

    checkIfFavorite();
  }, [product, isAuthenticated, isGuest]);

  const increaseQuantity = () => {
    if (!product) return;
    setQuantity((q) => Math.min(q + 1, product.stock));
  };

  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(q - 1, 1));
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);

      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: "Mira este producto que me gustó:",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Enlace copiado",
          description: "El enlace del producto ha sido copiado al portapapeles",
        });
      }
    } catch (err) {
      toast({
        title: "Error al compartir",
        description: "No se pudo completar la acción",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const breadcrumbItems = product?.category
    ? [
        {
          label: product.category,
          href: `/categoria/${product.category
            .toLowerCase()
            .replace(/ /g, "-")}`,
        },
        { label: product.name },
      ]
    : [
        { label: "Productos", href: "/" },
        { label: product?.name || "Cargando..." },
      ];

  if (isLoading || checkingFavorite) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <p>
          Lo sentimos, el producto que buscas no existe o ha sido eliminado.
        </p>
        <Button className="mt-4" asChild>
          <a href="/">Volver a la tienda</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Galería a la izquierda */}
          <div className="lg:w-2/5">
            <div className="sticky top-20">
              <Gallery images={product.images} altText={product.name} />
            </div>
          </div>

          {/* Info a la derecha */}
          <div className="lg:w-3/5">
            <div className="space-y-6">
              {/* Título, categoría, precio y rating */}
              {/* Solo pasamos product porque en info esta desestructurado todo desde product, esto para no repetir props y que quede más limpio. */}
              <Info product={product} />

              {/* Color y cantidad juntos */}
              <div className="space-y-4">
                <ColorSelector
                  colors={availableColors}
                  selectedColor={selectedColor}
                  onSelect={setSelectedColor}
                />
                <QuantitySelector
                  quantity={quantity}
                  stock={product.stock}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                />
              </div>

              {/* Botones de acción: agregar + favorito */}
              <Actions
                onAddToCart={() =>
                  addToCartFromDetails(
                    product,
                    selectedColor,
                    availableColors,
                    quantity
                  )
                }
                onToggleFavorite={() =>
                  toggleFavoriteAndUpdate(
                    product,
                    isFavorite,
                    setIsFavorite,
                    setIsAddingToFavorites
                  )
                }
                onShare={handleShare}
                isFavorite={isFavorite}
                isSharing={isSharing}
                isAddingToFavorites={isAddingToFavorites}
                disabled={product.stock <= 0}
              />

              {/* Métodos de pago y entrega, agrupados visualmente */}
              <div className="mt-6 space-y-4 border rounded-md p-4 bg-gray-50">
                <div>
                  <h4 className="text-sm font-medium mb-1">Métodos de pago</h4>
                  <PaymentMethods />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Opciones de entrega
                  </h4>
                  <DeliveryOptions />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs con descripción, materiales, pago/envío, reseñas */}
        <ProductTabs
          description={product.description}
          materials={product.materials}
          width={product.width}
          height={product.height}
          depth={product.depth}
          strapDescription={product.strapDescription}
          materialInfo={product.materialInfo}
        />

        {/* Productos relacionados */}
        <RelatedProducts />
      </div>
    </>
  );
}
