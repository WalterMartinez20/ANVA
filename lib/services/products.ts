import {
  Product,
  ProductFormData,
  ProductImage,
  ProductMaterial,
} from "@/types/producto_admin";

// Utilidad para parsear colores desde string
export const parseColors = (input: string | string[] | undefined): string[] => {
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    return input
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }
  return [];
};

//Ya que al guardar productos convertís colores a string con .join(","), podemos encapsular eso:
export const stringifyColors = (colors: string[] | undefined): string => {
  return colors?.filter(Boolean).join(",") ?? "";
};

// Obtener producto por ID
export const getProductById = async (id: number): Promise<Product> => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar el producto");
  const data = await res.json();

  return {
    ...data.product,
    colors: parseColors(data.product.colors),
  };
};

// Guardar o actualizar producto
export const saveProduct = async (
  formData: ProductFormData,
  images: ProductImage[],
  materials: ProductMaterial[],
  editingProduct: Product | null
): Promise<Product> => {
  const url = editingProduct
    ? `/api/products/${editingProduct.id}`
    : "/api/products";
  const method = editingProduct ? "PUT" : "POST";

  const productData = {
    ...formData,
    colors: stringifyColors(formData.colors),
    materialInfo: formData.materialInfo?.trim() || null,
    strapDescription: formData.strapDescription?.trim() || null,
    images,
    materials,
  };

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al guardar producto");
    }

    const data = await res.json();

    return {
      ...data.product,
      colors: parseColors(data.product.colors),
    };
  } catch (error) {
    console.error("Error en saveProduct:", error);
    throw error;
  }
};

// Eliminar producto
export const deleteProduct = async (id: number): Promise<void> => {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Error al eliminar producto");
  }
};

// Subir imagenes
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir la imagen");
  }

  const data = await response.json();
  return data.url;
};
