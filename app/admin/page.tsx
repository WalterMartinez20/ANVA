"use client";

import { Loader2, PieChart, BarChart3, LineChart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useDashboardStats } from "@/hooks/dashboard_admin/useDashboardStats";
import type { DashboardTimeRange } from "@/types/dashboard";

import DashboardSummary from "@/components/dashboard/DashboardSummary";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardAnalytics from "@/components/dashboard/DashboardAnalytics";
import DashboardReports from "@/components/dashboard/DashboardReports";

import HelpSection from "@/components/help/HelpSection";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";

export default function AdminDashboardPage() {
  const {
    stats,
    isLoading,
    timeRange,
    setTimeRange,
    exportToCSV,
    exportToExcel,
  } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ayuda contextual */}
      <HelpSection videoUrl="/help-videos/dashboard.mp4" />

      {/* Título + selector de tiempo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TooltipInfoButton content="Este panel te permite visualizar el rendimiento de tu tienda: ventas, pedidos, productos y clientes." />
        </div>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as DashboardTimeRange)}
        >
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

      {/* Resumen general */}
      <DashboardSummary stats={stats} />

      {/* Tabs de secciones */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex gap-2">
          <div className="flex items-center gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              Resumen
            </TabsTrigger>
          </div>

          <div className="flex items-center gap-1">
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              Analíticas
            </TabsTrigger>
          </div>

          <div className="flex items-center gap-1">
            <TabsTrigger value="reports" className="flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              Reportes
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="overview">
          <DashboardOverview
            stats={stats}
            onExportExcel={() => exportToExcel("sales")}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <DashboardAnalytics stats={stats} onExportExcel={exportToExcel} />
        </TabsContent>

        <TabsContent value="reports">
          <DashboardReports
            onExportCSV={exportToCSV}
            onExportExcel={exportToExcel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
