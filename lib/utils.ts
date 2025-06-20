import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatea precio con el símbolo de la moneda
export function formatPrice(price: number, currency: string = "ARS"): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
  }).format(price);
}

// Genera un slug a partir de un string
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

// Trunca un texto a una longitud máxima
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

// Valida email con expresión regular
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  // Opciones para formatear la fecha
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Intl.DateTimeFormat("es-ES", options).format(date);
}

export function formatPhoneNumber(value?: string): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
}

export const getShippingLabel = (method: string): string => {
  switch (method) {
    case "store-pickup":
      return "Recoger en tienda";
    case "priority":
      return "Envío Prioritario";
    case "express":
      return "Envío Express";
    default:
      return "Método desconocido";
  }
};

export const getPaymentLabel = (method: string): string => {
  switch (method.toUpperCase()) {
    case "CREDIT_CARD":
      return "Tarjeta de crédito";
    case "DEBIT_CARD":
      return "Tarjeta de débito";
    case "BANK_TRANSFER":
      return "Transferencia bancaria";
    case "CASH":
      return "Pago en efectivo";
    case "OTHER":
      return "Otro método";
    default:
      return "Método desconocido";
  }
};

// El valor "BANK-TRANSFER" no es válido porque Prisma espera "BANK_TRANSFER" (con guion bajo, no guion medio).
// Se normaliza paymentMethod antes de pasarlo a Prisma, de forma que coincida con tu enum.
export function normalizePaymentMethod(
  method: string
): "BANK_TRANSFER" | "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "OTHER" {
  switch (method) {
    case "bank-transfer":
      return "BANK_TRANSFER";
    case "cash":
      return "CASH";
    case "credit-card":
      return "CREDIT_CARD";
    case "debit-card":
      return "DEBIT_CARD";
    default:
      return "OTHER";
  }
}

//trraduce a español los estados de transporte de envio
export function getOrderStatusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "PREPARANDO";
    case "PROCESSING":
      return "PROCESANDO";
    case "SHIPPED":
      return "EN CAMINO";
    case "DELIVERED":
      return "ENTREGADO";
    case "CANCELLED":
      return "CANCELADO";
    default:
      return "DESCONOCIDO";
  }
}
