import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MainCategories() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nuestras Categorías
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categoría: Bolsos */}
          <div className="group relative overflow-hidden rounded-lg">
            <img
              src="carteras/H4.png"
              alt="Bolsos"
              className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/10 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Bolsos</h3>
              <p className="text-white mb-4 max-w-md">
                Descubre nuestra exclusiva colección de bolsos artesanales,
                elaborados con los mejores materiales y diseños únicos que
                complementarán tu estilo.
              </p>
              <Button asChild className="w-fit">
                <Link href="categoria/bolsos">Ver Colección</Link>
              </Button>
            </div>
          </div>

          {/* Categoría: Bisutería */}
          <div className="group relative overflow-hidden rounded-lg">
            <img
              src="carteras/E1.png"
              alt="Bisutería"
              className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/10 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Bisutería</h3>
              <p className="text-white mb-4 max-w-md">
                Complementa tu look con nuestra elegante colección de bisutería
                artesanal, piezas únicas que añadirán un toque especial a
                cualquier ocasión.
              </p>
              <Button asChild className="w-fit">
                <Link href="/categoria/bisuteria">Ver Colección</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
