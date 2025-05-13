"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Calendar,
  PieChart,
  BarChart3,
  LineChart,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie,
  Legend,
} from "recharts";
// import * as XLSX from "xlsx";

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: any[];
  topProducts: any[];
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

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    salesByMonth: [],
    salesByCategory: [],
    ordersByStatus: [],
    customerGrowth: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("year");

  const useMockData = process.env.NEXT_PUBLIC_USE_DASHBOARD_MOCK === "true";
  //esta esta comentada solo para mostrar la parte del mock
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       // Obtener datos reales del dashboard
  //       const response = await fetch(
  //         `/api/admin/dashboard?timeRange=${timeRange}`
  //       );

  //       if (!response.ok) {
  //         throw new Error("Error al cargar datos del dashboard");
  //       }

  //       const data = await response.json();
  //       setStats(data);
  //     } catch (error) {
  //       console.error("Error al cargar datos del dashboard:", error);
  //       toast({
  //         title: "Error",
  //         description: "No se pudieron cargar los datos del dashboard",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, [timeRange]);

  //esta es la del mock
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      if (useMockData) {
        // Simular datos mock
        await new Promise((resolve) => setTimeout(resolve, 500));

        setStats({
          totalSales: 12500,
          totalOrders: 320,
          totalProducts: 58,
          totalCustomers: 112,
          recentOrders: [
            {
              id: 1012,
              customer: "Juan Pérez",
              status: "DELIVERED",
              total: 230.5,
            },
            {
              id: 1013,
              customer: "Ana Gómez",
              status: "PROCESSING",
              total: 150.75,
            },
            {
              id: 1014,
              customer: "Carlos Ruiz",
              status: "PENDING",
              total: 90.0,
            },
          ],
          topProducts: [
            {
              id: 1,
              name: "Camiseta Básica",
              sales: 120,
              revenue: 2400,
              stock: 8,
            },
            {
              id: 2,
              name: "Pantalón Jeans",
              sales: 95,
              revenue: 3800,
              stock: 12,
            },
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
        });
      } else {
        // Obtener datos reales
        try {
          const response = await fetch(
            `/api/admin/dashboard?timeRange=${timeRange}`
          );
          if (!response.ok) throw new Error("Error al cargar datos");
          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error("Error al cargar dashboard:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los datos del dashboard",
            variant: "destructive",
          });
        }
      }

      setIsLoading(false);
    };

    loadDashboardData();
  }, [timeRange, useMockData]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            En proceso
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Enviado
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Entregado
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportToCSV = () => {
    // Implementación básica para exportar datos a CSV
    const csvData = [
      ["Mes", "Ventas"],
      ...stats.salesByMonth.map((item) => [item.month, item.sales.toString()]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ventas_${timeRange}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (dataType: string) => {
    let dataToExport: any[] = [];
    let fileName = "";

    // Preparar datos según el tipo de reporte
    switch (dataType) {
      case "sales":
        dataToExport = stats.salesByMonth.map((item) => ({
          Mes: item.month,
          Ventas: item.sales,
        }));
        fileName = `ventas_${timeRange}.xlsx`;
        break;
      case "products":
        dataToExport = stats.topProducts.map((item) => ({
          Producto: item.name,
          Ventas: item.sales,
          Ingresos: item.revenue,
          Stock: item.stock,
        }));
        fileName = `productos_top_${timeRange}.xlsx`;
        break;
      case "categories":
        dataToExport = stats.salesByCategory.map((item) => ({
          Categoría: item.name,
          Ventas: item.value,
        }));
        fileName = `categorias_${timeRange}.xlsx`;
        break;
      case "orders":
        dataToExport = stats.ordersByStatus.map((item) => ({
          Estado: item.name,
          Cantidad: item.value,
        }));
        fileName = `pedidos_${timeRange}.xlsx`;
        break;
      case "customers":
        dataToExport = stats.customerGrowth.map((item) => ({
          Mes: item.month,
          Clientes: item.customers,
        }));
        fileName = `clientes_${timeRange}.xlsx`;
        break;
      default:
        dataToExport = stats.salesByMonth.map((item) => ({
          Mes: item.month,
          Ventas: item.sales,
        }));
        fileName = `datos_${timeRange}.xlsx`;
    }

    // Crear libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Guardar archivo
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Exportación completada",
      description: `Los datos se han exportado a ${fileName}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último año</SelectItem>
              <SelectItem value="all">Todo el tiempo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Ventas Totales
              </p>
              <h3 className="text-2xl font-bold">
                ${stats.totalSales.toLocaleString()}
              </h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% desde el período anterior
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pedidos Totales
              </p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% desde el período anterior
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Productos
              </p>
              <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +4 nuevos este período
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Clientes
              </p>
              <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.3% desde el período anterior
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span>Analíticas</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" />
            <span>Reportes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pedidos recientes */}
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/admin/pedidos/${order.id}`}
                            className="hover:underline"
                          >
                            #{order.id}
                          </Link>
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          ${order.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 text-center">
                  <Link
                    href="/admin/pedidos"
                    className="text-sm text-primary hover:underline"
                  >
                    Ver todos los pedidos
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Productos más vendidos */}
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Ventas</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Ingresos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.topProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/admin/productos/${product.id}`}
                            className="hover:underline"
                          >
                            {product.name}
                          </Link>
                        </TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>
                          {product.stock < 10 ? (
                            <span className="text-red-600">
                              {product.stock}
                            </span>
                          ) : (
                            product.stock
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          ${product.revenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 text-center">
                  <Link
                    href="/admin/productos"
                    className="text-sm text-primary hover:underline"
                  >
                    Ver todos los productos
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de ventas con datos reales */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ventas Mensuales</CardTitle>
                <CardDescription>
                  Ingresos generados durante el período seleccionado
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => exportToExcel("sales")}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar a Excel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stats.salesByMonth}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorSales"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value) => [`$${value}`, "Ventas"]} />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ventas por categoría */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Ventas por Categoría</CardTitle>
                  <CardDescription>
                    Distribución de ventas por categoría de producto
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => exportToExcel("categories")}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={stats.salesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.salesByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, "Ventas"]} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pedidos por estado */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pedidos por Estado</CardTitle>
                  <CardDescription>
                    Distribución de pedidos según su estado actual
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => exportToExcel("orders")}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.ordersByStatus}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d">
                        {stats.ordersByStatus.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crecimiento de clientes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Crecimiento de Clientes</CardTitle>
                <CardDescription>
                  Nuevos clientes registrados por mes
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => exportToExcel("customers")}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar a Excel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stats.customerGrowth}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCustomers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="customers"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorCustomers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Reportes</CardTitle>
                <CardDescription>
                  Genera y descarga reportes de ventas y actividad
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={exportToCSV}
                >
                  <FileText className="h-4 w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => exportToExcel("sales")}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Reporte de Ventas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Mensual
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => exportToExcel("sales")}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Reporte de Inventario
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Actualizado
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => exportToExcel("products")}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Reporte de Clientes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Trimestral
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => exportToExcel("customers")}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reporte</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Última actualización</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Ventas por producto
                      </TableCell>
                      <TableCell>Último mes</TableCell>
                      <TableCell>Hace 2 días</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => exportToExcel("products")}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Análisis de clientes
                      </TableCell>
                      <TableCell>Último trimestre</TableCell>
                      <TableCell>Hace 1 semana</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => exportToExcel("customers")}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Rendimiento de categorías
                      </TableCell>
                      <TableCell>Último año</TableCell>
                      <TableCell>Hace 1 mes</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => exportToExcel("categories")}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
