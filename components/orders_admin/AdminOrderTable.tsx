"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUpDown, Ban } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import StatusBadge from "../orders/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { getPaymentLabel, normalizePaymentMethod } from "@/lib/utils";

import type { OrderWithUser } from "@/types/order";

interface AdminOrderTableProps {
  orders: OrderWithUser[];
  onViewOrder: (order: OrderWithUser) => void;
  requestSort: (key: string) => void;
}

export default function AdminOrderTable({
  orders,
  onViewOrder,
  requestSort,
}: AdminOrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-md">
        <Ban className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-base font-semibold text-gray-700 mb-1">
          No hay pedidos
        </h3>
        <p className="text-sm text-muted-foreground">
          No se encontraron pedidos con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 border-b">
              <TableHead className="text-left">
                <button
                  onClick={() => requestSort("id")}
                  className="flex items-center gap-1 text-gray-600"
                >
                  ID <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="text-left">
                <button
                  onClick={() => requestSort("user")}
                  className="flex items-center gap-1 text-gray-600"
                >
                  Cliente <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="text-left whitespace-nowrap">
                <button
                  onClick={() => requestSort("createdAt")}
                  className="flex items-center gap-1 text-gray-600"
                >
                  Fecha <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="text-center">
                <button
                  onClick={() => requestSort("status")}
                  className="flex items-center gap-1 text-gray-600"
                >
                  Estado <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  onClick={() => requestSort("total")}
                  className="flex items-center gap-1 text-gray-600"
                >
                  Total <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="text-center">Productos</TableHead>
              <TableHead className="text-left">Método de Pago</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell className="text-left font-medium text-gray-800">
                  {order.id}
                </TableCell>
                <TableCell className="text-left text-gray-700">
                  {order.user.nombres} {order.user.apellidos}
                </TableCell>
                <TableCell className="text-left text-gray-700">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={order.status} context="order" />
                </TableCell>
                <TableCell className="text-right text-gray-800">
                  {formatPrice(order.total)}
                </TableCell>
                <TableCell className="text-center text-gray-700">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "producto" : "productos"}
                </TableCell>
                <TableCell className="text-left text-sm text-gray-700">
                  {order.payments.length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {getPaymentLabel(order.payments[0].method)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {order.payments?.[0]?.status && (
                          <StatusBadge status={order.payments[0].status} />
                        )}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      No especificado
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => onViewOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Ver Detalles</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
