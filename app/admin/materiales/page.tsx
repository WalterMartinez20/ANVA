"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import HelpSection from "@/components/help/HelpSection";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";

interface Material {
  id: number;
  name: string;
  description: string | null;
  stock: number;
  unit: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMateriales() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: 0,
    unit: "",
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/api/materials");
        if (!response.ok) throw new Error("Error al cargar materiales");

        const data = await response.json();
        setMaterials(data.materials || []);
      } catch (error) {
        console.error("Error al cargar materiales:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los materiales",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false)
  );

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (!sortConfig) return 0;

    const key = sortConfig.key as keyof Material;
    const aValue = a[key] ?? "";
    const bValue = b[key] ?? "";

    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleCreate = () => {
    setEditingMaterial(null);
    setFormData({ name: "", description: "", stock: 0, unit: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      description: material.description || "",
      stock: material.stock,
      unit: material.unit || "",
    });
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "stock" ? Number.parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingMaterial
        ? `/api/materials/${editingMaterial.id}`
        : "/api/materials";
      const method = editingMaterial ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar material");
      }

      const data = await response.json();

      if (editingMaterial) {
        setMaterials(
          materials.map((m) =>
            m.id === editingMaterial.id ? data.material : m
          )
        );
        toast({
          title: "Material actualizado",
          description: "Actualizado correctamente",
        });
      } else {
        setMaterials([...materials, data.material]);
        toast({
          title: "Material creado",
          description: "Creado correctamente",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error al guardar material:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al guardar material",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este material?"))
      return;

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar material");
      }

      setMaterials(materials.filter((m) => m.id !== id));
      toast({
        title: "Material eliminado",
        description: "Eliminado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar material:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al eliminar material",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HelpSection videoUrl="/help-videos/materiales.mp4" />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Gestión de Materiales</h1>
          <TooltipInfoButton content="Administra los materiales disponibles para fabricar productos." />
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nuevo Material
          </Button>
          <TooltipInfoButton content="Haz clic para añadir un nuevo material a tu inventario." />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar materiales..."
            className="pl-10 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <TooltipInfoButton content="Puedes buscar por nombre o descripción." />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="min-w-[200px]">
                <div className="flex items-center gap-1">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => requestSort("name")}
                  >
                    Nombre
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
              </TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => requestSort("stock")}
                  >
                    Stock
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
              </TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          {/* ...Body sin cambios... */}
        </Table>
      </div>

      {/* Diálogo de Crear/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? "Editar Material" : "Nuevo Material"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
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
                  Stock
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
                  Unidad
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
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
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
    </div>
  );
}
