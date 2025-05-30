"use client";

import React from "react";
import { useEffect } from "react";
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
import { toast } from "@/components/ui/use-toast";

import { ProductGeneralTab } from "./ProductGeneralTab";
import { ProductImagesTab } from "./ProductImagesTab";
import { ProductMaterialsTab } from "./ProductMaterialsTab";
import type { ProductTab } from "@/hooks/productos_admin/useProductForm";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/schemas/productSchema";

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
  productImages,
  setProductImages,
  activeTab,
  setActiveTab,
  materials,
  productMaterials,
  setProductMaterials,
  categoryOptions,
}) => {
  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  // * Problema: Los campos del formulario aparecían vacíos al editar un producto porque react-hook-form solo toma defaultValues una vez cuando se monta el formulario. Los cambios posteriores en formData no se reflejan automáticamente.
  //* Solucion: Se agregó un useEffect que llama a methods.reset(formData) cada vez que formData cambia, forzando que los inputs se actualicen con los nuevos datos del producto.
  useEffect(() => {
    methods.reset(formData);
  }, [formData]);

  const handleValidSubmit = async (data: ProductFormData) => {
    if (productImages.length === 0) {
      return toast({
        title: "Error",
        description: "Debes añadir al menos una imagen",
        variant: "destructive",
      });
    }

    if (productMaterials.length === 0) {
      return toast({
        title: "Error",
        description: "Debes asignar al menos un material",
        variant: "destructive",
      });
    }

    const orderedImages = productImages.map((img, index) => ({
      ...img,
      position: index,
    }));

    await onSubmit(data, orderedImages, productMaterials);
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

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleValidSubmit)}>
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
                <ProductGeneralTab categoryOptions={categoryOptions} />
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
