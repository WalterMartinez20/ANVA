"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";
import { useEffect, useState } from "react";

interface Property {
  id: number;
  nombre: string;
  tipo: "string" | "number" | "boolean";
}

interface Category {
  id: number;
  nombre: string;
  propiedades: Property[];
}

interface PropertyValue {
  propiedadId: number;
  valor: string;
}

interface FormData {
  name: string;
  description: string;
  stock: number;
  unit: string;
  categoriaId: number | null;
  propiedades: PropertyValue[];
}

interface MaterialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  editingMaterial: boolean;
}

export default function MaterialFormDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  editingMaterial,
}: MaterialFormDialogProps) {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [propiedades, setPropiedades] = useState<Property[]>([]);

  useEffect(() => {
    fetch("/api/admin/materials/material-category")
      .then((res) => res.json())
      .then((data) => setCategorias(data.categories))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  useEffect(() => {
    const selected = categorias.find((c) => c.id === formData.categoriaId);
    setPropiedades(selected?.propiedades || []);
  }, [formData.categoriaId, categorias]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "stock") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else if (name === "categoriaId") {
      setFormData({
        ...formData,
        categoriaId: parseInt(value),
        propiedades: [],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePropiedadChange = (id: number, valor: string) => {
    const updated = [...formData.propiedades];
    const index = updated.findIndex((p) => p.propiedadId === id);
    if (index !== -1) {
      updated[index].valor = valor;
    } else {
      updated.push({ propiedadId: id, valor });
    }
    setFormData({ ...formData, propiedades: updated });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingMaterial ? "Editar Material" : "Nuevo Material"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock{" "}
                <TooltipInfoButton content="Cantidad actual disponible en inventario." />
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unidad{" "}
                <TooltipInfoButton content="Unidad de medida (ej. metros, unidades, kilos...)." />
              </Label>
              <Input
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="col-span-3"
                placeholder="metros, unidades, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoriaId" className="text-right">
                Categoría
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.categoriaId?.toString() ?? ""}
                  onValueChange={(value) => {
                    if (value === "none") return;
                    const id = parseInt(value);
                    setFormData({
                      ...formData,
                      categoriaId: id,
                      propiedades: [],
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" disabled>
                      Selecciona una categoría
                    </SelectItem>
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Inputs dinámicos por propiedad */}
            {propiedades.map((prop) => {
              const valorActual =
                formData.propiedades.find((p) => p.propiedadId === prop.id)
                  ?.valor || "";
              return (
                <div
                  key={prop.id}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor={`prop-${prop.id}`} className="text-right">
                    {prop.nombre}
                  </Label>
                  <Input
                    id={`prop-${prop.id}`}
                    name={`prop-${prop.id}`}
                    type={prop.tipo === "number" ? "number" : "text"}
                    className="col-span-3"
                    value={valorActual}
                    onChange={(e) =>
                      handlePropiedadChange(prop.id, e.target.value)
                    }
                  />
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
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
}
