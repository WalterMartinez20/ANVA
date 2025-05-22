import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Product,
  ProductFormData,
  ProductImage,
  ProductMaterial,
} from "@/types/producto_admin";
import { useProducts } from "./useProducts";
import { useProductForm } from "./useProductForm";
import {
  getProductById,
  saveProduct,
  deleteProduct,
  uploadImage,
  parseColors,
  getCategories,
} from "@/lib/services/products";

export function useAdminProductos() {
  const { products, setProducts, materials, setMaterials, isLoading } =
    useProducts();
  const {
    formData,
    setFormData,
    productImages,
    setProductImages,
    productMaterials,
    setProductMaterials,
    activeTab,
    setActiveTab,
    resetForm,
  } = useProductForm();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías",
          variant: "destructive",
        });
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    [product.name, product.description, product.category]
      .filter(Boolean)
      .some((val) => val!.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key as keyof Product;
    const aValue = a[key] ?? "";
    const bValue = b[key] ?? "";
    return sortConfig.direction === "ascending"
      ? aValue < bValue
        ? -1
        : aValue > bValue
        ? 1
        : 0
      : aValue > bValue
      ? -1
      : aValue < bValue
      ? 1
      : 0;
  });

  const requestSort = (key: string) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };

  const handleCreate = () => {
    resetForm();
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (product: Product) => {
    try {
      const fullProduct = await getProductById(product.id);
      setFormData({
        name: fullProduct.name,
        description: fullProduct.description ?? "",
        price: fullProduct.price,
        stock: fullProduct.stock,
        category: fullProduct.category ?? "",
        colors: parseColors(fullProduct.colors),
        width: fullProduct.width ?? null,
        height: fullProduct.height ?? null,
        depth: fullProduct.depth ?? null,
        strapDescription: fullProduct.strapDescription ?? "",
        materialInfo: fullProduct.materialInfo ?? "",
      });
      setProductImages(fullProduct.images ?? []);
      setProductMaterials(fullProduct.materials ?? []);
      setEditingProduct(fullProduct);
      setActiveTab("general");
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error al cargar producto:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del producto",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?"))
      return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast({
        title: "Producto eliminado",
        description: "Eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al eliminar producto",
        variant: "destructive",
      });
    }
  };

  const handleDialogSubmit = async (
    formData: ProductFormData,
    images: ProductImage[],
    materials: ProductMaterial[]
  ) => {
    if (!formData.name || !formData.price) {
      toast({
        title: "Campos requeridos",
        description: "Nombre y precio son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Debes añadir al menos una imagen",
        variant: "destructive",
      });
      return;
    }

    formData.materialInfo = materials
      .map((pm) => pm.material?.name)
      .filter(Boolean)
      .join(", ");

    setIsSubmitting(true);

    try {
      const uploadedImages = await Promise.all(
        images.map(async (image) =>
          image.file
            ? { ...image, url: await uploadImage(image.file), file: undefined }
            : image
        )
      );

      // ✅ saveProduct ya devuelve el producto con category.name si configuraste bien el backend
      const result = await saveProduct(
        formData,
        uploadedImages,
        materials,
        editingProduct
      );

      if (editingProduct) {
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? result : p))
        );
        toast({
          title: "Producto actualizado",
          description: "Actualizado correctamente.",
        });
      } else {
        setProducts([...products, result]);
        toast({
          title: "Producto creado",
          description: "Creado correctamente.",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al guardar producto",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLoading,
    sortedProducts,
    searchTerm,
    setSearchTerm,
    requestSort,
    handleCreate,
    handleEdit,
    handleDelete,
    isDialogOpen,
    setIsDialogOpen,
    handleDialogSubmit,
    formData,
    setFormData,
    productImages,
    setProductImages,
    productMaterials,
    setProductMaterials,
    materials,
    activeTab,
    setActiveTab,
    editingProduct,
    isSubmitting,
    categories,
  };
}
