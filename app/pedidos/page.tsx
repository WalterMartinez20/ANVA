"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingBag } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import OrderTable from "@/components/orders/OrderTable";
import OrderDetailsDialog from "@/components/orders/OrderDialog";
import type { Order } from "@/types/order"; // ✅ Si necesitás acceder a Product (usado dentro de OrderItem), ese ya está definido en producto_admin.ts, y está referenciado internamente en pedido.ts. No necesitás importar Product directamente.

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { user, isGuest } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (isGuest) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Error al cargar pedidos");

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar tus pedidos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isGuest]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("¿Estás seguro de que deseas cancelar este pedido?")) return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al cancelar pedido");
      }

      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: "CANCELLED" } : order
      );
      setOrders(updatedOrders);

      toast({
        title: "Pedido cancelado",
        description: "El pedido ha sido cancelado correctamente",
      });

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: "CANCELLED" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al cancelar pedido",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const filterOrdersByTab = (orders: Order[], tab: string) => {
    switch (tab) {
      case "pending":
        return orders.filter((o) => o.status === "PENDING");
      case "processing":
        return orders.filter((o) => o.status === "PROCESSING");
      case "shipped":
        return orders.filter((o) => o.status === "SHIPPED");
      case "delivered":
        return orders.filter((o) => o.status === "DELIVERED");
      case "cancelled":
        return orders.filter((o) => o.status === "CANCELLED");
      case "all":
      default:
        return orders;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="border rounded-md p-4 bg-white shadow-sm animate-pulse space-y-3"
            >
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex justify-end pt-2">
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mensaje de "inicia sesion para ver tus pedidos"
  if (isGuest) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>
        <div className="max-w-md mx-auto p-8 border rounded-lg">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">
            Inicia sesión para ver tus pedidos
          </h2>
          <p className="text-muted-foreground mb-6">
            Necesitas iniciar sesión para ver el historial de tus pedidos
          </p>
          <Button asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No tienes pedidos</h2>
          <p className="text-muted-foreground mb-6">
            Realiza tu primera compra para ver tus pedidos aquí
          </p>
          <Button asChild>
            <Link href="/">Explorar Productos</Link>
          </Button>
        </div>
      ) : (
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="processing">En proceso</TabsTrigger>
            <TabsTrigger value="shipped">Enviados</TabsTrigger>
            <TabsTrigger value="delivered">Entregados</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
          </TabsList>

          {[
            "all",
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue}>
              <OrderTable
                orders={filterOrdersByTab(orders, tabValue)}
                onView={handleViewOrder}
                onCancel={handleCancelOrder}
                isCancelling={isCancelling}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCancelOrder={handleCancelOrder}
        isCancelling={isCancelling}
      />
    </div>
  );
}
