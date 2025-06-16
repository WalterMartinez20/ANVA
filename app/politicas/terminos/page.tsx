import PoliticasNavSidebar from "@/components/politicas/PoliticasNavCards";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function Terminos() {
  return (
    <div className="px-4 py-12 max-w-[100vw] mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <PoliticasNavSidebar />

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Términos y Condiciones
          </h1>

          <p className="text-muted-foreground mb-6 max-w-2xl">
            Estos términos regulan el uso de nuestro sitio web y la relación
            entre ANVA y sus clientes.
          </p>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Uso del sitio</h2>
            <p>
              Al navegar o comprar en ANVA aceptás nuestras condiciones de uso y
              políticas.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              Obligaciones del cliente
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Brindar datos reales y actualizados.</li>
              <li>Leer las condiciones de cada producto antes de comprar.</li>
              <li>No utilizar el sitio para actividades ilegales.</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
