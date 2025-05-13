"use client";

import { CheckCircle2, Package, ShoppingBag, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTrackingProps {
  status: string;
  estimatedDeliveryDate?: string | Date;
  shippingDate?: string | Date;
  deliveryDate?: string | Date;
  address?: string;
  currentStatus?: string;
}

export default function OrderTracking({
  status,
  estimatedDeliveryDate,
  shippingDate,
  deliveryDate,
  address,
  currentStatus,
}: OrderTrackingProps) {
  // Determinar el progreso basado en el estado
  const getProgress = () => {
    switch (status) {
      case "PENDING":
        return 0;
      case "PROCESSING":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 3;
      case "CANCELLED":
        return -1;
      default:
        return 0;
    }
  };

  const progress = getProgress();
  const formattedEstimatedDate = estimatedDeliveryDate
    ? new Date(estimatedDeliveryDate).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "No disponible";

  // Si el pedido está cancelado, mostrar un mensaje especial
  if (progress === -1) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
          <span className="text-lg">Pedido Cancelado</span>
        </div>
        <p className="text-sm text-red-600">
          Este pedido ha sido cancelado y no será procesado.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-6">Seguimiento de Pedido</h3>

      {/* Barra de progreso con iconos */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200"></div>
        <div
          className={cn(
            "absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-green-500 transition-all",
            {
              "w-0": progress === 0,
              "w-1/3": progress === 1,
              "w-2/3": progress === 2,
              "w-full": progress === 3,
            }
          )}
        ></div>

        <div className="relative flex justify-between">
          {/* Preparando */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white",
                progress >= 0
                  ? "border-green-500 text-green-500"
                  : "border-gray-300 text-gray-300"
              )}
            >
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                progress >= 0 ? "text-green-500" : "text-gray-500"
              )}
            >
              Preparando
            </span>
          </div>

          {/* Procesando */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white",
                progress >= 1
                  ? "border-green-500 text-green-500"
                  : "border-gray-300 text-gray-300"
              )}
            >
              <Package className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                progress >= 1 ? "text-green-500" : "text-gray-500"
              )}
            >
              Procesando
            </span>
          </div>

          {/* En camino */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white",
                progress >= 2
                  ? "border-green-500 text-green-500"
                  : "border-gray-300 text-gray-300"
              )}
            >
              <Truck className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                progress >= 2 ? "text-green-500" : "text-gray-500"
              )}
            >
              En camino
            </span>
          </div>

          {/* Entregado */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white",
                progress >= 3
                  ? "border-green-500 text-green-500"
                  : "border-gray-300 text-gray-300"
              )}
            >
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                progress >= 3 ? "text-green-500" : "text-gray-500"
              )}
            >
              Entregado
            </span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Fecha estimada de entrega:</p>
          <p className="font-medium">{formattedEstimatedDate}</p>
        </div>
        <div>
          <p className="text-gray-500">Dirección de entrega:</p>
          <p className="font-medium">{address || "No especificada"}</p>
        </div>
        <div>
          <p className="text-gray-500">Estado actual:</p>
          <p className="font-medium text-green-600">
            {currentStatus || "En preparación"}
          </p>
        </div>
      </div>
    </div>
  );
}
