// * Este componente muestra el contenido completo del Dialog que aparece al hacer clic en "Ver" un pedido

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Loader2, ShoppingBag, CreditCard, Truck, History } from "lucide-react";

import { formatDate, formatPhoneNumber } from "@/lib/utils";
import OrderProgress from "@/components/orders/OrderProgress";
import StatusBadge from "./StatusBadge";
import type { Order } from "@/types/order";
import { getPaymentLabel } from "@/lib/utils";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelOrder: (orderId: number) => void;
  isCancelling: boolean;
}

export default function OrderDialog({
  order,
  isOpen,
  onClose,
  onCancelOrder,
  isCancelling,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black mb-4">
            Detalles del Pedido #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          <OrderProgress
            status={order.status}
            estimatedDeliveryDate={order.estimatedDeliveryDate ?? undefined}
            shippingDate={order.shippingDate ?? undefined}
            deliveryDate={order.deliveryDate ?? undefined}
            address={order.address ?? undefined}
            currentStatus={order.status}
          />

          {/* Información del pedido */}
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
                  <p>
                    <strong>Estado:</strong>{" "}
                    <StatusBadge status={order.status} context="order" />
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.total.toFixed(2)}
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
                    {order.phone
                      ? formatPhoneNumber(order.phone)
                      : "No especificado"}
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
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          ${(item.price * item.quantity).toFixed(2)}
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
                      {order.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {getPaymentLabel?.(payment.method) ??
                              payment.method}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={payment.status} />
                          </TableCell>
                          <TableCell>{payment.reference || "-"}</TableCell>
                          <TableCell className="text-right">
                            ${payment.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historial */}
          {/* {order.statusHistory?.length > 0 && (
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

          {/* Footer */}
          <DialogFooter className="flex justify-between">
            {/* {(order.status === "PENDING" || order.status === "PROCESSING") && (
              <Button
                variant="destructive"
                onClick={() => onCancelOrder(order.id)}
                disabled={isCancelling}
                className="mr-auto"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  "Cancelar Pedido"
                )}
              </Button>
            )} */}
            <Button onClick={onClose}>Cerrar</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
