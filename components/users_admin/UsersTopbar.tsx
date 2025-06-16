// * Título, encabezado de la sección, búsqueda, orden y botón de "New User"

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";
import SortSelector from "@/components/sort-selector";
import React from "react";

interface UsersTopbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onOpenCreate: () => void;
}

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Name A-Z", value: "nombre_asc" },
  { label: "Name Z-A", value: "nombre_desc" },
  { label: "Email A-Z", value: "email_asc" },
  { label: "Email Z-A", value: "email_desc" },
  { label: "Newest", value: "fecha_desc" },
  { label: "Oldest", value: "fecha_asc" },
];

export default function UsersTopbar({
  searchTerm,
  onSearchChange,
  onSortChange,
  onOpenCreate,
}: UsersTopbarProps) {
  return (
    <>
      {/* Título y tooltip */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <TooltipInfoButton content="Administra los usuarios registrados en la plataforma." />
        </div>
      </div>

      {/* Filtros y creación */}
      <div className="flex justify-between items-center mb-6">
        {/* Input de búsqueda */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2">
            <TooltipInfoButton content="Puedes buscar por nombre o correo electrónico." />
          </div>
        </div>

        {/* Orden y botón crear */}
        <div className="flex items-center gap-2">
          <SortSelector
            options={sortOptions}
            defaultValue="default"
            onChange={onSortChange}
          />
          <Button className="flex items-center gap-2" onClick={onOpenCreate}>
            <UserPlus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>
    </>
  );
}
