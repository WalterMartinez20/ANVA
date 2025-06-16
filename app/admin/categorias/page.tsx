"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  FolderPlus,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import HelpSection from "@/components/help/HelpSection";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  count: number;
  subcategories?: Category[];
}

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  // Estado para el diálogo de crear/editar
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
  });

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Error al cargar categorías");

        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filtrar categorías por término de búsqueda
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Ordenar categorías
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!sortConfig) return 0;

    const key = sortConfig.key as keyof Category;

    if (a[key] < b[key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Abrir diálogo para crear nueva categoría
  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      parentId: "",
    });
    setIsDialogOpen(true);
  };

  // Abrir diálogo para crear subcategoría
  const handleCreateSubcategory = (parentCategory: Category) => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      parentId: parentCategory.id.toString(),
    });
    setIsDialogOpen(true);
  };

  // Abrir diálogo para editar categoría
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parentId: category.parentId ? category.parentId.toString() : "",
    });
    setIsDialogOpen(true);
  };

  // Manejar cambios en el formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Guardar categoría (crear o actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.slug}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          parentId: formData.parentId
            ? Number.parseInt(formData.parentId)
            : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar categoría");
      }

      const data = await response.json();

      // Recargar categorías para actualizar la lista
      const categoriesResponse = await fetch("/api/categories");
      if (!categoriesResponse.ok)
        throw new Error("Error al recargar categorías");

      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData.categories || []);

      setIsDialogOpen(false);
      toast({
        title: editingCategory ? "Categoría actualizada" : "Categoría creada",
        description: editingCategory
          ? "La categoría ha sido actualizada correctamente"
          : "La categoría ha sido creada correctamente",
      });
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al guardar categoría",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar categoría
  const handleDelete = async (category: Category) => {
    // Verificar si tiene subcategorías
    if (category.subcategories && category.subcategories.length > 0) {
      toast({
        title: "Error",
        description: "No se puede eliminar una categoría con subcategorías",
        variant: "destructive",
      });
      return;
    }

    if (
      !window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${category.slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar categoría");
      }

      // Recargar categorías para actualizar la lista
      const categoriesResponse = await fetch("/api/categories");
      if (!categoriesResponse.ok)
        throw new Error("Error al recargar categorías");

      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData.categories || []);

      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al eliminar categoría",
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
    <div>
      <HelpSection videoUrl="/help-videos/categorias.mp4" />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
          <TooltipInfoButton content="Aquí puedes gestionar las categorías y subcategorías de productos." />
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </Button>
          <TooltipInfoButton content="Crea una nueva categoría principal para agrupar productos." />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categorías..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2">
            <TooltipInfoButton content="Busca por nombre o descripción de la categoría." />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("name")}
                >
                  Nombre
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("count")}
                >
                  Productos
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron categorías
                </TableCell>
              </TableRow>
            ) : (
              sortedCategories.map((category) => (
                <React.Fragment key={category.id}>
                  <TableRow>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary"
                      >
                        Principal
                      </Badge>
                    </TableCell>
                    <TableCell>{category.count}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={() => handleCreateSubcategory(category)}
                          >
                            <FolderPlus className="h-4 w-4" />
                            <span>Añadir Subcategoría</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-red-600"
                            onClick={() => handleDelete(category)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {/* Subcategorías */}
                  {category.subcategories &&
                    category.subcategories.map((subcategory) => (
                      <TableRow key={subcategory.id} className="bg-muted/30">
                        <TableCell className="pl-8 font-medium">
                          {subcategory.name}
                        </TableCell>
                        <TableCell>{subcategory.description || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-secondary/10 text-secondary"
                          >
                            Subcategoría
                          </Badge>
                        </TableCell>
                        <TableCell>{subcategory.count}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={() => handleEdit(subcategory)}
                              >
                                <Edit className="h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600"
                                onClick={() => handleDelete(subcategory)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo para crear/editar categoría */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? "Editar Categoría"
                : formData.parentId
                ? "Nueva Subcategoría"
                : "Nueva Categoría"}
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              {!formData.parentId && !editingCategory?.parentId && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="parentId" className="text-right">
                    Categoría Padre
                  </Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, parentId: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ninguna (Categoría principal)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        Ninguna (Categoría principal)
                      </SelectItem>
                      {categories
                        .filter((cat) => !cat.parentId) // Solo mostrar categorías principales
                        .map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
