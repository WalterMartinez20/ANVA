"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Eye,
  Loader2,
  ArrowUpDown,
  Calendar,
  Truck,
  FileSpreadsheet,
  Filter,
  Printer,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formatDate, formatPrice } from "@/lib/utils";
import OrderTracking from "@/components/orders/OrderProgress";
// import * as XLSX from "xlsx";

interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: ProductImage[];
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

interface Payment {
  id: number;
  amount: number;
  method: string;
  status: string;
  reference: string | null;
  createdAt: string;
}

interface User {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
}

interface StatusHistory {
  id: number;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  address: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: Payment[];
  user: User;
  trackingNumber: string | null;
  carrier: string | null;
  estimatedDeliveryDate: string | null;
  shippingDate: string | null;
  deliveryDate: string | null;
  statusHistory: StatusHistory[];
}

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: "",
    carrier: "",
    estimatedDeliveryDate: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [dateFilter, setDateFilter] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    minTotal: "",
    maxTotal: "",
    paymentMethod: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Error al cargar pedidos");

        const data = await response.json();
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los pedidos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Filtrar pedidos por término de búsqueda, pestaña activa y filtros avanzados
    let result = orders.filter(
      (order) =>
        order.id.toString().includes(searchTerm) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${order.user.nombres} ${order.user.apellidos}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.trackingNumber &&
          order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Filtrar por estado según la pestaña activa
    if (activeTab !== "all") {
      result = result.filter(
        (order) => order.status === activeTab.toUpperCase()
      );
    }

    // Filtrar por rango de fechas
    if (dateFilter.startDate) {
      const startDate = new Date(dateFilter.startDate);
      result = result.filter((order) => new Date(order.createdAt) >= startDate);
    }
    if (dateFilter.endDate) {
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999); // Establecer al final del día
      result = result.filter((order) => new Date(order.createdAt) <= endDate);
    }

    // Filtros avanzados
    if (advancedFilters.minTotal) {
      const minTotal = Number.parseFloat(advancedFilters.minTotal);
      result = result.filter((order) => order.total >= minTotal);
    }
    if (advancedFilters.maxTotal) {
      const maxTotal = Number.parseFloat(advancedFilters.maxTotal);
      result = result.filter((order) => order.total <= maxTotal);
    }
    if (advancedFilters.paymentMethod) {
      result = result.filter((order) =>
        order.payments.some(
          (payment) => payment.method === advancedFilters.paymentMethod
        )
      );
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, activeTab, dateFilter, advancedFilters]);

  // Ordenar pedidos
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig) return 0;

    const key = sortConfig.key as keyof Order;

    if (key === "user") {
      const nameA = `${a.user.nombres} ${a.user.apellidos}`.toLowerCase();
      const nameB = `${b.user.nombres} ${b.user.apellidos}`.toLowerCase();
      return sortConfig.direction === "ascending"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }

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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingInfo({
      trackingNumber: order.trackingNumber || "",
      carrier: order.carrier || "",
      estimatedDeliveryDate: order.estimatedDeliveryDate
        ? new Date(order.estimatedDeliveryDate).toISOString().split("T")[0]
        : "",
    });
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || newStatus === selectedOrder.status) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          statusNote: statusNote,
          trackingNumber: trackingInfo.trackingNumber,
          carrier: trackingInfo.carrier,
          estimatedDeliveryDate: trackingInfo.estimatedDeliveryDate
            ? new Date(trackingInfo.estimatedDeliveryDate).toISOString()
            : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al actualizar estado");
      }

      const data = await response.json();

      // Actualizar la lista de pedidos
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id ? data.order : order
        )
      );

      // Actualizar el pedido seleccionado
      setSelectedOrder(data.order);
      setStatusNote("");

      toast({
        title: "Estado actualizado",
        description: `El pedido #${
          selectedOrder.id
        } ha sido actualizado a ${getStatusText(newStatus)}`,
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al actualizar estado",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "PROCESSING":
        return "En proceso";
      case "SHIPPED":
        return "Enviado";
      case "DELIVERED":
        return "Entregado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            En proceso
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Enviado
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Entregado
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "CREDIT_CARD":
        return "Tarjeta de crédito";
      case "DEBIT_CARD":
        return "Tarjeta de débito";
      case "BANK_TRANSFER":
        return "Transferencia bancaria";
      case "CASH":
        return "Efectivo";
      default:
        return method;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completado
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Fallido
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Reembolsado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCurrentStatusText = (order: Order) => {
    switch (order.status) {
      case "PENDING":
        return "Pendiente de procesamiento";
      case "PROCESSING":
        return "En preparación";
      case "SHIPPED":
        return "En camino";
      case "DELIVERED":
        return "Entregado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return order.status;
    }
  };

  const exportToExcel = () => {
    // Preparar datos para exportar
    const dataToExport = filteredOrders.map((order) => ({
      ID: order.id,
      Cliente: `${order.user.nombres} ${order.user.apellidos}`,
      Email: order.user.email,
      Fecha: new Date(order.createdAt).toLocaleDateString(),
      Estado: getStatusText(order.status),
      Total: formatPrice(order.total),
      Productos: order.items.length,
      Dirección: order.address || "No especificada",
      Teléfono: order.phone || "No especificado",
      "Método de Pago":
        order.payments.length > 0
          ? getPaymentMethodText(order.payments[0].method)
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

  const printOrderDetails = () => {
    if (!selectedOrder) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const orderDate = new Date(selectedOrder.createdAt).toLocaleDateString();

    printWindow.document.write(`
      <html>
        <head>
          <title>Pedido #${selectedOrder.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { display: flex; justify-content: space-between; }
            .section { margin-top: 20px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Detalle de Pedido #${selectedOrder.id}</h1>
              <p>Fecha: ${orderDate}</p>
            </div>
            <div>
              <button onclick="window.print()">Imprimir</button>
            </div>
          </div>
          
          <div class="section">
            <h2>Información del Cliente</h2>
            <p>
              <strong>Nombre:</strong> ${selectedOrder.user.nombres} ${
      selectedOrder.user.apellidos
    }<br>
              <strong>Email:</strong> ${selectedOrder.user.email}<br>
              <strong>Teléfono:</strong> ${
                selectedOrder.phone || "No especificado"
              }<br>
              <strong>Dirección:</strong> ${
                selectedOrder.address || "No especificada"
              }
            </p>
          </div>
          
          <div class="section">
            <h2>Productos</h2>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${selectedOrder.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.product.name}</td>
                    <td>${formatPrice(item.price)}</td>
                    <td>${item.quantity}</td>
                    <td>${formatPrice(item.price * item.quantity)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                  <td><strong>${formatPrice(selectedOrder.total)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div class="section">
            <h2>Información de Envío</h2>
            <p>
              <strong>Estado:</strong> ${getStatusText(
                selectedOrder.status
              )}<br>
              <strong>Número de Seguimiento:</strong> ${
                selectedOrder.trackingNumber || "No especificado"
              }<br>
              <strong>Transportista:</strong> ${
                selectedOrder.carrier || "No especificado"
              }<br>
              <strong>Fecha Estimada de Entrega:</strong> ${
                selectedOrder.estimatedDeliveryDate
                  ? new Date(
                      selectedOrder.estimatedDeliveryDate
                    ).toLocaleDateString()
                  : "No especificada"
              }
            </p>
          </div>
          
          <div class="section">
            <h2>Pagos</h2>
            <table>
              <thead>
                <tr>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Referencia</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                ${selectedOrder.payments
                  .map(
                    (payment) => `
                  <tr>
                    <td>${getPaymentMethodText(payment.method)}</td>
                    <td>${payment.status}</td>
                    <td>${payment.reference || "-"}</td>
                    <td>${formatPrice(payment.amount)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p>Este documento es un comprobante de pedido. Para cualquier consulta, contacte con atención al cliente.</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setActiveTab("all");
    setDateFilter({ startDate: "", endDate: "" });
    setAdvancedFilters({
      minTotal: "",
      maxTotal: "",
      paymentMethod: "",
    });
    setIsAdvancedFilterOpen(false);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportToExcel}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pedidos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Input
              type="date"
              placeholder="Desde"
              className="w-full md:w-auto"
              value={dateFilter.startDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, startDate: e.target.value })
              }
            />
            <span className="hidden md:inline">-</span>
            <Input
              type="date"
              placeholder="Hasta"
              className="w-full md:w-auto"
              value={dateFilter.endDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, endDate: e.target.value })
              }
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetFilters}
            title="Restablecer filtros"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isAdvancedFilterOpen && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros avanzados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Rango de precio
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Mínimo"
                    value={advancedFilters.minTotal}
                    onChange={(e) =>
                      setAdvancedFilters({
                        ...advancedFilters,
                        minTotal: e.target.value,
                      })
                    }
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Máximo"
                    value={advancedFilters.maxTotal}
                    onChange={(e) =>
                      setAdvancedFilters({
                        ...advancedFilters,
                        maxTotal: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Método de pago
                </label>
                <Select
                  value={advancedFilters.paymentMethod}
                  onValueChange={(value) =>
                    setAdvancedFilters({
                      ...advancedFilters,
                      paymentMethod: value,
                    })
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

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("id")}
                >
                  ID
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("user")}
                >
                  Cliente
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("createdAt")}
                >
                  Fecha
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("status")}
                >
                  Estado
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("total")}
                >
                  Total
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Seguimiento</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron pedidos
                </TableCell>
              </TableRow>
            ) : (
              sortedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {/* {order.user.nombres} {order.user.apellidos} */}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {/* {order.user.email} */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "producto" : "productos"}
                  </TableCell>
                  <TableCell>
                    {order.trackingNumber ? (
                      <div className="text-sm">
                        <span className="font-medium">
                          {order.trackingNumber}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {order.carrier || "Sin transportista"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No disponible
                      </span>
                    )}
                  </TableCell>
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
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                          <span>Ver Detalles</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de detalles del pedido */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Detalles del Pedido #{selectedOrder?.id}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={printOrderDetails}
                >
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Imprimir</span>
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Componente de seguimiento */}
              <OrderTracking
                status={selectedOrder.status}
                estimatedDeliveryDate={selectedOrder.estimatedDeliveryDate}
                shippingDate={selectedOrder.shippingDate}
                deliveryDate={selectedOrder.deliveryDate}
                address={selectedOrder.address}
                currentStatus={getCurrentStatusText(selectedOrder)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Información del Pedido</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Fecha:</span>{" "}
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Estado:</span>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="h-7 w-40">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pendiente</SelectItem>
                          <SelectItem value="PROCESSING">En proceso</SelectItem>
                          <SelectItem value="SHIPPED">Enviado</SelectItem>
                          <SelectItem value="DELIVERED">Entregado</SelectItem>
                          <SelectItem value="CANCELLED">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </p>
                    <p>
                      <span className="font-medium">Total:</span> $
                      {selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Información del Cliente</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Nombre:</span>{" "}
                      {/* {selectedOrder.user.nombres}{" "} */}
                      {/* {selectedOrder.user.apellidos} */}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {/* {selectedOrder.user.email} */}
                    </p>
                    <p>
                      <span className="font-medium">Teléfono:</span>{" "}
                      {/* {selectedOrder.phone || "No especificado"} */}
                    </p>
                    <p>
                      <span className="font-medium">Dirección:</span>{" "}
                      {/* {selectedOrder.address || "No especificada"} */}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información de seguimiento */}
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Información de Envío
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Número de seguimiento
                    </label>
                    <Input
                      value={trackingInfo.trackingNumber}
                      onChange={(e) =>
                        setTrackingInfo({
                          ...trackingInfo,
                          trackingNumber: e.target.value,
                        })
                      }
                      placeholder="Ej: TRK123456789"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Transportista
                    </label>
                    <Input
                      value={trackingInfo.carrier}
                      onChange={(e) =>
                        setTrackingInfo({
                          ...trackingInfo,
                          carrier: e.target.value,
                        })
                      }
                      placeholder="Ej: DHL, FedEx"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Fecha estimada de entrega
                    </label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        type="date"
                        value={trackingInfo.estimatedDeliveryDate}
                        onChange={(e) =>
                          setTrackingInfo({
                            ...trackingInfo,
                            estimatedDeliveryDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas de actualización de estado */}
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-3">Notas de actualización</h3>
                <Input
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Añadir notas sobre la actualización de estado (opcional)"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Productos</h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {item.product.images &&
                                item.product.images.length > 0 ? (
                                  <img
                                    src={
                                      item.product.images.find(
                                        (img) => img.isMain
                                      )?.url ||
                                      item.product.images[0].url ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt={item.product.name}
                                    className="w-10 h-10 object-cover rounded-md"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                                )}
                                <span>{item.product.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-medium mb-2">Pagos</h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Método</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Referencia</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              {getPaymentMethodText(payment.method)}
                            </TableCell>
                            <TableCell>
                              {getPaymentStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell>{payment.reference || "-"}</TableCell>
                            <TableCell className="text-right">
                              ${payment.amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Historial de estados */}
              {selectedOrder.statusHistory &&
                selectedOrder.statusHistory.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Historial de Estados</h3>
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Fecha</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Notas</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedOrder.statusHistory.map((history) => (
                              <TableRow key={history.id}>
                                <TableCell>
                                  {formatDate(history.createdAt)}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(history.status)}
                                </TableCell>
                                <TableCell>{history.notes || "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}

              <DialogFooter>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={
                    isUpdating ||
                    (newStatus === selectedOrder.status &&
                      trackingInfo.trackingNumber ===
                        (selectedOrder.trackingNumber || "") &&
                      trackingInfo.carrier === (selectedOrder.carrier || "") &&
                      trackingInfo.estimatedDeliveryDate ===
                        (selectedOrder.estimatedDeliveryDate
                          ? new Date(selectedOrder.estimatedDeliveryDate)
                              .toISOString()
                              .split("T")[0]
                          : ""))
                  }
                  className="mr-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
