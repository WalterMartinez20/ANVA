/*
* Responsabilidad: Lógica para cargar productos y materiales desde la API.

* Usa useEffect para cargar /api/products y /api/materials.

* Devuelve products, materials, isLoading, y sus setters.

* Separa la lógica de carga del componente.

* Carga productos y materiales
*/

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Product } from "@/types/producto_admin";

export function useProducts() {
  const { user, isLoading: authLoading } = useAuth(); // usamos tu AuthContext
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Esperamos a que Auth termine de cargar

    if (!user || user.role !== "ADMIN") {
      setIsLoading(false); // Si no es admin, no hacemos fetch
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/products");
        const matRes = await fetch("/api/admin/materials");

        if (!res.ok || !matRes.ok) {
          throw new Error("Error al cargar productos o materiales");
        }

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
  }, [user, authLoading]);

  return {
    products,
    setProducts,
    materials,
    setMaterials,
    isLoading,
  };
}
