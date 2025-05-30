"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { ProductFormSchema } from "@/lib/schemas/productSchema";

interface ProductGeneralTabProps {
  categoryOptions: string[];
}

export const ProductGeneralTab: React.FC<ProductGeneralTabProps> = ({
  categoryOptions,
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ProductFormSchema>();

  return (
    <div className="space-y-4 py-4">
      {/* Nombre */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nombre
        </Label>
        <Input
          id="name"
          {...register("name")}
          className={`col-span-3 ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && (
          <p className="col-start-2 col-span-3 text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Descripción */}
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right pt-2">
          Descripción
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          className="col-span-3"
          rows={4}
        />
      </div>

      {/* Precio */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">
          Precio
        </Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          className={`col-span-3 ${errors.price ? "border-red-500" : ""}`}
        />
        {errors.price && (
          <p className="col-start-2 col-span-3 text-sm text-red-500">
            {errors.price.message}
          </p>
        )}
      </div>

      {/* Stock */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stock" className="text-right">
          Stock
        </Label>
        <Input
          id="stock"
          type="number"
          {...register("stock", { valueAsNumber: true })}
          className="col-span-3"
        />
      </div>

      {/* Categoría */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Categoría
        </Label>
        <div className="col-span-3">
          <Select
            value={watch("category") ?? ""}
            onValueChange={(value) => setValue("category", value)}
          >
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
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
          {errors.category && (
            <p className="text-sm text-red-500 mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Colores */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="colors" className="text-right">
          Colores disponibles
        </Label>
        <Input
          id="colors"
          placeholder="Ej: negro, beige"
          value={watch("colors")?.join(", ") ?? ""}
          onChange={(e) =>
            setValue(
              "colors",
              e.target.value.split(",").map((c) => c.trim())
            )
          }
          className="col-span-3"
        />
      </div>

      {/* Dimensiones */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Dimensiones (cm)</Label>
        <div className="col-span-3 grid grid-cols-3 gap-2">
          <Input
            type="number"
            placeholder="Ancho"
            {...register("width", { valueAsNumber: true })}
          />
          <Input
            type="number"
            placeholder="Alto"
            {...register("height", { valueAsNumber: true })}
          />
          <Input
            type="number"
            placeholder="Prof."
            {...register("depth", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Descripción Asa */}
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="strapDescription" className="text-right pt-2">
          Descripción del Asa
        </Label>
        <Textarea
          id="strapDescription"
          {...register("strapDescription")}
          className="col-span-3"
          rows={2}
        />
      </div>
    </div>
  );
};
