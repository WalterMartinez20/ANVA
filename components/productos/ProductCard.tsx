"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/components/ui/use-toast";

import { colorMap } from "@/lib/colorMap";
import Info from "@/components/productos/Info";
import ColorSelector from "@/components/productos/ColorSelector";
import ProductGallerySlider from "@/components/productos/ProductGallerySlider";
import Actions from "@/components/productos/Actions";
import { Product } from "@/types/producto_admin";

interface Props {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (productId: number) => void;
  outOfStock?: boolean; // para mostrar un mensaje de stock
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  outOfStock,
}: Props) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const rawColors = Array.isArray(product.colors)
    ? product.colors
    : typeof product.colors === "string"
    ? product.colors.split(",").map((c) => c.trim())
    : [];

  const colorOptions = rawColors
    .map((c) => c.toLowerCase())
    .filter(Boolean)
    .map((name) => ({
      id: name,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: colorMap[name] || "#cccccc",
    }));

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast({
        title: "Selecciona un color",
        description: "Por favor selecciona un color antes de añadir al carrito",
        variant: "destructive",
      });
      return;
    }

    setAddingToCart(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image:
        product.images?.find((img) => img.isMain)?.url ||
        product.images?.[0]?.url ||
        "/placeholder.svg",
      customization: `Color: ${selectedColor}`,
    });

    toast({
      title: "Producto añadido",
      description: `${product.name} (${selectedColor}) ha sido añadido al carrito`,
    });

    setTimeout(() => {
      setAddingToCart(false);
      setSelectedColor(null);
    }, 1000);
  };

  return (
    <Card className="relative flex flex-col border border-gray-200 hover:shadow-md hover:border-primary/50 transition-all duration-300 rounded-lg overflow-hidden group">
      <div className="relative bg-white">
        <Link href={`/producto/${product.id}`}>
          <ProductGallerySlider
            images={Array.isArray(product.images) ? product.images : []}
            altText={product.name}
            aspectRatio="square"
            rounded={false}
            showArrows={true}
            showThumbnails={false}
          />
        </Link>
        {outOfStock && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded z-10">
            Sin stock
          </div>
        )}
        {/* Aqui va el boton favoritos (se renderiza por medio del componente Actions) ❤️ */}
      </div>

      <div className="p-3 flex flex-col gap-2 flex-grow">
        {/* Título, categoría, precio y rating */}
        {/* Solo pasamos product porque en info esta desestructurado todo desde product, esto para no repetir props y que quede más limpio. */}
        <Info product={product} compact />

        <ColorSelector
          colors={colorOptions}
          selectedColor={selectedColor}
          onSelect={(id) =>
            setSelectedColor((prev) => (prev === id ? null : id))
          }
          hoverReveal
          showLabel={false}
          showSelectedName={false}
          compact
        />

        {/* Solo botón "Agregar al carrito" */}
        <Actions
          onAddToCart={handleAddToCart}
          onToggleFavorite={() => {
            onToggleFavorite(product.id);
            setSelectedColor(null);
          }}
          isFavorite={isFavorite}
          isAddingToFavorites={addingToCart}
          disabled={outOfStock || addingToCart}
          compact
        />
      </div>
    </Card>
  );
}
