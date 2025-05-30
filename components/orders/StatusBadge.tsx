// * Aqui esta la lógica de renderizado del estado del pedido con estilos y colores adecuados

"use client";

import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import type { JSX } from "react";

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const base =
    "inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border shadow-sm";

  const statusMap: Record<
    string,
    { icon: JSX.Element; label: string; style: string }
  > = {
    PENDING: {
      icon: <Clock className="w-4 h-4" />,
      label: "Pendiente",
      style: "bg-yellow-50 text-yellow-800 border-yellow-200",
    },
    PROCESSING: {
      icon: <Package className="w-4 h-4" />,
      label: "En proceso",
      style: "bg-sky-50 text-sky-800 border-sky-200",
    },
    SHIPPED: {
      icon: <Truck className="w-4 h-4" />,
      label: "Enviado",
      style: "bg-blue-50 text-blue-800 border-blue-200",
    },
    DELIVERED: {
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Entregado",
      style: "bg-lime-50 text-lime-800 border-lime-200",
    },
    CANCELLED: {
      icon: <XCircle className="w-4 h-4" />,
      label: "Cancelado",
      style: "bg-rose-50 text-rose-800 border-rose-200",
    },
  };

  const fallback = {
    icon: <HelpCircle className="w-4 h-4" />,
    label: status,
    style: "bg-gray-100 text-gray-800 border-gray-300",
  };

  const { icon, label, style } = statusMap[status] ?? fallback;

  return (
    <span className={`${base} ${style}`} title={label}>
      {icon}
      {label}
    </span>
  );
}
