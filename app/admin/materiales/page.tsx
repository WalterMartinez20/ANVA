"use client";

import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import HelpSection from "@/components/help/HelpSection";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import MaterialToolbar from "@/components/materials/MaterialToolbar";
import MaterialDialog from "@/components/materials/MaterialDialog";
import MaterialTable from "@/components/materials/MaterialTable";

import type {
  Material,
  FormData,
  MaterialWithProps,
  GroupedMaterials,
  Category,
} from "@/types/material";

export default function AdminMateriales() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMaterial, setEditingMaterial] =
    useState<MaterialWithProps | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    stock: 0,
    unit: "",
    categoriaId: null,
    propiedades: [],
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch("/api/admin/materials");
        if (!res.ok) throw new Error("Error al obtener materiales");
        const data = await res.json();
        setMaterials(data.materials || []);
      } catch (err) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los materiales.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("/api/admin/materials/material-category");
        if (!res.ok) throw new Error("Error al obtener categorías");
        const data = await res.json();
        setCategorias(data.categories || []);
      } catch (err) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías.",
          variant: "destructive",
        });
      }
    };

    fetchCategorias();
  }, []);

  const groupedMaterials: GroupedMaterials = materials.reduce(
    (acc: GroupedMaterials, mat) => {
      const categoryId = mat.categoriaId ?? -1;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryName: mat.categoria?.nombre || "Sin categoría",
          materials: [],
        };
      }
      acc[categoryId].materials.push(mat);
      return acc;
    },
    {}
  );

  const toggleGroup = (categoryId: number) => {
    setExpandedGroups((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCreate = () => {
    setEditingMaterial(null);
    setFormData({
      name: "",
      description: "",
      stock: 0,
      unit: "",
      categoriaId: null,
      propiedades: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = async (material: Material) => {
    try {
      const res = await fetch(`/api/admin/materials/${material.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");

      setEditingMaterial(data.material);
      setFormData({
        name: data.material.name,
        description: data.material.description || "",
        stock: data.material.stock,
        unit: data.material.unit || "",
        categoriaId: data.material.categoriaId,
        propiedades: data.material.propiedades.map(
          (p: { propiedadId: number; valor: string }) => ({
            propiedadId: p.propiedadId,
            valor: p.valor,
          })
        ),
      });
      setIsDialogOpen(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo cargar el material",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este material?")) return;
    try {
      const res = await fetch(`/api/admin/materials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");

      setMaterials((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Material eliminado" });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el material",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const isEdit = !!editingMaterial;
      const url = isEdit
        ? `/api/admin/materials/${editingMaterial!.id}`
        : "/api/admin/materials";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Error al guardar");

      toast({
        title: isEdit ? "Material actualizado" : "Material creado",
        variant: "default",
      });

      // Actualizar la lista
      const updatedMaterial = result.material;

      setMaterials((prev) => {
        if (isEdit) {
          return prev.map((mat) =>
            mat.id === updatedMaterial.id ? updatedMaterial : mat
          );
        } else {
          return [...prev, updatedMaterial];
        }
      });

      setIsDialogOpen(false);
      setEditingMaterial(null);
      setFormData({
        name: "",
        description: "",
        stock: 0,
        unit: "",
        categoriaId: null,
        propiedades: [],
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGroupedMaterials = Object.entries(groupedMaterials).reduce(
    (acc: GroupedMaterials, [catId, { categoryName, materials }]) => {
      const filtered = (materials as Material[]).filter((mat) => {
        const matchesSearch =
          mat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mat.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategoryId === null || mat.categoriaId === selectedCategoryId;
        return matchesSearch && matchesCategory;
      });
      if (filtered.length > 0) {
        acc[parseInt(catId)] = {
          categoryName,
          materials: filtered,
        };
      }
      return acc;
    },
    {}
  );

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
      <MaterialToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        propertyFilterKey=""
        setPropertyFilterKey={() => {}}
        propertyFilterValue=""
        setPropertyFilterValue={() => {}}
        onCreate={handleCreate}
      />
      {Object.entries(filteredGroupedMaterials).map(
        ([catId, { categoryName, materials }]) => (
          <div key={catId} className="border rounded-md">
            <Button
              variant="ghost"
              onClick={() => toggleGroup(Number(catId))}
              className="w-full justify-between px-4 py-2 text-left font-semibold text-lg"
            >
              {categoryName}
              {expandedGroups.includes(Number(catId)) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
            {expandedGroups.includes(Number(catId)) && (
              <MaterialTable
                materials={materials}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSort={() => {}}
                sortConfig={null}
              />
            )}
          </div>
        )
      )}{" "}
      {categorias && (
        <MaterialDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          categorias={categorias}
          isEditing={!!editingMaterial}
        />
      )}
    </div>
  );
}
