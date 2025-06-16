"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { FileSpreadsheet } from "lucide-react";
import TooltipInfoButton from "@/components/help/TooltipInfoButton"; // ✅ Importado

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

interface DashboardAnalyticsProps {
  stats: {
    salesByCategory: { name: string; value: number }[];
    ordersByStatus: { name: string; value: number }[];
    customerGrowth: { month: string; customers: number }[];
  };
  onExportExcel: (type: string) => void;
}

const DashboardAnalytics = ({
  stats,
  onExportExcel,
}: DashboardAnalyticsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ventas por Categoría */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-1">
              <div>
                <CardTitle>Ventas por Categoría</CardTitle>
                <CardDescription>
                  Distribución por tipo de producto
                </CardDescription>
              </div>
              <TooltipInfoButton content="Este gráfico muestra el porcentaje de ventas correspondientes a cada categoría." />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => onExportExcel("categories")}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar
              </Button>
              <TooltipInfoButton content="Descarga esta distribución de ventas por categoría en Excel." />
            </div>
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

        {/* Pedidos por Estado */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-1">
              <div>
                <CardTitle>Pedidos por Estado</CardTitle>
                <CardDescription>
                  Distribución por etapa del pedido
                </CardDescription>
              </div>
              <TooltipInfoButton content="Cantidad de pedidos clasificados según su estado: pendiente, enviado, entregado, etc." />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => onExportExcel("orders")}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar
              </Button>
              <TooltipInfoButton content="Descarga este gráfico de pedidos por estado como Excel." />
            </div>
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

      {/* Crecimiento de Clientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-1">
            <div>
              <CardTitle>Crecimiento de Clientes</CardTitle>
              <CardDescription>Clientes nuevos por mes</CardDescription>
            </div>
            <TooltipInfoButton content="Gráfico de clientes nuevos registrados por mes según el período filtrado." />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => onExportExcel("customers")}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exportar a Excel
            </Button>
            <TooltipInfoButton content="Descarga el crecimiento de clientes en formato Excel." />
          </div>
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
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
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
    </div>
  );
};

export default DashboardAnalytics;
