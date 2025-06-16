import PoliticaCard from "@/components/politicas/PoliticaCard";
import PoliticasNavCards from "@/components/politicas/PoliticasNavCards";
import {
  XCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  FileText,
  Info,
  Cookie,
  HelpCircle,
} from "lucide-react";

export default function PoliticasHome() {
  return (
    <div className="px-4 py-12 max-w-[100vw] mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Menú lateral de navegación */}
        <PoliticasNavCards />

        {/* Contenido principal */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Políticas y Términos</h1>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Conocé nuestras políticas de servicio para comprar con tranquilidad:
            entregas, cancelaciones, devoluciones, privacidad, cookies y más.
          </p>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Grupo: Términos y Condiciones */}
            <PoliticaCard
              title="Términos y Condiciones"
              description="Normas generales para el uso del sitio y servicios."
              icon={<FileText className="h-5 w-5" />}
              href="/politicas/terminos"
            />
            <PoliticaCard
              title="Política de Devolución"
              description="Casos aceptados y proceso para devolver productos."
              icon={<RotateCcw className="h-5 w-5" />}
              href="/politicas/devolucion"
            />
            <PoliticaCard
              title="Política de Cancelación"
              description="Condiciones y plazos para cancelar tu compra."
              icon={<XCircle className="h-5 w-5" />}
              href="/politicas/cancelacion"
            />
            <PoliticaCard
              title="Política de Entrega"
              description="Métodos, tiempos y seguimiento de envíos."
              icon={<Truck className="h-5 w-5" />}
              href="/politicas/entrega"
            />
            <PoliticaCard
              title="Métodos de Pago"
              description="Formas de pago disponibles y seguridad."
              icon={<Info className="h-5 w-5" />}
              href="/politicas/pago"
            />

            {/* Grupo: Privacidad */}
            <PoliticaCard
              title="Política de Privacidad"
              description="Cómo manejamos y protegemos tus datos personales."
              icon={<ShieldCheck className="h-5 w-5" />}
              href="/politicas/privacidad"
            />

            {/* Grupo: Otros */}
            <PoliticaCard
              title="Política de Cookies"
              description="Cómo usamos cookies y datos de navegación."
              icon={<Cookie className="h-5 w-5" />}
              href="/politicas/cookies"
            />
            <PoliticaCard
              title="Preguntas Frecuentes (FAQ)"
              description="Consultá respuestas a las dudas más comunes."
              icon={<HelpCircle className="h-5 w-5" />}
              href="/politicas/faq"
            />
          </section>
        </main>
      </div>
    </div>
  );
}
