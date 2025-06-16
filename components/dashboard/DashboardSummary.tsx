"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";

interface DashboardSummaryProps {
  stats: {
    totalSales: number;
    salesChangePercentage: number | null;
    totalOrders: number;
    ordersChangePercentage: number | null;
    totalProducts: number;
    newProductsThisPeriod: number | null;
    totalCustomers: number;
    customersChangePercentage: number | null;
  };
}

const DashboardSummary = ({ stats }: DashboardSummaryProps) => {
  const renderChange = (percentage: number | null, label: string) => {
    if (percentage === null || isNaN(percentage)) return null;

    const isPositive = percentage >= 0;
    const textColor = isPositive ? "text-green-600" : "text-red-600";
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const formattedPercentage = Math.abs(percentage).toFixed(1);

    return (
      <p className={`text-xs ${textColor} flex items-center mt-1`}>
        <Icon className="h-3 w-3 mr-1" />
        {isPositive ? "+" : "-"}
        {formattedPercentage}% {label}
      </p>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Ventas Totales */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                Ventas Totales
              </p>
              <TooltipInfoButton content="Suma de los ingresos por ventas en el período seleccionado." />
            </div>
            <h3 className="text-2xl font-bold">
              {formatPrice(stats.totalSales)}
            </h3>
            {renderChange(
              stats.salesChangePercentage,
              "desde el período anterior"
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Pedidos Totales */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                Pedidos Totales
              </p>
              <TooltipInfoButton content="Cantidad total de pedidos realizados, incluyendo entregados y pendientes." />
            </div>
            <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            {renderChange(
              stats.ordersChangePercentage,
              "desde el período anterior"
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Productos */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                Productos
              </p>
              <TooltipInfoButton content="Número de productos registrados actualmente en tu catálogo." />
            </div>
            <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
            {stats.newProductsThisPeriod !== null && (
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />+
                {stats.newProductsThisPeriod} nuevos este período
              </p>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Clientes */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                Clientes
              </p>
              <TooltipInfoButton content="Clientes únicos que se han registrado en tu tienda." />
            </div>
            <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
            {renderChange(
              stats.customersChangePercentage,
              "desde el período anterior"
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
