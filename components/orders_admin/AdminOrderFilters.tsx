"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RefreshCw, Filter, Search } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";

interface OrderFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  date: { startDate: string; endDate: string };
  setDate: (value: { startDate: string; endDate: string }) => void;
  filters: { minTotal: string; maxTotal: string; paymentMethod: string };
  setFilters: (value: {
    minTotal: string;
    maxTotal: string;
    paymentMethod: string;
  }) => void;

  resetFilters: () => void;
}

export default function OrderFilters({
  searchTerm,
  setSearchTerm,
  date,
  setDate,
  filters,
  setFilters,
  resetFilters,
}: OrderFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      {/* Header: búsqueda y botones */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pedidos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2">
            <TooltipInfoButton content="Busca pedidos por nombre de cliente, número de orden u otros datos relevantes." />
          </div>
        </div>

        {/* Fechas y botones */}
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <TooltipInfoButton content="Usa estos campos para filtrar los pedidos por un rango de fechas." />
            {/* Fecha de inicio */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[160px] justify-start text-left font-normal",
                    !date.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date.startDate
                    ? format(parseISO(date.startDate), "d 'de' MMMM", {
                        locale: es,
                      })
                    : "Inicio"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    date.startDate ? parseISO(date.startDate) : undefined
                  }
                  onSelect={(selectedDate) =>
                    setDate({
                      ...date,
                      startDate:
                        selectedDate?.toISOString().split("T")[0] ?? "",
                    })
                  }
                  disabled={(d) => d > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Separador */}
            <span className="hidden md:inline">-</span>

            {/* Fecha de fin */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[160px] justify-start text-left font-normal",
                    !date.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date.endDate
                    ? format(parseISO(date.endDate), "d 'de' MMMM", {
                        locale: es,
                      })
                    : "Fin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date.endDate ? parseISO(date.endDate) : undefined}
                  onSelect={(selectedDate) =>
                    setDate({
                      ...date,
                      endDate: selectedDate?.toISOString().split("T")[0] ?? "",
                    })
                  }
                  disabled={(d) => d > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetFilters}
            title="Restablecer filtros"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {/* Se comentan los filtros porque no se usan por el momento */}
          {/* <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" /> Filtros
          </Button> */}
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros avanzados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Precio */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Rango de precio
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Mínimo"
                    value={filters.minTotal}
                    onChange={(e) =>
                      setFilters({ ...filters, minTotal: e.target.value })
                    }
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Máximo"
                    value={filters.maxTotal}
                    onChange={(e) =>
                      setFilters({ ...filters, maxTotal: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Método de pago */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Método de pago
                </label>
                <Select
                  value={filters.paymentMethod}
                  onValueChange={(value) =>
                    setFilters({ ...filters, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="CREDIT_CARD">
                      Tarjeta de crédito
                    </SelectItem>
                    <SelectItem value="DEBIT_CARD">
                      Tarjeta de débito
                    </SelectItem>
                    <SelectItem value="BANK_TRANSFER">
                      Transferencia bancaria
                    </SelectItem>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botón limpiar */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetFilters}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
