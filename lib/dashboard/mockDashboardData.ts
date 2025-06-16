import { DashboardStats, DashboardTimeRange } from "@/types/dashboard";

export async function getMockDashboardData(
  range: DashboardTimeRange
): Promise<DashboardStats> {
  await new Promise((res) => setTimeout(res, 300));

  return {
    totalSales: 12500,
    totalOrders: 320,
    totalProducts: 58,
    totalCustomers: 112,
    recentOrders: [
      { id: 1012, customer: "Juan Pérez", status: "DELIVERED", total: 230.5 },
      { id: 1013, customer: "Ana Gómez", status: "PROCESSING", total: 150.75 },
      { id: 1014, customer: "Carlos Ruiz", status: "PENDING", total: 90.0 },
    ],
    topProducts: [
      { id: 1, name: "Camiseta Básica", sales: 120, revenue: 2400, stock: 8 },
      { id: 2, name: "Pantalón Jeans", sales: 95, revenue: 3800, stock: 12 },
      {
        id: 3,
        name: "Zapatillas Deportivas",
        sales: 85,
        revenue: 5100,
        stock: 5,
      },
    ],
    salesByMonth: Array.from({ length: 12 }, (_, i) => ({
      month: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ][i],
      sales: Math.floor(Math.random() * 2000) + 500,
    })),
    salesByCategory: [
      { name: "Ropa", value: 5500 },
      { name: "Calzado", value: 4300 },
      { name: "Accesorios", value: 2700 },
    ],
    ordersByStatus: [
      { name: "PENDING", value: 40 },
      { name: "PROCESSING", value: 50 },
      { name: "SHIPPED", value: 70 },
      { name: "DELIVERED", value: 120 },
      { name: "CANCELLED", value: 40 },
    ],
    customerGrowth: Array.from({ length: 12 }, (_, i) => ({
      month: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ][i],
      customers: Math.floor(Math.random() * 20) + 5,
    })),
  };
}
