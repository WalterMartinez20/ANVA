// * Este componente se encargará exclusivamente de mostrar la tabla de pedidos. Recibirá los siguientes props:

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, XCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Order } from "@/types/pedido";
import OrderStatusBadge from "./StatusBadge";
import { Card, CardContent } from "@/components/ui/card";

interface OrderTableProps {
  orders: Order[];
  onView: (order: Order) => void;
  onCancel: (orderId: number) => void;
  isCancelling: boolean;
}

export default function OrderTable({
  orders,
  onView,
  onCancel,
  isCancelling,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-md">
        <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-base font-semibold text-gray-700 mb-1">
          No hay pedidos en esta categoría
        </h3>
        <p className="text-sm text-muted-foreground">
          Los pedidos que realices aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-600">Pedido #</TableHead>
              <TableHead className="text-gray-600">Fecha</TableHead>
              <TableHead className="text-gray-600">Estado</TableHead>
              <TableHead className="text-gray-600">Total</TableHead>
              <TableHead className="text-gray-600">Productos</TableHead>
              <TableHead className="text-right text-gray-600">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-gray-800">
                  {order.id}
                </TableCell>
                <TableCell className="text-gray-700">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-gray-800">
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-gray-700">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "producto" : "productos"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onView(order)}
                      aria-label={`Ver detalles del pedido #${order.id}`}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Ver</span>
                    </Button>
                    {(order.status === "PENDING" ||
                      order.status === "PROCESSING") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        onClick={() => onCancel(order.id)}
                        disabled={isCancelling}
                        aria-label={`Cancelar pedido #${order.id}`}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Cancelar</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
