import { Product } from "./producto_admin"; // reutilizamos Product para los items

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Payment {
  id: number;
  amount: number;
  method: string;
  status: string;
  reference: string | null;
  createdAt: string;
}

export interface StatusHistory {
  id: number;
  status: string;
  notes: string | null;
  createdAt: string;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  address: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: Payment[];
  trackingNumber: string | null;
  carrier: string | null;
  estimatedDeliveryDate: string | null;
  shippingDate: string | null;
  deliveryDate: string | null;
  statusHistory: StatusHistory[];
}
