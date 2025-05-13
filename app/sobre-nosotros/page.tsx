import { Card, CardContent } from "@/components/ui/card";
import { Heart, Award, Clock, Users, MapPin } from "lucide-react";

export default function SobreNosotrosPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Sobre Nosotros</h1>

        <div className="mb-12">
          <div className="aspect-video rounded-lg overflow-hidden mb-8">
            <img
              src="/placeholder.svg?height=400&width=800&text=Nuestra+Historia"
              alt="Nuestra Historia"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-4">Nuestra Historia</h2>
          <p className="text-gray-700 mb-4">
            Fundada en 2010, Carteras Artesanales nació de la pasión por la
            artesanía y el diseño de accesorios únicos. Lo que comenzó como un
            pequeño taller familiar se ha convertido en una marca reconocida por
            la calidad y originalidad de sus productos.
          </p>
          <p className="text-gray-700 mb-4">
            Cada uno de nuestros productos es elaborado con dedicación y
            atención al detalle, utilizando técnicas tradicionales combinadas
            con diseños contemporáneos. Nos enorgullece ofrecer piezas que no
            solo son funcionales, sino también expresiones artísticas que
            reflejan la rica tradición artesanal de nuestra región.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Heart className="h-5 w-5 text-primary mr-2" />
                Nuestra Misión
              </h3>
              <p className="text-gray-700">
                Crear productos artesanales de la más alta calidad que combinen
                funcionalidad, estética y sostenibilidad, promoviendo el trabajo
                artesanal y contribuyendo al desarrollo de las comunidades
                locales.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="h-5 w-5 text-primary mr-2" />
                Nuestra Visión
              </h3>
              <p className="text-gray-700">
                Ser reconocidos globalmente como una marca líder en accesorios
                artesanales, valorada por su compromiso con la excelencia, la
                innovación y la responsabilidad social y ambiental.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Nuestros Valores</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg p-5">
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Calidad</h3>
              </div>
              <p className="text-sm text-gray-600">
                Nos comprometemos a utilizar los mejores materiales y técnicas
                para crear productos duraderos y de alta calidad.
              </p>
            </div>

            <div className="border rounded-lg p-5">
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Pasión</h3>
              </div>
              <p className="text-sm text-gray-600">
                Amamos lo que hacemos y ponemos nuestro corazón en cada pieza
                que creamos.
              </p>
            </div>

            <div className="border rounded-lg p-5">
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Comunidad</h3>
              </div>
              <p className="text-sm text-gray-600">
                Apoyamos a los artesanos locales y contribuimos al desarrollo de
                nuestras comunidades.
              </p>
            </div>

            <div className="border rounded-lg p-5">
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Tradición</h3>
              </div>
              <p className="text-sm text-gray-600">
                Preservamos y honramos las técnicas artesanales tradicionales
                que han sido transmitidas por generaciones.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Nuestro Equipo</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: "María González",
                role: "Fundadora y Directora Creativa",
              },
              { name: "Carlos Rodríguez", role: "Maestro Artesano" },
              { name: "Ana Martínez", role: "Diseñadora" },
              { name: "Juan Pérez", role: "Gerente de Producción" },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="aspect-square rounded-full overflow-hidden mb-4 mx-auto max-w-[150px]">
                  <img
                    src={`/placeholder.svg?height=150&width=150${
                      member.name.split(" ")[0]
                    }`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Nuestra Ubicación</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=400&text=Mapa"
                  alt="Ubicación de nuestra tienda"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold">Dirección</h3>
                    <p className="text-gray-700">
                      Puerto El Triunfo, Puerto El Triunfo, El Salvador
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold">Horario de Atención</h3>
                    <p className="text-gray-700">
                      Lunes a Viernes: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-700">Sábados: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-700">Domingos: Cerrado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
