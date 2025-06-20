"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";

import { ProductTable } from "@/components/productos_admin/ProductTable";
import { ProductDialog } from "@/components/productos_admin/productos_dialogo/ProductDialog";
import HelpSection from "@/components/help/HelpSection";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";

import { useAdminProductos } from "@/hooks/productos_admin/useAdminProductos";

export default function AdminProductos() {
  const {
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
  } = useAdminProductos();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ayuda contextual */}
      <HelpSection videoUrl="/help-videos/productos.mp4" />

      {/* Encabezado principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Gestión de Productos</h1>
          <TooltipInfoButton content="Aquí puedes ver, crear y editar productos del catálogo." />
        </div>

        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
          <TooltipInfoButton content="Haz clic para añadir un nuevo producto a tu tienda." />
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          className="pl-10 pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <TooltipInfoButton content="Puedes buscar por nombre, código o categoría." />
        </div>
      </div>

      {/* Tabla de productos */}
      <ProductTable
        products={sortedProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRequestSort={requestSort}
      />

      {/* Modal de edición / creación */}
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
        categoryOptions={categories}
      />
    </div>
  );
}
