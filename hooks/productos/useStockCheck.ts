import { useState } from "react";

interface CartItem {
  id: number;
  quantity: number;
}

interface StockCheckResult {
  ok: boolean;
  error?: string;
}

export function useStockCheck() {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStock = async (
    cartItems: CartItem[]
  ): Promise<StockCheckResult> => {
    setChecking(true);
    setError(null);

    try {
      const res = await fetch("/api/stock-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al verificar stock");
        return { ok: false, error: data.error };
      }

      return { ok: true };
    } catch (err) {
      setError("Error inesperado al verificar stock");
      return { ok: false, error: "Error inesperado al verificar stock" };
    } finally {
      setChecking(false);
    }
  };

  return {
    checkStock,
    checking,
    error,
  };
}
