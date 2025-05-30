"use client";

import {
  CheckCircle2,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTrackingProps {
  status: string;
  estimatedDeliveryDate?: string | Date;
  shippingDate?: string | Date;
  deliveryDate?: string | Date;
  address?: string;
  currentStatus?: string;
}

const steps = [
  { icon: ShoppingBag, label: "Preparando", key: "PENDING" },
  { icon: Package, label: "Procesando", key: "PROCESSING" },
  { icon: Truck, label: "En camino", key: "SHIPPED" },
  { icon: CheckCircle2, label: "Entregado", key: "DELIVERED" },
];

function getProgressIndex(status: string): number {
  return steps.findIndex((step) => step.key === status);
}

export default function OrderProgress({
  status,
  estimatedDeliveryDate,
  address,
  currentStatus,
}: OrderTrackingProps) {
  const progress = getProgressIndex(status);
  const formattedEstimatedDate = estimatedDeliveryDate
    ? new Date(estimatedDeliveryDate).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "No disponible";

  if (status === "CANCELLED") {
    return (
      <div className="flex items-start gap-4 border border-rose-200 bg-rose-50 rounded-md p-4 shadow-sm">
        <div className="bg-rose-100 p-2 rounded-full">
          <XCircle className="w-5 h-5 text-rose-700" />
        </div>
        <div>
          <h3 className="font-semibold text-rose-700 mb-1">Pedido Cancelado</h3>
          <p className="text-sm text-rose-600">
            Este pedido ha sido cancelado y no será procesado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
      <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Truck className="h-5 w-5 text-gray-700" />
        Seguimiento del Pedido
      </h3>

      {/* Línea de progreso */}
      <div className="relative flex justify-between items-center mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-gray-200 z-0" />
        <div
          className={cn(
            "absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-green-500 z-10 transition-all duration-300",
            {
              "w-0": progress < 0,
              "w-1/3": progress === 0,
              "w-2/3": progress === 1,
              "w-full": progress >= 2,
            }
          )}
        />
        {steps.map((step, index) => {
          const Icon = step.icon;
          const reached = index <= progress;

          return (
            <div
              key={step.key}
              className="z-20 flex flex-col items-center w-1/4"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white",
                  reached
                    ? "border-green-500 text-green-600"
                    : "border-gray-300 text-gray-300"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  reached ? "text-green-700" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detalles */}
      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
        <div>
          <p className="text-gray-500">Entrega estimada:</p>
          <p className="font-medium">{formattedEstimatedDate}</p>
        </div>
        <div>
          <p className="text-gray-500">Dirección:</p>
          <p className="font-medium">{address || "No especificada"}</p>
        </div>
        <div>
          <p className="text-gray-500">Estado actual:</p>
          <p className="font-medium text-green-700">
            {currentStatus || "En preparación"}
          </p>
        </div>
      </div>
    </div>
  );
}
