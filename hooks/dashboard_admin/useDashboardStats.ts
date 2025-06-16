import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
import { DashboardStats, DashboardTimeRange } from "@/types/dashboard";
import { getMockDashboardData } from "@/lib/dashboard/mockDashboardData";

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    salesChangePercentage: null,

    totalOrders: 0,
    ordersChangePercentage: null,

    totalProducts: 0,
    newProductsThisPeriod: null,

    totalCustomers: 0,
    customersChangePercentage: null,

    recentOrders: [],
    topProducts: [],
    salesByMonth: [],
    salesByCategory: [],
    ordersByStatus: [],
    customerGrowth: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>("year");

  const useMockData = process.env.NEXT_PUBLIC_USE_DASHBOARD_MOCK === "true";

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = useMockData
          ? await getMockDashboardData(timeRange)
          : await fetchData(timeRange);
        setStats(data);
      } catch {
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del dashboard",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [timeRange, useMockData]);

  const fetchData = async (range: DashboardTimeRange) => {
    const response = await fetch(`/api/admin/dashboard?timeRange=${range}`);
    if (!response.ok) throw new Error("Error al obtener datos");
    return await response.json();
  };

  const exportToCSV = () => {
    const csvData = [
      ["Mes", "Ventas"],
      ...stats.salesByMonth.map((item) => [item.month, item.sales.toString()]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ventas_${timeRange}.csv`;
    link.click();
  };

  const exportToExcel = (type: string) => {
    let data = [];
    let fileName = "";

    switch (type) {
      case "sales":
        data = stats.salesByMonth.map((i) => ({
          Mes: i.month,
          Ventas: i.sales,
        }));
        fileName = `ventas_${timeRange}.xlsx`;
        break;
      case "products":
        data = stats.topProducts.map((i) => ({
          Producto: i.name,
          Ventas: i.sales,
          Ingresos: i.revenue,
          Stock: i.stock,
        }));
        fileName = `productos_${timeRange}.xlsx`;
        break;
      case "categories":
        data = stats.salesByCategory.map((i) => ({
          Categoría: i.name,
          Ventas: i.value,
        }));
        fileName = `categorias_${timeRange}.xlsx`;
        break;
      case "orders":
        data = stats.ordersByStatus.map((i) => ({
          Estado: i.name,
          Cantidad: i.value,
        }));
        fileName = `pedidos_${timeRange}.xlsx`;
        break;
      case "customers":
        data = stats.customerGrowth.map((i) => ({
          Mes: i.month,
          Clientes: i.customers,
        }));
        fileName = `clientes_${timeRange}.xlsx`;
        break;
      default:
        return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Exportación completada",
      description: `Archivo guardado: ${fileName}`,
    });
  };

  return {
    stats,
    isLoading,
    timeRange,
    setTimeRange,
    exportToCSV,
    exportToExcel,
  };
}
