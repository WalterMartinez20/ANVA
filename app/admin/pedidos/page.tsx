"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileSpreadsheet } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formatPrice, getPaymentLabel } from "@/lib/utils";

import type { Order } from "@/types/order";
import type { User } from "@/types/user";

import AdminOrderTable from "@/components/orders_admin/AdminOrderTable";
import AdminOrderDialog from "@/components/orders_admin/AdminOrderDialog";
import OrderFilters from "@/components/orders_admin/AdminOrderFilters";

import { useOrders } from "@/hooks/orders_admin/useOrders";
import { useOrderFilters } from "@/hooks/orders_admin/useOrderFilters";

import HelpSection from "@/components/help/HelpSection";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";

// Este tipo amplía Order con la propiedad `user`, que viene del backend y se usa en la UI
type OrderWithUser = Order & { user: User };

import * as XLSX from "xlsx";

export default function AdminPedidosPage() {
  const { orders, setOrders, isLoading } = useOrders();
  const {
    filtered,
    searchTerm,
    setSearchTerm,
    tab,
    setTab,
    date,
    setDate,
    filters,
    setFilters,
    requestSort,
    resetFilters,
  } = useOrderFilters(orders);

  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Ordenar pedidos
  const handleViewOrder = (order: OrderWithUser) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const exportToExcel = () => {
    // Preparar datos para exportar
    const dataToExport = filtered.map((order) => ({
      ID: order.id,
      Cliente: `${order.user.nombres} ${order.user.apellidos}`,
      Email: order.user.email,
      Fecha: new Date(order.createdAt).toLocaleDateString(),
      Estado: order.status,
      Total: formatPrice(order.total),
      Productos: order.items.length,
      Dirección: order.address || "No especificada",
      Teléfono: order.phone || "No especificado",
      "Método de Pago":
        order.payments.length > 0
          ? getPaymentLabel(order.payments[0].method)
          : "No especificado",
      "Número de Seguimiento": order.trackingNumber || "No especificado",
      Transportista: order.carrier || "No especificado",
    }));

    // Crear libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");

    // Guardar archivo
    XLSX.writeFile(
      workbook,
      `pedidos_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    toast({
      title: "Exportación completada",
      description: `Se han exportado ${dataToExport.length} pedidos a Excel`,
    });
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
      {/* Sección de ayuda contextual (abre el video en otra pestaña) */}
      <HelpSection videoUrl="/help-videos/pedidos.mp4" />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
          <TooltipInfoButton content="Desde aquí puedes filtrar, revisar, editar o exportar los pedidos de tu tienda." />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportToExcel}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <TooltipInfoButton content="Exporta los pedidos filtrados a un archivo Excel." />
        </div>
      </div>

      {/* Filtros generales */}
      <OrderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        date={date}
        setDate={setDate}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />

      <Tabs
        defaultValue="all"
        value={tab}
        onValueChange={setTab}
        className="w-full mb-6"
      >
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="processing">En Proceso</TabsTrigger>
          <TabsTrigger value="shipped">Enviados</TabsTrigger>
          <TabsTrigger value="delivered">Entregados</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tabla de pedidos */}
      <div className="rounded-md border">
        <AdminOrderTable
          orders={filtered}
          onViewOrder={handleViewOrder}
          requestSort={requestSort}
        />
      </div>

      {/* Diálogo de detalles del pedido */}
      <AdminOrderDialog
        order={selectedOrder}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(updatedOrder) => {
          console.log("Pedido actualizado:", updatedOrder.payments);
          setOrders((prev) => {
            const updated = prev.map((o) =>
              o.id === updatedOrder.id ? structuredClone(updatedOrder) : o
            );
            return [...updated];
          });

          setSelectedOrder(updatedOrder);
          setFilters((prev) => ({ ...prev }));
        }}
      />
    </div>
  );
}
