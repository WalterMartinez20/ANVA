"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownAZ, ArrowUpAZ, ArrowDownUp, Clock } from "lucide-react";

export default function SortSelector({
  onSortChange,
}: {
  onSortChange?: (sortId: string) => void;
}) {
  const [selectedSort, setSelectedSort] = useState<string>("name_asc");

  const sortOptions = [
    { id: "name_asc", label: "Nombre: A-Z", icon: ArrowDownAZ },
    { id: "name_desc", label: "Nombre: Z-A", icon: ArrowUpAZ },
    { id: "price_asc", label: "Precio: Menor a Mayor", icon: ArrowDownUp },
    { id: "price_desc", label: "Precio: Mayor a Menor", icon: ArrowDownUp },
    { id: "newest", label: "Más recientes", icon: Clock },
  ];

  const selectedOption = sortOptions.find(
    (option) => option.id === selectedSort
  );

  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    onSortChange?.(sortId); // notifica al componente padre si lo desea
    // Aquí se implementaría la lógica para ordenar los productos
    // Por ejemplo, emitir un evento o actualizar un estado global
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span>Ordenar por:</span>
          <span className="font-medium">{selectedOption?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleSortChange(option.id)}
          >
            <option.icon className="h-4 w-4" />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
