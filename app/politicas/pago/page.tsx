import PoliticasNavSidebar from "@/components/politicas/PoliticasNavCards";
import { Info } from "lucide-react";
import Link from "next/link";

export default function Pago() {
  return (
    <div className="px-4 py-12 max-w-[100vw] mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <PoliticasNavSidebar />

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Info className="h-8 w-8" />
            Métodos de Pago
          </h1>

          <p className="text-muted-foreground mb-6 max-w-2xl">
            Ofrecemos distintas formas de pago para tu comodidad.
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>Transferencia bancaria (Cuentas locales)</li>
            <li>
              Pago por tarjeta de crédito y débito (a través de plataforma
              segura)
            </li>
            <li>Pago contra entrega (válido solo en zonas específicas)</li>
          </ul>
        </main>
      </div>
    </div>
  );
}
