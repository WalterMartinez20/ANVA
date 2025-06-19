import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Category {
  id: number;
  nombre: string;
}

interface MaterialToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  propertyFilterKey: string;
  setPropertyFilterKey: (val: string) => void;
  propertyFilterValue: string;
  setPropertyFilterValue: (val: string) => void;
  onCreate: () => void;
}

export default function MaterialToolbar({
  searchTerm,
  setSearchTerm,
  selectedCategoryId,
  setSelectedCategoryId,
  propertyFilterKey,
  setPropertyFilterKey,
  propertyFilterValue,
  setPropertyFilterValue,
  onCreate,
}: MaterialToolbarProps) {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [availableProperties, setAvailableProperties] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/materials/material-category")
      .then((res) => res.json())
      .then((data) => setCategorias(data.categories || []))
      .catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    fetch("/api/admin/materials/material-property")
      .then((res) => res.json())
      .then((data) => {
        const props: string[] = Array.from(
          new Set(data.propiedades?.map((p: { nombre: string }) => p.nombre))
        );
        setAvailableProperties(props);
      })
      .catch(() => setAvailableProperties([]));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Gestión de Materiales</h1>
          <TooltipInfoButton content="Administra los materiales disponibles para fabricar productos." />
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2" onClick={onCreate}>
            <Plus className="h-4 w-4" />
            Nuevo Material
          </Button>
          <TooltipInfoButton content="Haz clic para añadir un nuevo material a tu inventario." />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {/* Buscador */}
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

        {/* Filtro por categoría */}
        <div className="w-full max-w-xs">
          <Select
            value={
              selectedCategoryId !== null
                ? selectedCategoryId.toString()
                : "all"
            }
            onValueChange={(value) =>
              setSelectedCategoryId(value === "all" ? null : parseInt(value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por nombre de propiedad */}
        {/* <div className="w-full max-w-xs">
          <Select
            value={propertyFilterKey}
            onValueChange={setPropertyFilterKey}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por propiedad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Todas</SelectItem>
              {availableProperties.map((prop) => (
                <SelectItem key={prop} value={prop}>
                  {prop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        {/* Filtro por valor de propiedad */}
        {/* <div className="w-full max-w-xs">
          <Input
            placeholder="Valor de propiedad (ej: Rojo)"
            value={propertyFilterValue}
            onChange={(e) => setPropertyFilterValue(e.target.value)}
          />
        </div> */}
      </div>
    </div>
  );
}
