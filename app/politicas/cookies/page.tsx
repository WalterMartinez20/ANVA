import PoliticasNavSidebar from "@/components/politicas/PoliticasNavCards";
import { Cookie } from "lucide-react";

export default function Cookies() {
  return (
    <div className="px-4 py-12 max-w-[100vw] mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <PoliticasNavSidebar />

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Cookie className="h-8 w-8" />
            Política de Cookies
          </h1>

          <section className="mb-6 max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">
              ¿Qué son las cookies?
            </h2>
            <p className="text-muted-foreground">
              Una cookie es un pequeño archivo de texto que los sitios web
              colocan en tu dispositivo al visitarlos. Se utilizan para recordar
              información sobre tu visita, como tus preferencias o acciones
              anteriores en el sitio.
            </p>
          </section>

          <section className="mb-6 max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">
              Tipos de cookies utilizadas
            </h2>

            <h3 className="font-semibold mt-4">
              Cookies técnicas o necesarias
            </h3>
            <p className="text-muted-foreground">
              Son esenciales para el funcionamiento del sitio web y no requieren
              consentimiento. Permiten, por ejemplo, el inicio de sesión o la
              navegación segura.
            </p>

            <h3 className="font-semibold mt-4">
              Cookies de análisis o rendimiento
            </h3>
            <p className="text-muted-foreground">
              Recogen información anónima sobre el uso del sitio para mejorar su
              funcionamiento.
            </p>

            <h3 className="font-semibold mt-4">Cookies de personalización</h3>
            <p className="text-muted-foreground">
              Permiten recordar tus preferencias (como el idioma o región) para
              ofrecer una experiencia personalizada.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
