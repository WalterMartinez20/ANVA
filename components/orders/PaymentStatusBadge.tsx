// * Sigue la misma estructura que OrderStatusBadge, pero para mostrar el estado de un pago

"use client";

import {
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import type { JSX } from "react";

interface PaymentStatusBadgeProps {
  status: string;
}

export default function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
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
    COMPLETED: {
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Completado",
      style: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    FAILED: {
      icon: <XCircle className="w-4 h-4" />,
      label: "Fallido",
      style: "bg-rose-50 text-rose-800 border-rose-200",
    },
    REFUNDED: {
      icon: <RotateCcw className="w-4 h-4" />,
      label: "Reembolsado",
      style: "bg-blue-50 text-blue-800 border-blue-200",
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
