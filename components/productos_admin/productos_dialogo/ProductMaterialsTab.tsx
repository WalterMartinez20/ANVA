"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

import { ProductMaterial } from "@/types/producto_admin";
import { Material } from "@/types/material";
import { toast } from "@/components/ui/use-toast";

interface Props {
  materials: Material[];
  productMaterials: ProductMaterial[];
  setProductMaterials: React.Dispatch<React.SetStateAction<ProductMaterial[]>>;
}

export const ProductMaterialsTab: React.FC<Props> = ({
  materials,
  productMaterials,
  setProductMaterials,
}) => {
  const [newMaterialId, setNewMaterialId] = useState<number | "">("");
  const [materialSearch, setMaterialSearch] = useState("");

  const handleAddMaterial = () => {
    if (newMaterialId === "") {
      return toast({ title: "Selecciona un material." });
    }

    const exists = productMaterials.some((m) => m.materialId === newMaterialId);
    if (exists) {
      return toast({ title: "Este material ya fue añadido." });
    }

    const material = materials.find((m) => m.id === newMaterialId);
    if (!material) {
      toast({ title: "Material no encontrado." });
      return;
    }

    setProductMaterials([
      ...productMaterials,
      { materialId: newMaterialId, quantity: 0, material },
    ]);

    setNewMaterialId("");
  };

  const handleRemoveMaterial = (index: number) => {
    const updated = [...productMaterials];
    updated.splice(index, 1);
    setProductMaterials(updated);
  };

  const groupedMaterials = materials.reduce(
    (acc: Record<string, Material[]>, mat) => {
      const category = mat.categoria?.nombre || "Sin categoría";
      if (!acc[category]) acc[category] = [];
      acc[category].push(mat);
      return acc;
    },
    {}
  );

  const filteredGroupedMaterials = Object.entries(groupedMaterials).reduce(
    (acc: typeof groupedMaterials, [group, mats]) => {
      const filtered = mats.filter((mat) =>
        mat.name.toLowerCase().includes(materialSearch.toLowerCase())
      );
      if (filtered.length > 0) acc[group] = filtered;
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6 py-4">
      {/* Autocompletado */}
      <div>
        <Label htmlFor="materialSearch">Buscar y añadir material</Label>
        <div className="relative mt-1">
          <Input
            id="materialSearch"
            placeholder="Buscar por nombre..."
            value={materialSearch}
            onChange={(e) => setMaterialSearch(e.target.value)}
            autoComplete="off"
          />
          {materialSearch.length > 0 && (
            <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto text-sm">
              {Object.keys(filteredGroupedMaterials).length > 0 ? (
                Object.entries(filteredGroupedMaterials).map(
                  ([group, mats]) => (
                    <div key={group} className="border-t first:border-none">
                      <div className="px-3 py-1 text-xs font-semibold text-primary bg-gray-50 uppercase tracking-wide">
                        {group}
                      </div>
                      {mats.map((material) => {
                        const isAdded = productMaterials.some(
                          (pm) => pm.materialId === material.id
                        );
                        return (
                          <button
                            key={material.id}
                            type="button"
                            disabled={isAdded}
                            onClick={() => {
                              setProductMaterials([
                                ...productMaterials,
                                {
                                  materialId: material.id,
                                  quantity: 0,
                                  material,
                                },
                              ]);
                              setMaterialSearch("");
                              toast({
                                title: "Material añadido",
                                description: material.name,
                              });
                            }}
                            className={`w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 ${
                              isAdded
                                ? "text-muted-foreground cursor-not-allowed"
                                : "text-gray-700"
                            }`}
                          >
                            <span className="truncate">{material.name}</span>
                            {isAdded && (
                              <span className="text-xs">Ya añadido</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )
                )
              ) : (
                <div className="px-4 py-2 text-muted-foreground">
                  Sin resultados
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Select agrupado por categoría */}
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="newMaterialId" className="mb-1 block">
            O seleccionar desde la lista
          </Label>
          <Select
            value={newMaterialId.toString()}
            onValueChange={(value) =>
              setNewMaterialId(value ? parseInt(value) : "")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar material" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupedMaterials).map(([group, mats]) => (
                <React.Fragment key={group}>
                  <div className="px-3 py-1 text-xs font-semibold text-primary bg-gray-100 uppercase tracking-wide">
                    {group}
                  </div>
                  {mats.map((material) => {
                    const isAdded = productMaterials.some(
                      (pm) => pm.materialId === material.id
                    );
                    return (
                      <SelectItem
                        key={material.id}
                        value={material.id.toString()}
                        disabled={isAdded}
                        className={`flex justify-between items-center ${
                          isAdded ? "text-muted-foreground" : "text-gray-800"
                        }`}
                      >
                        <span className="truncate">{material.name}</span>
                        {isAdded && (
                          <span className="text-xs ml-2">(Ya añadido)</span>
                        )}
                      </SelectItem>
                    );
                  })}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={handleAddMaterial}>
          Añadir
        </Button>
      </div>

      {/* Tabla de materiales añadidos */}
      {productMaterials.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productMaterials.map((pm, index) => {
              const material =
                pm.material || materials.find((m) => m.id === pm.materialId);
              return (
                <TableRow
                  key={index}
                  className="even:bg-muted/50 hover:bg-muted transition"
                >
                  <TableCell className="font-medium text-sm">
                    {material?.name || `#${pm.materialId}`}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {material?.categoria?.nombre || "Sin categoría"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMaterial(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-destructive font-medium">
          Este producto no tiene materiales asignados.
        </div>
      )}
    </div>
  );
};
