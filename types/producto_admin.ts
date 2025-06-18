// types/producto_admin.ts
import type { Material } from "@/types/material";

export interface ProductMaterial {
  materialId: number;
  quantity: number;
  material: Material;
}

export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
  file?: File; //para subir archivos locales
  position: number;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  materials: ProductMaterial[];
  colors?: string[] | string;
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  strapDescription?: string | null;
  materialInfo?: string | null;
  //nuevas props
  rating?: number;
  reviews?: number;
  originalPrice?: number;
}

export interface ProductFormData {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  width?: number | null; // Aseguramos que permita null
  height?: number | null;
  depth?: number | null;
  strapDescription?: string;
  materialInfo?: string;
  colors?: string[]; // colores como array de strings
}

export interface Favorite {
  id: number;
  productId: number;
  product: Product;
}
