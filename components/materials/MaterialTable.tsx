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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from "lucide-react";

import type { Material } from "@/types/material";

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

interface MaterialTableProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: number) => void;
  onSort: (key: keyof Material) => void;
  sortConfig: SortConfig | null;
}

export default function MaterialTable({
  materials,
  onEdit,
  onDelete,
  onSort,
  sortConfig,
}: MaterialTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1"
                onClick={() => onSort("name")}
              >
                Nombre
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1"
                onClick={() => onSort("stock")}
              >
                Stock
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="min-w-[250px]">Propiedades</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>{material.id}</TableCell>
              <TableCell>{material.name}</TableCell>
              <TableCell>{material.description}</TableCell>
              <TableCell>{material.stock}</TableCell>
              <TableCell>{material.unit}</TableCell>
              <TableCell>{material.categoria?.nombre}</TableCell>
              <TableCell className="flex flex-wrap gap-2 py-3">
                {material.propiedades?.length > 0 ? (
                  material.propiedades.map((p) => (
                    <TooltipProvider key={p.propiedadId}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center gap-1 rounded-md bg-primary text-white px-3 py-1.5 text-xs font-medium shadow hover:bg-primary/90 transition-colors duration-200 cursor-help">
                            {p.propiedad.nombre}: {p.valor}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span className="text-sm text-muted-foreground max-w-xs block">
                            Propiedad definida para este material. Puedes
                            editarla desde el formulario.
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Sin propiedades
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(material)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(material.id)}>
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
