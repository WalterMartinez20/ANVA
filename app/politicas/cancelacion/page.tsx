import PoliticasNavSidebar from "@/components/politicas/PoliticasNavCards";
import { Clock3, AlertTriangle, Ban, XCircle } from "lucide-react";

export default function Cancelacion() {
  return (
    <div className="px-4 py-12 max-w-[100vw] mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <PoliticasNavSidebar />

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <XCircle className="h-8 w-8" />
            Política de Cancelación
          </h1>

          <p className="text-muted-foreground mb-10 max-w-2xl">
            Entendemos que pueden surgir imprevistos. Si necesitás cancelar un
            pedido, te explicamos a continuación nuestras condiciones, plazos y
            excepciones para hacerlo de manera clara y transparente.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <Clock3 className="h-6 w-6" />
              Plazo para cancelar
            </h2>
            <p>
              Podés solicitar la cancelación de tu pedido{" "}
              <strong>dentro de las primeras 24 horas</strong> desde que
              realizaste la compra. Este plazo nos permite evitar iniciar la
              preparación o personalización del producto.
            </p>
            <p className="mt-2">
              Pasadas las 24 horas, no podemos garantizar la cancelación, ya que
              el pedido puede haber ingresado al proceso de producción o
              embalaje.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <Ban className="h-6 w-6" />
              Cómo solicitar una cancelación
            </h2>
            <p>
              Para cancelar un pedido, envianos un correo electrónico a{" "}
              <a href="mailto:anvahechoamano@gmail.com" className="underline">
                anvahechoamano@gmail.com
              </a>{" "}
              o escribinos por WhatsApp indicando:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Tu nombre completo</li>
              <li>Número de pedido</li>
              <li>Motivo de la cancelación</li>
            </ul>
            <p className="mt-2">
              Nuestro equipo te responderá lo antes posible para confirmar si la
              cancelación es viable y proceder con el reembolso si corresponde.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              Excepciones importantes
            </h2>
            <p>
              Hay situaciones en las que{" "}
              <strong>no podemos aceptar cancelaciones</strong>, incluso dentro
              del plazo habitual:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Productos personalizados:</strong> una vez iniciado el
                diseño o confección, no es posible cancelar ni modificar el
                pedido.
              </li>
              <li>
                <strong>Pedidos ya despachados:</strong> si tu pedido fue
                enviado, deberás gestionarlo como devolución una vez recibido.
              </li>
              <li>
                <strong>Promociones especiales:</strong> algunas ofertas pueden
                tener condiciones especiales de no cancelación, las cuales se
                informan en la descripción del producto.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              Reembolsos tras cancelación
            </h2>
            <p>
              Si la cancelación es aprobada, el reembolso se realiza a través
              del mismo medio de pago utilizado. Esto puede demorar entre{" "}
              <strong>3 y 10 días hábiles</strong> según el banco o plataforma.
            </p>
            <p className="mt-2">
              En caso de pagos con transferencia, solicitaremos un número de
              cuenta para hacer la devolución de forma directa.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
