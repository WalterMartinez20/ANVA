import { Info } from "lucide-react";

export default function NosotrosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Info className="h-8 w-8" />
        Sobre Nosotros
      </h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Nuestra Historia</h2>
          <p>
            E-Store nació en 2010 con la visión de revolucionar el comercio
            electrónico en nuestra región. Desde entonces, hemos crecido para
            convertirnos en uno de los líderes del mercado, sirviendo a millones
            de clientes con una amplia gama de productos de alta calidad.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Nuestra Misión</h2>
          <p>
            Nuestra misión es proporcionar a nuestros clientes una experiencia
            de compra en línea excepcional, ofreciendo productos de calidad a
            precios competitivos y un servicio al cliente de primera clase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Nuestros Valores</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Integridad en todas nuestras acciones</li>
            <li>Compromiso con la satisfacción del cliente</li>
            <li>Innovación continua en nuestros servicios</li>
            <li>Responsabilidad social y ambiental</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Nuestro Equipo</h2>
          <p>
            Contamos con un equipo diverso y talentoso de profesionales
            dedicados a hacer de E-Store la mejor plataforma de comercio
            electrónico. Nuestros empleados son el corazón de nuestra empresa y
            la clave de nuestro éxito.
          </p>
        </section>
      </div>
    </div>
  );
}
