"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ProductTable } from "@/components/productos_admin/ProductTable";
import { ProductDialog } from "@/components/productos_admin/productos_dialogo/ProductDialog";
import {
  ProductFormData,
  ProductImage,
  ProductMaterial,
  Material,
  Product,
} from "@/types/producto_admin";
import { useProducts } from "@/hooks/productos_admin/useProducts";
import { useProductForm } from "@/hooks/productos_admin/useProductForm";
import {
  getProductById,
  saveProduct,
  deleteProduct,
  uploadImage,
  parseColors,
} from "@/lib/services/products";

export default function AdminProductos() {
  const { products, setProducts, materials, setMaterials, isLoading } =
    useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  // Estado para el diálogo de crear/editar
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const {
    formData,
    setFormData,
    productImages,
    setProductImages,
    productMaterials,
    setProductMaterials,
    activeTab,
    setActiveTab,
  } = useProductForm();

  // Filtrar productos por término de búsqueda
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category &&
        product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig) return 0;

    const key = sortConfig.key as keyof Product;

    const aValue = a[key] ?? "";
    const bValue = b[key] ?? "";

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Abrir diálogo para crear nuevo producto
  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
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
    });
    setProductImages([]);
    setProductMaterials([]);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  // Abrir diálogo para editar producto
  const handleEdit = async (product: Product) => {
    try {
      const fullProduct = await getProductById(product.id);

      // Setear todos los campos correctamente
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
        materialInfo: fullProduct.materialInfo ?? "", // si usas esta prop
      });
      setProductImages(fullProduct.images ?? []);
      setProductMaterials(fullProduct.materials ?? []);
      setEditingProduct(fullProduct);
      setActiveTab("general"); // para que abra directamente la pestaña general
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

  // Eliminar producto
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

  // se supone que funciona
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
      // 🔄 Subir imágenes locales si es necesario
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          if (image.file) {
            const uploadedUrl = await uploadImage(image.file);
            return {
              ...image,
              url: uploadedUrl,
              file: undefined,
            };
          }
          return image;
        })
      );

      const saved = await saveProduct(
        formData,
        uploadedImages,
        materials,
        editingProduct
      );

      if (editingProduct) {
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? saved : p))
        );
        toast({
          title: "Producto actualizado",
          description: "Actualizado correctamente.",
        });
      } else {
        setProducts([...products, saved]);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <Button className="flex items-center gap-2" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ProductTable
        products={sortedProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRequestSort={requestSort}
      />

      {/* Diálogo para crear/editar producto */}
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        isSubmitting={isSubmitting}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        productImages={productImages}
        setProductImages={setProductImages}
        productMaterials={productMaterials}
        setProductMaterials={setProductMaterials}
        materials={materials}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
