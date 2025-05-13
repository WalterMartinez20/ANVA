import { useState, useEffect } from "react";
import { Product } from "@/types/producto_admin";
import { parseColors } from "@/lib/services/products";
import { colorMap } from "@/lib/colorMap";

interface ColorOption {
  id: string;
  name: string;
  value: string;
}

export function useProductDetails(productId: string | number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [availableColors, setAvailableColors] = useState<ColorOption[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("No se pudo cargar el producto");

        const data = await res.json();
        const prod: Product = data.product;

        setProduct(prod);

        // Procesar colores
        const colorList = parseColors(prod.colors);
        const colorOptions: ColorOption[] = colorList.map((color) => {
          const name =
            color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
          return {
            id: color.toLowerCase(),
            name,
            value: colorMap[color.toLowerCase()] || "#cccccc",
          };
        });
        setAvailableColors(colorOptions);
      } catch (error) {
        console.error("Error al obtener producto:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    isLoading,
    availableColors,
    selectedColor,
    setSelectedColor,
  };
}
