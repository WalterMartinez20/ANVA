/*
📌 Responsabilidad: Manejo de estado para el formulario de producto (crear/editar).

✔️ Qué hace:

Maneja el estado formData, productImages, productMaterials, activeTab.

Provee funciones como resetForm() y loadProduct(product).

🔁 Encapsula la lógica del formulario para evitar usar múltiples useState.

manejo del formulario

*/

import { useState } from "react";
import {
  ProductFormData,
  ProductImage,
  ProductMaterial,
} from "@/types/producto_admin";

// Valores por defecto del formulario
const initialFormData: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category: "",
  colors: [],
  width: undefined,
  height: undefined,
  depth: undefined,
  strapDescription: "",
  materialInfo: "",
};

// Añade este tipo una sola vez para usar en ambos lados
export type ProductTab = "general" | "images" | "materials";

export function useProductForm() {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [productMaterials, setProductMaterials] = useState<ProductMaterial[]>(
    []
  );
  const [activeTab, setActiveTab] = useState<ProductTab>("general");

  // Reinicia todos los estados a sus valores iniciales
  const resetForm = () => {
    setFormData(initialFormData);
    setProductImages([]);
    setProductMaterials([]);
    setActiveTab("general");
  };

  // Cargar un producto completo para editar
  const loadProduct = (data: ProductFormData) => {
    setFormData(data);
  };

  return {
    formData,
    setFormData,
    productImages,
    setProductImages,
    productMaterials,
    setProductMaterials,
    activeTab,
    setActiveTab,
    resetForm,
    loadProduct,
  };
}
