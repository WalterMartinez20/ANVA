/*
📌 Responsabilidad: Lógica para cargar productos y materiales desde la API.

✔️ Qué hace:

Usa useEffect para cargar /api/products y /api/materials.

Devuelve products, materials, isLoading, y sus setters.

🔁 Separa la lógica de carga del componente.

 carga productos y materiales
*/

import { useEffect, useState } from "react";
import { Product } from "@/types/producto_admin";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/products");
        const matRes = await fetch("/api/materials");
        if (!res.ok || !matRes.ok) throw new Error();

        const data = await res.json();
        const matData = await matRes.json();

        if (isMounted) {
          setProducts(data.products || []);
          setMaterials(matData.materials || []);
        }
      } catch (error) {
        console.error("Error cargando productos o materiales:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { products, setProducts, materials, setMaterials, isLoading };
}
