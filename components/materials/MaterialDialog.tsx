"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category, FormData, Property } from "@/types/material";

import { Trash2 } from "lucide-react";

interface MaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormData) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  categorias: Category[];
  isEditing?: boolean;
}

export default function MaterialDialog({
  open,
  onOpenChange,
  onSave,
  formData,
  setFormData,
  categorias,
  isEditing,
}: MaterialDialogProps) {
  const [customPropertyName, setCustomPropertyName] = useState("");
  const [customPropertyValue, setCustomPropertyValue] = useState("");
  const [tempPropertyIdCounter, setTempPropertyIdCounter] = useState(-1);

  const categoria = categorias?.find((c) => c.id === formData.categoriaId);
  const propiedades: Property[] = categoria?.propiedades ?? [];

  const handleInputChange = (
    key: keyof FormData,
    value: string | number | null
  ) => {
    setFormData({ ...formData, [key]: value });
  };

  const handlePropiedadChange = (propiedadId: number, valor: string) => {
    setFormData((prev) => {
      const updated = [...prev.propiedades];
      const index = updated.findIndex((p) => p.propiedadId === propiedadId);

      if (index >= 0) {
        updated[index].valor = valor;
      } else {
        updated.push({ propiedadId, valor });
      }

      return { ...prev, propiedades: updated };
    });
  };

  const handleAddCustomProperty = () => {
    const nombre = customPropertyName.trim();
    const valor = customPropertyValue.trim();

    if (!nombre || !valor) return;

    const alreadyExists =
      propiedades.find((p) => p.nombre === nombre) ||
      formData.propiedades.find((p) => p.nombre === nombre);

    if (alreadyExists) return;

    setFormData((prev) => ({
      ...prev,
      propiedades: [
        ...prev.propiedades,
        {
          propiedadId: tempPropertyIdCounter,
          nombre,
          valor,
        },
      ],
    }));

    setTempPropertyIdCounter((prev) => prev - 1);
    setCustomPropertyName("");
    setCustomPropertyValue("");
  };

  const handleRemoveCustomProperty = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      propiedades: prev.propiedades.filter((p) => p.propiedadId !== id),
    }));
  };

  const allProps: Property[] = [
    ...propiedades,
    ...formData.propiedades
      .filter((p) => p.propiedadId < 0)
      .map((p) => ({
        id: p.propiedadId,
        nombre: p.nombre ?? "Propiedad personalizada",
        tipo: "string" as const,
      })),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-zinc-800">
            {isEditing ? "Editar material" : "Crear nuevo material"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descripción
            </Label>
            <Input
              id="description"
              className="col-span-3"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              id="stock"
              type="number"
              className="col-span-3"
              value={formData.stock}
              onChange={(e) =>
                handleInputChange("stock", parseInt(e.target.value))
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">
              Unidad
            </Label>
            <Input
              id="unit"
              className="col-span-3"
              value={formData.unit}
              onChange={(e) => handleInputChange("unit", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoriaId" className="text-right">
              Categoría
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.categoriaId?.toString() ?? "none"}
                onValueChange={(value) =>
                  handleInputChange(
                    "categoriaId",
                    value === "none" ? null : parseInt(value)
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  <SelectItem value="none">Sin categoría</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Propiedades */}
          {allProps.map((prop) => {
            const valorActual =
              formData.propiedades.find((p) => p.propiedadId === prop.id)
                ?.valor || "";

            const isCustom = prop.id < 0;

            return (
              <div
                key={prop.id}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label htmlFor={`prop-${prop.id}`} className="text-right">
                  {prop.nombre}
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id={`prop-${prop.id}`}
                    name={`prop-${prop.id}`}
                    type={prop.tipo === "number" ? "number" : "text"}
                    value={valorActual}
                    onChange={(e) =>
                      handlePropiedadChange(prop.id, e.target.value)
                    }
                  />
                  {isCustom && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleRemoveCustomProperty(prop.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Formulario nueva propiedad */}
          <hr className="my-2" />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Nueva Propiedad</Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <Input
                placeholder="Nombre (ej: Color)"
                value={customPropertyName}
                onChange={(e) => setCustomPropertyName(e.target.value)}
              />
              <Input
                placeholder="Valor (ej: Rojo)"
                value={customPropertyValue}
                onChange={(e) => setCustomPropertyValue(e.target.value)}
              />
              <Button
                variant="default"
                type="button"
                onClick={handleAddCustomProperty}
                className="col-span-2"
              >
                Añadir Propiedad Personalizada
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(formData)}>
            {isEditing ? "Guardar cambios" : "Crear Material"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
