import { ProductMaterial } from "@/types/producto_admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, List, Star } from "lucide-react";
import PaymentMethods from "@/components/productos/PaymentMethods";
import DeliveryOptions from "@/components/productos/Delivery";
import Reviews from "@/components/productos/Reviews";

interface TabsProps {
  description?: string | null;
  materials: ProductMaterial[];
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  strapDescription?: string | null;
  materialInfo?: string | null;
}

export default function ProductTabs({
  description,
  materials,
  width,
  height,
  depth,
  strapDescription,
  materialInfo,
}: TabsProps) {
  return (
    <div className="mt-12 w-full bg-white">
      {/* <div className="w-full max-w-screen-xl mx-auto"> */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="flex border-b border-gray-300 bg-gray-100 p-0">
          {[
            { value: "description", label: "Descripción", icon: Info },
            { value: "details", label: "Detalles", icon: List },
            // { value: "payment", label: "Pago y Envío", icon: CreditCard },
            { value: "reviews", label: "Reseñas", icon: Star },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-1 text-center py-3 text-sm font-semibold text-gray-700
                  border-b-2 border-transparent data-[state=active]:border-primary
                  data-[state=active]:text-primary hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="w-full max-w-screen-xl mx-auto">
          {/* Descripción */}
          <TabsContent value="description" className="pt-6 px-4 md:px-8">
            <div className="text-base text-gray-800 leading-relaxed text-justify">
              {description ||
                "No hay descripción disponible para este producto."}
            </div>
          </TabsContent>

          {/* Detalles estilo tabla profesional */}
          <TabsContent value="details" className="pt-6 px-4 md:px-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Especificaciones técnicas
            </h3>
            {materials?.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 rounded-md">
                <table className="w-full table-fixed text-sm text-gray-800">
                  <tbody>
                    {strapDescription && (
                      <tr className="bg-white">
                        <td className="px-5 py-3 w-1/2 font-medium text-left align-middle">
                          Descripción del asa
                        </td>
                        <td className="px-5 py-3 text-left align-middle">
                          {strapDescription}
                        </td>
                      </tr>
                    )}

                    {(width || height || depth) && (
                      <tr className="bg-gray-50">
                        <td className="px-5 py-3 w-1/2 font-medium text-left align-middle">
                          Dimensiones
                        </td>
                        <td className="px-5 py-3 text-left align-middle">
                          {[
                            width && `${width}cm de ancho`,
                            height && `${height}cm de alto`,
                            depth && `${depth}cm de profundidad`,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </td>
                      </tr>
                    )}

                    {materialInfo && (
                      <tr className="bg-white">
                        <td className="px-5 py-3 w-1/2 font-medium text-left align-middle">
                          Materiales
                        </td>
                        <td className="px-5 py-3 text-left align-middle">
                          {materialInfo}
                        </td>
                      </tr>
                    )}

                    {materials.map((productMaterial, index) => (
                      <tr
                        key={productMaterial.materialId}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        {/* <td className="px-5 py-3 w-1/2 font-medium text-left align-middle">
                          {productMaterial.material.name}
                        </td>
                        <td className="px-5 py-3 text-left align-middle">
                          {productMaterial.quantity}{" "}
                          {productMaterial.material.unit || "unidades"}
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No hay detalles técnicos disponibles para este producto.</p>
            )}
          </TabsContent>

          {/* Pago y envío */}
          <TabsContent value="payment" className="pt-6 px-4 md:px-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Aceptamos estas opciones de pago
                </h3>
                <PaymentMethods />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Opciones de entrega disponibles
                </h3>
                <DeliveryOptions />
              </div>
            </div>
          </TabsContent>

          {/* Reseñas */}
          <TabsContent value="reviews" className="pt-6 px-4 md:px-8">
            <Reviews
              average={4.2} // Aquí puedes ajustar según tus datos reales
              reviews={[
                {
                  id: 1,
                  name: "Juan",
                  date: "2024-04-22",
                  rating: 5,
                  comment: "Excelente producto, muy recomendado!",
                },
                {
                  id: 2,
                  name: "Ana",
                  date: "2024-04-10",
                  rating: 4,
                  comment: "Muy buena calidad, aunque tardó un poco en llegar.",
                },
              ]}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
