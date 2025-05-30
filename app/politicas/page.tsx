import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Ban, Truck, RotateCcw } from "lucide-react";

export default function PoliticasPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Nuestras Políticas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/politicas/cancelacion">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Ban className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-lg font-semibold">Cancelación</h2>
              </div>
              <p className="text-gray-700 text-sm">
                Conocé cómo y cuándo podés cancelar un pedido, y en qué casos
                aplican excepciones.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/politicas/entrega">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-lg font-semibold">Entrega</h2>
              </div>
              <p className="text-gray-700 text-sm">
                Detalles sobre tiempos de envío, métodos disponibles y cómo
                seguir tu pedido.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/politicas/devolucion">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <RotateCcw className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-lg font-semibold">Devolución</h2>
              </div>
              <p className="text-gray-700 text-sm">
                Información sobre cómo proceder ante productos defectuosos o
                errores en el envío.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
