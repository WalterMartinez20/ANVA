"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import {
  Loader2,
  Package,
  ShoppingBag,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  TruckIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: {
      id: number;
      url: string;
      isMain: boolean;
    }[];
  };
}

interface Payment {
  id: number;
  amount: number;
  method: string;
  status: string;
  reference: string | null;
  createdAt: string;
}

interface Order {
  id: number;
  status: string;
  total: number;
  address: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: Payment[];
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isGuest } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      if (isGuest || !user) {
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
  }, [user, isGuest, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-amber-500 border-amber-200 bg-amber-50"
          >
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-blue-500 border-blue-200 bg-blue-50"
          >
            <Package className="h-3 w-3" />
            En proceso
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-indigo-500 border-indigo-200 bg-indigo-50"
          >
            <TruckIcon className="h-3 w-3" />
            Enviado
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-green-500 border-green-200 bg-green-50"
          >
            <CheckCircle className="h-3 w-3" />
            Entregado
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-red-500 border-red-200 bg-red-50"
          >
            <XCircle className="h-3 w-3" />
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            {status}
          </Badge>
        );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-amber-500 border-amber-200 bg-amber-50"
          >
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-green-500 border-green-200 bg-green-50"
          >
            <CheckCircle className="h-3 w-3" />
            Completado
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-red-500 border-red-200 bg-red-50"
          >
            <XCircle className="h-3 w-3" />
            Fallido
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-blue-500 border-blue-200 bg-blue-50"
          >
            <TruckIcon className="h-3 w-3" />
            Reembolsado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "CREDIT_CARD":
        return "Tarjeta de Crédito";
      case "DEBIT_CARD":
        return "Tarjeta de Débito";
      case "BANK_TRANSFER":
        return "Transferencia Bancaria";
      case "CASH":
        return "Efectivo";
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || isGuest) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">
            Inicia sesión para ver tus pedidos
          </h1>
          <p className="text-gray-500 mb-6">
            Necesitas iniciar sesión para ver el historial de tus pedidos
          </p>
          <Button asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">No tienes pedidos</h1>
          <p className="text-gray-500 mb-6">
            Aún no has realizado ningún pedido. Explora nuestra tienda y
            encuentra productos que te encanten.
          </p>
          <Button asChild>
            <Link href="/productos">Ver Productos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="processing">En proceso</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Pedido #{order.id}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Realizado el {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} productos
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/pedidos/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Productos</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const mainImage =
                          item.product.images && item.product.images.length > 0
                            ? item.product.images.find((img) => img.isMain)
                                ?.url || item.product.images[0].url
                            : "/placeholder.svg?height=80&width=80";

                        return (
                          <div key={item.id} className="flex gap-3">
                            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={mainImage || "/placeholder.svg"}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-sm line-clamp-1">
                                {item.product.name}
                              </h5>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-500">
                                  Cantidad: {item.quantity}
                                </span>
                                <span className="font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Información de Pago</h4>
                    <div className="space-y-3">
                      {order.payments.map((payment) => (
                        <div key={payment.id} className="border rounded-md p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {getPaymentMethodName(payment.method)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {payment.reference
                                  ? `Ref: ${payment.reference}`
                                  : "Sin referencia"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${payment.amount.toFixed(2)}
                              </p>
                              <div className="mt-1">
                                {getPaymentStatusBadge(payment.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.address && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Dirección de Envío</h4>
                        <p className="text-sm">{order.address}</p>
                        {order.phone && (
                          <p className="text-sm mt-1">
                            Teléfono: {order.phone}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {orders
            .filter((order) => order.status === "PENDING")
            .map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                {/* Contenido similar al de "all" pero filtrado */}
                <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Pedido #{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Realizado el {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} productos
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/pedidos/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          {orders.filter((order) => order.status === "PENDING").length ===
            0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tienes pedidos pendientes</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          {orders
            .filter(
              (order) =>
                order.status === "PROCESSING" || order.status === "SHIPPED"
            )
            .map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                {/* Contenido similar al de "all" pero filtrado */}
                <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Pedido #{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Realizado el {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} productos
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/pedidos/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          {orders.filter(
            (order) =>
              order.status === "PROCESSING" || order.status === "SHIPPED"
          ).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tienes pedidos en proceso</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {orders
            .filter((order) => order.status === "DELIVERED")
            .map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                {/* Contenido similar al de "all" pero filtrado */}
                <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Pedido #{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Realizado el {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} productos
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/pedidos/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          {orders.filter((order) => order.status === "DELIVERED").length ===
            0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tienes pedidos completados</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
