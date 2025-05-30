"use client";

import { useState } from "react";
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
import { useFavorites } from "@/hooks/productos/useFavorites";

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [quantity, setQuantity] = useState(1);
  const [isSharing, setIsSharing] = useState(false);

  const {
    product,
    isLoading,
    availableColors,
    selectedColor,
    setSelectedColor,
  } = useProductDetails(productId);

  const { addToCartFromDetails } = useProductActions();
  const { favorites, toggleFavorite } = useFavorites();

  const isFavorite = product ? favorites.includes(product.id) : false;

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

  if (isLoading) {
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
              <Info product={product} />

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

              <Actions
                onAddToCart={() => {
                  addToCartFromDetails(
                    product,
                    selectedColor,
                    availableColors,
                    quantity
                  );
                  setQuantity(1);
                  console.log("Add to cart called with quantity:", quantity);
                }}
                onToggleFavorite={() => toggleFavorite(product)}
                onShare={handleShare}
                isFavorite={isFavorite}
                isSharing={isSharing}
                disabled={product.stock <= 0}
              />

              <div className="mt-6 rounded-lg border border-primary/30 bg-white shadow-md">
                {/* Métodos de pago */}
                <div className="border-b border-primary/10 p-4 md:p-5">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    💳 Métodos de pago
                  </h4>
                  <PaymentMethods />
                </div>

                {/* Opciones de entrega */}
                <div className="p-4 md:p-5">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    🚚 Opciones de entrega
                  </h4>
                  <DeliveryOptions />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductTabs
          description={product.description}
          materials={product.materials}
          width={product.width}
          height={product.height}
          depth={product.depth}
          strapDescription={product.strapDescription}
          materialInfo={product.materialInfo}
        />

        <RelatedProducts />
      </div>
    </>
  );
}
