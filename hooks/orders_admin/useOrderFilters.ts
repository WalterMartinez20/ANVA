// * Filtros (fecha, total, método de pago), Búsqueda, Tabs (estado), Ordenamiento por columnas

import { useEffect, useState } from "react";
import type { OrderWithUser } from "@/types/order";

export function useOrderFilters(orders: OrderWithUser[]) {
  const [filtered, setFiltered] = useState<OrderWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("all");
  const [date, setDate] = useState({ startDate: "", endDate: "" });
  const [filters, setFilters] = useState({
    minTotal: "",
    maxTotal: "",
    paymentMethod: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    let result = [...orders];
    const term = searchTerm.toLowerCase();

    result = result.filter(
      (o) =>
        o.id.toString().includes(term) ||
        o.user.email.toLowerCase().includes(term) ||
        `${o.user.nombres} ${o.user.apellidos}`.toLowerCase().includes(term) ||
        o.status.toLowerCase().includes(term) ||
        (o.trackingNumber?.toLowerCase().includes(term) ?? false)
    );

    if (tab !== "all")
      result = result.filter((o) => o.status === tab.toUpperCase());

    if (date.startDate)
      result = result.filter(
        (o) => new Date(o.createdAt) >= new Date(date.startDate)
      );
    if (date.endDate) {
      const end = new Date(date.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((o) => new Date(o.createdAt) <= end);
    }

    if (filters.minTotal)
      result = result.filter((o) => o.total >= parseFloat(filters.minTotal));
    if (filters.maxTotal)
      result = result.filter((o) => o.total <= parseFloat(filters.maxTotal));
    if (filters.paymentMethod)
      result = result.filter((o) =>
        o.payments.some((p) => p.method === filters.paymentMethod)
      );

    if (sortConfig) {
      result.sort((a, b) => {
        const key = sortConfig.key;
        let aVal = a[key as keyof typeof a];
        let bVal = b[key as keyof typeof b];

        if (key === "user") {
          aVal = `${a.user.nombres} ${a.user.apellidos}`.toLowerCase();
          bVal = `${b.user.nombres} ${b.user.apellidos}`.toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setFiltered(result);
  }, [orders, searchTerm, tab, date, filters, sortConfig]);

  return {
    filtered,
    searchTerm,
    setSearchTerm,
    tab,
    setTab,
    date,
    setDate,
    filters,
    setFilters,
    sortConfig,
    requestSort: (key: string) => {
      let direction: "ascending" | "descending" = "ascending";
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "ascending"
      ) {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    },
    resetFilters: () => {
      setSearchTerm("");
      setTab("all");
      setDate({ startDate: "", endDate: "" });
      setFilters({ minTotal: "", maxTotal: "", paymentMethod: "" });
    },
  };
}
