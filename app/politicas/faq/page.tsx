import PoliticasNavSidebar from "@/components/politicas/PoliticasNavCards";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  return (
    <div className="px-4 py-12 max-w-[100vw] mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <PoliticasNavSidebar />

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <HelpCircle className="h-8 w-8" />
            Preguntas Frecuentes (FAQ)
          </h1>

          <section className="mb-6 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              👜 Sobre los Productos
            </h2>

            <div className="mb-4">
              <h3 className="text-lg font-medium">
                1. ¿De qué materiales están hechos los productos?
              </h3>
              <p className="text-muted-foreground">
                Nuestros productos están hechos de lana 100% natural, trapillo,
                entre otros.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">
                2. ¿Tienen garantía los productos?
              </h3>
              <p className="text-muted-foreground">
                Por el momento se cuenta con 3 días después de recibir el
                producto.
              </p>
            </div>
          </section>

          <section className="mb-6 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">📦 Envíos y Entregas</h2>

            <div className="mb-4">
              <h3 className="text-lg font-medium">
                1. ¿Realizan envíos a todo el país?
              </h3>
              <p className="text-muted-foreground">
                Sí, por puntos de entrega.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium">
                2. ¿Cuánto tarda en llegar mi pedido?
              </h3>
              <p className="text-muted-foreground">
                De 3–5 días hábiles dependiendo de tu lugar de residencia.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">
                3. ¿Cuáles son los costos de envío?
              </h3>
              <p className="text-muted-foreground">
                Los costos se manejan según el lugar al que se envíe el
                producto.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
