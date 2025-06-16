"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "recharts";
import { FileSpreadsheet } from "lucide-react";
import StatusBadge from "@/components/orders/StatusBadge";
import TooltipInfoButton from "@/components/help/TooltipInfoButton"; // ✅ Añadido

interface DashboardOverviewProps {
  stats: {
    recentOrders: any[];
    topProducts: any[];
    salesByMonth: { month: string; sales: number }[];
  };
  onExportExcel: () => void;
}

const DashboardOverview = ({
  stats,
  onExportExcel,
}: DashboardOverviewProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pedidos recientes */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <CardTitle>Pedidos Recientes</CardTitle>
              <TooltipInfoButton content="Muestra los 3 últimos pedidos recibidos por los clientes." />
            </div>
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
                {stats.recentOrders.slice(0, 3).map((order) => (
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
                    <TableCell>
                      <StatusBadge status={order.status} context="order" />
                    </TableCell>
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
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <CardTitle>Productos Más Vendidos</CardTitle>
              <TooltipInfoButton content="Productos con más unidades vendidas en el período seleccionado." />
            </div>
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
                {stats.topProducts.slice(0, 3).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/producto/${product.id}`}
                        className="hover:underline"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>
                      {product.stock < 10 ? (
                        <span className="text-red-600">{product.stock}</span>
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

      {/* Gráfico de ventas mensuales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-1">
            <div>
              <CardTitle>Ventas Mensuales</CardTitle>
              <CardDescription>
                Ingresos generados durante el período seleccionado
              </CardDescription>
            </div>
            <TooltipInfoButton content="Este gráfico muestra las ventas mes a mes, de acuerdo al filtro de tiempo." />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onExportExcel}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exportar a Excel
            </Button>
            <TooltipInfoButton content="Descarga este resumen en formato Excel." />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.salesByMonth}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <ChartTooltip formatter={(value) => [`$${value}`, "Ventas"]} />
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
    </div>
  );
};

export default DashboardOverview;
