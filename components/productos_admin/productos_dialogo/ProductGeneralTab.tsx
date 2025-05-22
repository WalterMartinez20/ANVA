"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProductFormData } from "@/types/producto_admin";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ProductGeneralTabProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  categoryOptions: string[];
}

export const ProductGeneralTab: React.FC<ProductGeneralTabProps> = ({
  formData,
  setFormData,
  categoryOptions,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nombre
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right pt-2">
          Descripción
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description ?? ""}
          onChange={handleChange}
          className="col-span-3"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">
          Precio
        </Label>
        <Input
          id="price"
          type="number"
          placeholder="Precio"
          value={formData.price ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              price: e.target.value === "" ? null : parseFloat(e.target.value),
            }))
          }
          className="col-span-3"
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stock" className="text-right">
          Stock
        </Label>
        <Input
          id="stock"
          type="number"
          placeholder="Stock"
          value={formData.stock ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              stock: e.target.value === "" ? null : parseFloat(e.target.value),
            }))
          }
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Categoría
        </Label>
        <div className="col-span-3">
          <Select
            value={formData.category ?? ""}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="colors" className="text-right">
          Colores disponibles
        </Label>
        <Input
          id="colors"
          name="colors"
          placeholder="Ej: negro, cafe, rojo_oscuro, beige"
          value={formData.colors?.join(", ") ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              colors: e.target.value.split(",").map((c) => c.trim()),
            }))
          }
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Dimensiones (cm)</Label>
        <div className="col-span-3 grid grid-cols-3 gap-2">
          <Input
            type="number"
            placeholder="Ancho"
            value={formData.width ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                width:
                  e.target.value === "" ? null : parseFloat(e.target.value),
              }))
            }
          />
          <Input
            type="number"
            placeholder="Alto"
            value={formData.height ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                height:
                  e.target.value === "" ? null : parseFloat(e.target.value),
              }))
            }
          />
          <Input
            type="number"
            placeholder="Prof."
            value={formData.depth ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                depth:
                  e.target.value === "" ? null : parseFloat(e.target.value),
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="strapDescription" className="text-right pt-2">
          Descripción del Asa
        </Label>
        <Textarea
          id="strapDescription"
          value={formData.strapDescription ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              strapDescription: e.target.value,
            }))
          }
          className="col-span-3"
          rows={2}
        />
      </div>
    </div>
  );
};
