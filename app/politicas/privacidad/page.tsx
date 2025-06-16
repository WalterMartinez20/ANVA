import PoliticasNavSidebar from "@/components/politicas/PoliticasNavCards";
import { ShieldCheck } from "lucide-react";

export default function Privacidad() {
  return (
    <div className="px-4 py-12 max-w-[100vw] mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <PoliticasNavSidebar />

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8" />
            Política de Privacidad
          </h1>

          <section className="mb-6 max-w-2xl">
            <p className="text-muted-foreground mb-4">
              En <strong>ANVA HANDMADE</strong>, nos comprometemos a proteger tu
              privacidad y garantizar el cumplimiento de la normativa vigente
              sobre protección de datos personales, dando fe de no compartir tu
              nombre, números de cuenta, dirección, entre otros. Creemos
              firmemente que la seguridad es vital para una mejor experiencia
              del usuario dentro de nuestro sitio web.
            </p>
            <p className="text-muted-foreground">
              Al utilizar este sitio web <strong>anva.com</strong>, aceptas esta
              política de privacidad.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
