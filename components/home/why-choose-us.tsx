import { Heart, Award, Truck, RefreshCw } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          ¿Por Qué Elegirnos?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hecho a Mano</h3>
            <p className="text-gray-600">
              Cada pieza es elaborada artesanalmente con dedicación y atención
              al detalle, asegurando productos únicos y de alta calidad.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Materiales Premium</h3>
            <p className="text-gray-600">
              Utilizamos solo los mejores materiales, cuidadosamente
              seleccionados para garantizar durabilidad y belleza en cada
              producto.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
            <p className="text-gray-600">
              Procesamos y enviamos tu pedido en tiempo récord, con opciones de
              entrega que se adaptan a tus necesidades.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <RefreshCw className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Garantía de Satisfacción
            </h3>
            <p className="text-gray-600">
              Tu satisfacción es nuestra prioridad. Ofrecemos garantía en todos
              nuestros productos y un excelente servicio al cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
