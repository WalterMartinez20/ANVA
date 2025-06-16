// * 📂 Tres tarjetas de resumen de reportes (Ventas, Inventario, Clientes), 📋 Una tabla con detalles de reportes, 📤 Botones de exportación a CSV y Excel

"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Calendar } from "lucide-react";

interface DashboardReportsProps {
  onExportCSV: () => void;
  onExportExcel: (type: string) => void;
}

const DashboardReports = ({
  onExportCSV,
  onExportExcel,
}: DashboardReportsProps) => {
  return (
    <div className="space-y-4">
      {/* Cabecera */}
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
              onClick={onExportCSV}
            >
              <FileText className="h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => onExportExcel("sales")}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Reporte de Ventas",
                  period: "Mensual",
                  type: "sales",
                },
                {
                  title: "Reporte de Inventario",
                  period: "Actualizado",
                  type: "products",
                },
                {
                  title: "Reporte de Clientes",
                  period: "Trimestral",
                  type: "customers",
                },
              ].map((report, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{report.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{report.period}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onExportExcel(report.type)}
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabla */}
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
                      onClick={() => onExportExcel("products")}
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
                      onClick={() => onExportExcel("customers")}
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
                      onClick={() => onExportExcel("categories")}
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
    </div>
  );
};

export default DashboardReports;
