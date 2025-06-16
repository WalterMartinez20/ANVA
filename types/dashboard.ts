export type DashboardTimeRange = "month" | "quarter" | "year" | "all";

export interface DashboardStats {
  totalSales: number;
  salesChangePercentage: number | null;

  totalOrders: number;
  ordersChangePercentage: number | null;

  totalProducts: number;
  newProductsThisPeriod: number | null;

  totalCustomers: number;
  customersChangePercentage: number | null;

  recentOrders: {
    id: number;
    customer: string;
    status: string;
    total: number;
  }[];
  topProducts: {
    id: number;
    name: string;
    sales: number;
    revenue: number;
    stock: number;
  }[];
  salesByMonth: {
    month: string;
    sales: number;
  }[];
  salesByCategory: {
    name: string;
    value: number;
  }[];
  ordersByStatus: {
    name: string;
    value: number;
  }[];
  customerGrowth: {
    month: string;
    customers: number;
  }[];
}
