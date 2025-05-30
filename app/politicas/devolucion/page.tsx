import PoliticasNavSidebar from "@/components/politicas/PoliticasNavCards";
import { AlertCircle, Inbox, RotateCcw, FileMinus } from "lucide-react";

export default function Devolucion() {
  return (
    <div className="px-4 py-12 max-w-[100vw] mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <PoliticasNavSidebar />

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <FileMinus className="h-8 w-8" />
            Política de Devolución
          </h1>

          <p className="text-muted-foreground mb-10 max-w-2xl">
            Nuestro objetivo es que estés completamente satisfecho con tu
            compra. Si algo no está bien, estamos acá para ayudarte. Leé
            detenidamente nuestras condiciones para devoluciones.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Casos aceptados
            </h2>
            <p>Aceptamos devoluciones únicamente en los siguientes casos:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>El producto llegó dañado o defectuoso</li>
              <li>Recibiste un producto distinto al que solicitaste</li>
              <li>Hubo un error en el armado del pedido</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <Inbox className="h-6 w-6" />
              Condiciones para devolución
            </h2>
            <p>Para que podamos aceptar la devolución, es necesario que:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>El producto esté sin uso y en su empaque original</li>
              <li>No hayan pasado más de 7 días desde la entrega</li>
              <li>
                No sea un artículo personalizado (los productos hechos a pedido
                no tienen devolución)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <RotateCcw className="h-6 w-6" />
              Cómo solicitar una devolución
            </h2>
            <p>
              Para iniciar el proceso de devolución, escribinos a{" "}
              <a href="mailto:anvahechoamano@gmail.com" className="underline">
                anvahechoamano@gmail.com
              </a>{" "}
              con los siguientes datos:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Número de pedido</li>
              <li>Motivo de la devolución</li>
              <li>Fotos del producto si aplica</li>
            </ul>
            <p className="mt-2">
              Te responderemos con los pasos a seguir y una etiqueta de envío si
              corresponde.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Reembolsos</h2>
            <p>
              Una vez recibido el producto devuelto y verificado su estado,
              procesaremos el reembolso a través del mismo medio de pago
              utilizado originalmente. Esto puede demorar entre 3 y 10 días
              hábiles según tu banco o entidad.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
