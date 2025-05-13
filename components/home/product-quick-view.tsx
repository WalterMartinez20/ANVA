"use client";

import { useState, useEffect } from "react";
import {
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types/producto_admin";

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({
  product,
  isOpen,
  onClose,
}: ProductQuickViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [animateIn, setAnimateIn] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimateIn(true), 50);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (dir: "next" | "prev") => {
    const total = product.images.length;
    setCurrentImageIndex((prev) =>
      dir === "next" ? (prev + 1) % total : (prev - 1 + total) % total
    );
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.url || "/placeholder.svg",
    });

    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido al carrito`,
    });

    handleClose();
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
      setCurrentImageIndex(0);
      setQuantity(1);
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300"
      style={{ opacity: animateIn ? 1 : 0 }}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto transition-transform duration-300 ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-4 border-b">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Galería de imágenes */}
          <div>
            <div className="aspect-square relative mb-3 rounded-md overflow-hidden bg-gray-100">
              <img
                src={
                  product.images[currentImageIndex]?.url || "/placeholder.svg"
                }
                alt={product.name}
                loading="lazy"
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageChange("prev")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleImageChange("next")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {product.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 border rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      index === currentImageIndex
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img.url || "/placeholder.svg"}
                      alt={`Vista ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles del producto */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">
              {product.name}
            </h2>

            <div className="flex items-center gap-1 mt-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4 ? "fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">(12 reseñas)</span>
            </div>

            <div className="mt-4">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <p className="text-sm text-gray-600 mt-2">
                Categoría: {product.category || "General"}
              </p>
              {product.description && (
                <p className="mt-4 text-gray-700">{product.description}</p>
              )}
            </div>

            {/* Materiales */}
            {product.materials.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Materiales</h4>
                <ul className="text-sm space-y-1">
                  {product.materials.map((m) => (
                    <li key={m.materialId}>
                      {m.material.name}: {m.quantity} {m.material.unit || ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cantidad */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Cantidad</h4>
              <div className="flex items-center w-32 border rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-muted disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-3 py-2 hover:bg-muted disabled:opacity-50"
                  disabled={quantity >= product.stock}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm mt-1">
                {product.stock > 0 ? (
                  <span
                    className={
                      product.stock <= 5 ? "text-red-500" : "text-green-600"
                    }
                  >
                    {product.stock} unidades disponibles
                  </span>
                ) : (
                  <span className="text-red-500">Agotado</span>
                )}
              </p>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock > 0 ? "Agregar al carrito" : "Agotado"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 hover:fill-red-500" />
                </Button>
              </div>
              <Link href={`/producto/${product.id}`} onClick={handleClose}>
                <Button variant="outline" className="w-full hover:text-primary">
                  Ver detalles completos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
