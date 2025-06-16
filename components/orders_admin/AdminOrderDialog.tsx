"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { formatDate, formatPrice, getPaymentLabel } from "@/lib/utils";
import { useState, useEffect } from "react";
import OrderProgress from "@/components/orders/OrderProgress";
import StatusBadge from "@/components/orders/StatusBadge";
import {
  Loader2,
  ShoppingBag,
  CreditCard,
  Truck,
  History,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import type { OrderWithUser } from "@/types/order";
import { printOrderDetails } from "@/lib/dashboard/printOrderDetails";

interface Props {
  isOpen: boolean;
  order: OrderWithUser | null;
  onClose: () => void;
  onSave: (updated: OrderWithUser) => void;
}

export default function AdminOrderDialog({
  isOpen,
  order,
  onClose,
  onSave,
}: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(order?.status || "");
  const [statusNote, setStatusNote] = useState("");
  const [tracking, setTracking] = useState({
    trackingNumber: order?.trackingNumber || "",
    carrier: order?.carrier || "",
    estimatedDeliveryDate: order?.estimatedDeliveryDate
      ? new Date(order.estimatedDeliveryDate).toISOString().split("T")[0]
      : "",
  });
  const [paymentUpdates, setPaymentUpdates] = useState<Record<number, string>>(
    {}
  );

  // Sincronizar el estado interno con el prop `order` cuando cambia
  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
      setTracking({
        trackingNumber: order.trackingNumber || "",
        carrier: order.carrier || "",
        estimatedDeliveryDate: order.estimatedDeliveryDate
          ? new Date(order.estimatedDeliveryDate).toISOString().split("T")[0]
          : "",
      });
      setStatusNote(""); // Limpiar nota al cargar un nuevo pedido
    }
    if (order && order.payments) {
      setPaymentUpdates(
        Object.fromEntries(order.payments.map((p) => [p.id, p.status]))
      );
    }
  }, [order]); // Dependencia del efecto en 'order'

  if (!order) return null;

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          statusNote,
          trackingNumber: tracking.trackingNumber,
          carrier: tracking.carrier,
          estimatedDeliveryDate: tracking.estimatedDeliveryDate
            ? new Date(tracking.estimatedDeliveryDate).toISOString()
            : null,
          paymentUpdates,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al actualizar");
      }

      const updated = await response.json();
      toast({
        title: "Actualizado",
        description: `Pedido #${order.id} actualizado`,
      });

      onSave(updated.order);
      onClose();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Aumentar max-w para acomodar las dos columnas cómodamente */}
      <DialogContent
        className="max-w-5xl max-h-[90vh] overflow-y-auto p-6"
        aria-describedby="ventana de pedidos admin"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black mb-4">
            Detalles del Pedido #{order.id} - {order.user.nombres}{" "}
            {order.user.apellidos}
          </DialogTitle>
        </DialogHeader>

        <OrderProgress
          status={order.status}
          estimatedDeliveryDate={order.estimatedDeliveryDate ?? undefined}
          shippingDate={order.shippingDate ?? undefined}
          deliveryDate={order.deliveryDate ?? undefined}
          address={order.address ?? undefined}
          currentStatus={order.status}
        />

        {/* Contenedor principal con grid de 2 columnas para las tablas/cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Columna Izquierda: Información del Pedido y Actualizar Pedido */}
          <div className="space-y-4">
            {/* Información del Pedido */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3 text-gray-800">
                  <ShoppingBag className="h-5 w-5 text-gray-700" />
                  <h3 className="text-base font-semibold">
                    Información del Pedido
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p>
                      <strong>Fecha:</strong> {formatDate(order.createdAt)}
                    </p>
                    <div className="flex items-center gap-2">
                      <strong>Estado:</strong>{" "}
                      <StatusBadge status={order.status} context="order" />
                    </div>
                    <p>
                      <strong>Total:</strong> {formatPrice(order.total)}
                    </p>
                    <p>
                      <strong>Email Usuario:</strong> {order.user.email}
                    </p>
                  </div>
                  <div>
                    {order.trackingNumber && (
                      <p>
                        <strong>Seguimiento:</strong> {order.trackingNumber}
                      </p>
                    )}
                    {order.carrier && (
                      <p>
                        <strong>Transportista:</strong> {order.carrier}
                      </p>
                    )}
                    <p>
                      <strong>Dirección:</strong>{" "}
                      {order.address || "No especificada"}
                    </p>
                    <p>
                      <strong>Teléfono:</strong>{" "}
                      {order.phone || "No especificado"}
                    </p>
                    {order.notes && (
                      <p>
                        <strong>Notas:</strong> {order.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección de Actualizar Estado y Tracking */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5 space-y-4 text-sm text-gray-800">
                <h3 className="font-semibold text-base">Actualizar Pedido</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estado</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="min-w-[180px]">
                        <SelectValue
                          placeholder="Estado de Envio"
                          className="whitespace-nowrap truncate text-left"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">
                          <Clock className="w-4 h-4 mr-2 inline" /> Pendiente
                        </SelectItem>
                        <SelectItem value="PROCESSING">
                          <Package className="w-4 h-4 mr-2 inline" /> En proceso
                        </SelectItem>
                        <SelectItem value="SHIPPED">
                          <Truck className="w-4 h-4 mr-2 inline" /> Enviado
                        </SelectItem>
                        <SelectItem value="DELIVERED">
                          <CheckCircle className="w-4 h-4 mr-2 inline" />{" "}
                          Entregado
                        </SelectItem>
                        <SelectItem value="CANCELLED">
                          <XCircle className="w-4 h-4 mr-2 inline" /> Cancelado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Fecha Estimada de Entrega
                    </label>
                    <Input
                      type="date"
                      value={tracking.estimatedDeliveryDate}
                      onChange={(e) =>
                        setTracking({
                          ...tracking,
                          estimatedDeliveryDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Transportista</label>
                    <Input
                      value={tracking.carrier}
                      onChange={(e) =>
                        setTracking({ ...tracking, carrier: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      N° de Seguimiento
                    </label>
                    <Input
                      value={tracking.trackingNumber}
                      onChange={(e) =>
                        setTracking({
                          ...tracking,
                          trackingNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block">
                    Nota de estado
                  </label>
                  <Input
                    placeholder="Ej: Se envió por correo prioritario"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Productos, Pagos e Historial */}
          <div className="space-y-4">
            {/* Productos */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 text-gray-800 mb-4">
                  <Truck className="h-5 w-5 text-gray-700" />
                  <h3 className="text-base font-semibold">Productos</h3>
                </div>
                <div className="overflow-x-auto">
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
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <img
                                src={
                                  item.product.images?.find((img) => img.isMain)
                                    ?.url ||
                                  item.product.images?.[0]?.url ||
                                  "/placeholder.svg"
                                }
                                alt={item.product.name}
                                className="w-12 h-12 rounded-md object-cover border"
                              />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.product.name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatPrice(item.price)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatPrice(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Pagos */}
            {order.payments.length > 0 && (
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 text-gray-800 mb-4">
                    <CreditCard className="h-5 w-5 text-gray-700" />
                    <h3 className="text-base font-semibold">Pagos</h3>
                  </div>
                  <div className="overflow-x-auto">
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
                        {order.payments.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>
                              {getPaymentLabel?.(p.method) ?? p.method}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={paymentUpdates[p.id]}
                                onValueChange={(value) =>
                                  setPaymentUpdates((prev) => ({
                                    ...prev,
                                    [p.id]: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="min-w-[180px]">
                                  <SelectValue
                                    placeholder="Estado de pago"
                                    className="whitespace-nowrap truncate text-left"
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDING">
                                    <Clock className="w-4 h-4 mr-2 inline" />{" "}
                                    Pendiente
                                  </SelectItem>
                                  <SelectItem value="ON_HOLD">
                                    <ShieldCheck className="w-4 h-4 mr-2 inline" />{" "}
                                    En revisión
                                  </SelectItem>
                                  <SelectItem value="COMPLETED">
                                    <CheckCircle className="w-4 h-4 mr-2 inline" />{" "}
                                    Completado
                                  </SelectItem>
                                  <SelectItem value="CANCELLED">
                                    <XCircle className="w-4 h-4 mr-2 inline" />{" "}
                                    Cancelado
                                  </SelectItem>
                                  <SelectItem value="REFUNDED">
                                    <Loader2 className="w-4 h-4 mr-2 inline" />{" "}
                                    Reembolsado
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{p.reference || "-"}</TableCell>
                            <TableCell className="text-right">
                              {formatPrice(p.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Historial de Estados (comentada porque no se usa por el momento)*/}
            {/* {order.statusHistory && order.statusHistory.length > 0 && (
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 text-gray-800 mb-4">
                    <History className="h-5 w-5 text-gray-700" />
                    <h3 className="text-base font-semibold">
                      Historial de Estados
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Notas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.statusHistory.map((h) => (
                          <TableRow key={h.id}>
                            <TableCell>{formatDate(h.createdAt)}</TableCell>
                            <TableCell>
                              <StatusBadge status={h.status} />
                            </TableCell>
                            <TableCell>{h.notes || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="min-w-[150px] order-2 md:order-1"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => printOrderDetails(order)}
            disabled={!order}
            className="order-3 md:order-2"
          >
            Imprimir
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="order-1 md:order-3"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
