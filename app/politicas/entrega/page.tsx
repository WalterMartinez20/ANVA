import PoliticasNavSidebar from "@/components/politicas/PoliticasNavCards";
import { Clock3, Truck, LocateFixed, TruckIcon } from "lucide-react";

export default function Entrega() {
  return (
    <div className="px-4 py-12 max-w-[100vw] mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <PoliticasNavSidebar />

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <TruckIcon className="h-8 w-8" />
            Política de Entrega
          </h1>

          <p className="text-muted-foreground mb-10 max-w-2xl">
            En Anva, nos comprometemos a entregar tus productos de forma
            eficiente, segura y a tiempo. Aquí encontrarás todo lo que necesitás
            saber sobre nuestros métodos, plazos y seguimiento de envíos.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <Clock3 className="h-6 w-6" />
              Tiempo de procesamiento y entrega
            </h2>
            <p>
              Todos los pedidos se procesan dentro de un plazo estimado de{" "}
              <strong>2 a 5 días hábiles</strong>. En el caso de productos
              personalizados, este tiempo puede extenderse, dependiendo de la
              complejidad del diseño.
            </p>
            <p className="mt-2">
              Una vez despachado el pedido, el tiempo de entrega dependerá del
              destino y el método de envío seleccionado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <Truck className="h-6 w-6" />
              Métodos de envío
            </h2>
            <p>
              Ofrecemos distintas opciones de envío para adaptarnos a tus
              necesidades:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Mensajería local (disponible solo en zonas seleccionadas)</li>
              <li>Correo nacional (OCA, Correo Argentino, etc.)</li>
              <li>Retiro en tienda/taller (con cita previa)</li>
            </ul>
            <p className="mt-2">
              El envío es gratuito para pedidos superiores a{" "}
              <strong>$40.000</strong>. Para montos menores, el costo se calcula
              automáticamente al finalizar la compra.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <LocateFixed className="h-6 w-6" />
              Seguimiento del pedido
            </h2>
            <p>
              Una vez que tu pedido haya sido despachado, recibirás un correo
              electrónico o mensaje de WhatsApp con el número de seguimiento
              correspondiente. Podrás verificar el estado del envío directamente
              en el sitio web del transportista.
            </p>
            <p className="mt-2">
              Si no recibiste el número de seguimiento en un plazo razonable, no
              dudes en contactarnos para ayudarte.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              Retrasos y excepciones
            </h2>
            <p>
              En ocasiones excepcionales, pueden ocurrir demoras por causas
              ajenas a nuestro control, como feriados, condiciones climáticas o
              demoras en los servicios de transporte. Agradecemos tu paciencia
              en estos casos.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
