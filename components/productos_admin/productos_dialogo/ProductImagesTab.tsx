"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ProductImage } from "@/types/producto_admin";

interface Props {
  images: ProductImage[];
  setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}

const SortableImageCard = ({
  image,
  index,
  onRemove,
  onSetMain,
}: {
  image: ProductImage;
  index: number;
  onRemove: (index: number) => void;
  onSetMain: (index: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`overflow-hidden group relative border ${
          image.isMain
            ? "border-primary ring-2 ring-primary"
            : "hover:shadow-md"
        }`}
      >
        <div className="aspect-square bg-muted">
          <img
            src={image.url}
            alt={`Imagen ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
        >
          <X className="h-4 w-4" />
        </button>
        <CardContent className="p-3">
          <Button
            type="button"
            variant={image.isMain ? "default" : "outline"}
            className="w-full px-3 py-1.5 text-xs leading-snug rounded-md whitespace-normal"
            onClick={() => onSetMain(index)}
            disabled={image.isMain}
          >
            {image.isMain ? "Imagen Principal" : "Establecer como Principal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProductImagesTab: React.FC<Props> = ({ images, setImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newUrl, setNewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleAddUrl = () => {
    if (!newUrl.trim()) {
      toast({ title: "Ingresa una URL válida de imagen." });
      return;
    }

    const isMain = images.length === 0;
    const newImage: ProductImage = {
      id: Date.now().toString(),
      url: newUrl.trim(),
      isMain,
      position: images.length,
    };
    setImages([...images, newImage]);
    setNewUrl("");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const newImages: ProductImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const blobUrl = URL.createObjectURL(file);
      newImages.push({
        id: `${Date.now()}-${i}`,
        url: blobUrl,
        isMain: images.length === 0 && i === 0,
        file,
        position: images.length + i,
      });
    }
    setImages([...images, ...newImages]);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast({
      title: "Imágenes añadidas",
      description: `${newImages.length} imagen(es) añadida(s).`,
    });
  };

  const handleRemove = (index: number) => {
    const updated = [...images];
    const removed = updated.splice(index, 1)[0];
    if (removed.file && removed.url.startsWith("blob:")) {
      URL.revokeObjectURL(removed.url);
    }
    if (removed.isMain && updated.length > 0) {
      updated[0].isMain = true;
    }
    setImages(updated);
  };

  const handleSetMain = (index: number) => {
    setImages(images.map((img, i) => ({ ...img, isMain: i === index })));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = ({ active, over }: any) => {
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over?.id);
      setImages((items) =>
        arrayMove(items, oldIndex, newIndex).map((img, i) => ({
          ...img,
          position: i,
        }))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <Label className="block mb-1">Subir desde dispositivo</Label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Seleccionar imágenes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <Label className="block mb-1">Añadir por URL</Label>
            <Input
              placeholder="https://ejemplo.com/imagen.jpg"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <Button onClick={handleAddUrl} className="w-full mt-2">
              <ImagePlus className="h-4 w-4 mr-2" />
              Añadir Imagen
            </Button>
          </CardContent>
        </Card>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <SortableImageCard
                key={image.id}
                image={image}
                index={index}
                onRemove={handleRemove}
                onSetMain={handleSetMain}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {images.length === 0 && (
        <div className="text-center py-8 text-destructive font-medium">
          Debes añadir al menos una imagen para el producto.
        </div>
      )}
    </div>
  );
};
