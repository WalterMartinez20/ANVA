"use client";

import {
  Clock,
  Loader2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import type { JSX } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusBadgeProps {
  status: string;
  context?: "payment" | "order"; // * por defecto se muestran estados de pago, con "order" se muestran los de pedido
}

export default function StatusBadge({
  status,
  context = "payment",
}: StatusBadgeProps) {
  const base =
    "inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border shadow-sm cursor-help"; // Añadimos cursor-help

  // Las etiquetas se mantienen igual
  const sharedStatuses: Record<string, { label: string }> = {
    PENDING: { label: "Pendiente" },
    PROCESSING: { label: "En proceso" },
    SHIPPED: { label: "Enviado" },
    DELIVERED: { label: "Entregado" },
    CANCELLED: { label: "Cancelado" },
    COMPLETED: { label: "Completado" },
    REFUNDED: { label: "Reembolsado" },
    ON_HOLD: { label: "En Revisión" },
  };

  // --- PASO 2: Añadimos el campo "description" a cada estado ---
  const contextMap: Record<
    string,
    Record<string, { icon: JSX.Element; style: string; description: string }>
  > = {
    payment: {
      PENDING: {
        icon: <Clock className="w-4 h-4" />,
        style: "bg-yellow-50 text-yellow-800 border-yellow-200",
        description: "Estamos esperando la confirmación de tu pago.",
      },
      ON_HOLD: {
        icon: <ShieldCheck className="w-4 h-4" />,
        style: "bg-orange-50 text-orange-800 border-orange-200",
        description:
          "Hemos recibido tu notificación de pago y la estamos verificando.",
      },
      COMPLETED: {
        icon: <CheckCircle className="w-4 h-4" />,
        style: "bg-emerald-50 text-emerald-800 border-emerald-200",
        description: "¡Tu pago ha sido completado con éxito!",
      },
      CANCELLED: {
        icon: <XCircle className="w-4 h-4" />,
        style: "bg-rose-50 text-rose-800 border-rose-200",
        description: "Este pago ha sido cancelado.",
      },
      REFUNDED: {
        icon: <Loader2 className="w-4 h-4" />,
        style: "bg-purple-50 text-purple-800 border-purple-200",
        description: "El monto de esta compra ha sido reembolsado a tu cuenta.",
      },
    },
    order: {
      PENDING: {
        icon: <Clock className="w-4 h-4" />,
        style: "bg-yellow-50 text-yellow-800 border-yellow-200",
        description: "Tu pedido ha sido recibido y está pendiente de pago.",
      },
      PROCESSING: {
        icon: <Package className="w-4 h-4" />,
        style: "bg-sky-50 text-sky-800 border-sky-200",
        description: "¡Estamos preparando tu pedido para el envío!",
      },
      SHIPPED: {
        icon: <Truck className="w-4 h-4" />,
        style: "bg-purple-50 text-purple-800 border-purple-200",
        description: "Tu pedido ya ha sido enviado y está en camino.",
      },
      DELIVERED: {
        icon: <CheckCircle className="w-4 h-4" />,
        style: "bg-lime-50 text-lime-800 border-lime-200",
        description: "¡Tu pedido ha sido entregado con éxito!",
      },
      CANCELLED: {
        icon: <XCircle className="w-4 h-4" />,
        style: "bg-rose-50 text-rose-800 border-rose-200",
        description: "Este pedido ha sido cancelado.",
      },
    },
  };

  const iconMap = contextMap[context] || contextMap["payment"];
  const statusInfo = sharedStatuses[status];
  const contextInfo = iconMap[status];

  const icon = contextInfo?.icon ?? <HelpCircle className="w-4 h-4" />;
  const label = statusInfo?.label ?? status;
  const style =
    contextInfo?.style ?? "bg-gray-100 text-gray-800 border-gray-300";
  // Obtenemos la descripción
  const description = contextInfo?.description;

  const Badge = (
    <span className={`${base} ${style}`} title={label}>
      {icon}
      {label}
    </span>
  );

  // TooltipProvider es necesario para que funcionen los tooltips.
  // Es mejor ponerlo en un layout principal, pero aquí funciona bien para un ejemplo autocontenido.
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{Badge}</TooltipTrigger>
        {description && (
          <TooltipContent>
            <span className="text-sm text-muted-foreground block max-w-xs">
              {description}
            </span>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
