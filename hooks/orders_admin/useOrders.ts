// * Encapsula la lógica para cargar pedidos desde /api/orders y manejar loading y errores.

import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import type { OrderWithUser } from "@/types/order";

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Error al cargar pedidos");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (e) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los pedidos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return { orders, setOrders, isLoading };
}
