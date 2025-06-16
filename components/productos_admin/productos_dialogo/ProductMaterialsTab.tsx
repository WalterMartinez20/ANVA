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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Material, ProductMaterial } from "@/types/producto_admin";
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

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-end gap-4 mb-4">
        <div className="flex-1">
          <Label htmlFor="newMaterialId" className="mb-2 block">
            Material
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
              {materials.map((material) => {
                const isAdded = productMaterials.some(
                  (pm) => pm.materialId === material.id
                );

                return (
                  <SelectItem
                    key={material.id}
                    value={material.id.toString()}
                    disabled={isAdded}
                    className={isAdded ? "text-muted-foreground" : ""}
                  >
                    {material.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={handleAddMaterial}>
          Añadir
        </Button>
      </div>

      {productMaterials.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productMaterials.map((pm, index) => {
              const material =
                pm.material || materials.find((m) => m.id === pm.materialId);
              return (
                <TableRow key={index}>
                  <TableCell>{material?.name || `#${pm.materialId}`}</TableCell>
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
        <div className="text-center py-8 text-red-500 font-medium">
          Este producto no tiene materiales asignados.
        </div>
      )}
    </div>
  );
};
