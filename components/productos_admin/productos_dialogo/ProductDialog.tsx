"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Product,
  ProductMaterial,
  ProductImage,
  Material,
  ProductFormData,
} from "@/types/producto_admin";
import { ProductGeneralTab } from "./ProductGeneralTab";
import { ProductImagesTab } from "./ProductImagesTab";
import { ProductMaterialsTab } from "./ProductMaterialsTab";
import type { ProductTab } from "@/hooks/productos_admin/useProductForm";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    formData: ProductFormData,
    images: ProductImage[],
    materials: ProductMaterial[]
  ) => Promise<void>;
  isSubmitting: boolean;
  editingProduct: Product | null;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  productImages: ProductImage[];
  setProductImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
  materials: Material[];
  productMaterials: ProductMaterial[];
  setProductMaterials: React.Dispatch<React.SetStateAction<ProductMaterial[]>>;
  activeTab: ProductTab;
  setActiveTab: (tab: ProductTab) => void;
  categoryOptions: string[];
}

export const ProductDialog: React.FC<ProductDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  editingProduct,
  formData,
  setFormData,
  productImages,
  setProductImages,
  activeTab,
  setActiveTab,
  materials,
  productMaterials,
  setProductMaterials,
  categoryOptions,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderedImages = productImages.map((img, index) => ({
      ...img,
      position: index,
    }));

    await onSubmit(formData, orderedImages, productMaterials);
  };

  const tabs: ("general" | "images" | "materials")[] = [
    "general",
    "images",
    "materials",
  ];

  const tabLabels: Record<(typeof tabs)[number], string> = {
    general: "Información General",
    images: "Imágenes",
    materials: "Materiales",
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onValueChange={(tab) => {
              if (
                tab === "general" ||
                tab === "images" ||
                tab === "materials"
              ) {
                setActiveTab(tab);
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tabLabels[tab]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="general">
              <ProductGeneralTab
                formData={formData}
                setFormData={setFormData}
                categoryOptions={categoryOptions}
              />
            </TabsContent>

            <TabsContent value="images">
              <ProductImagesTab
                images={productImages}
                setImages={setProductImages}
              />
            </TabsContent>

            <TabsContent value="materials">
              <ProductMaterialsTab
                materials={materials}
                productMaterials={productMaterials}
                setProductMaterials={setProductMaterials}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
