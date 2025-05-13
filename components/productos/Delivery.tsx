// Bloque con métodos de entrega
import { Store, Truck } from "lucide-react";

export default function DeliveryOptions() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Métodos de entrega disponibles</h3>

      <div className="border rounded-md p-4 flex items-start gap-3">
        <Store className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <p className="font-medium">Retiro en tienda</p>
          <p className="text-sm text-muted-foreground">
            Disponible para retiro en nuestra tienda principal
          </p>
        </div>
      </div>

      <div className="border rounded-md p-4 flex items-start gap-3">
        <Truck className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <p className="font-medium">Envío a domicilio</p>
          <p className="text-sm text-muted-foreground">
            3-5 días hábiles. Envío gratis en compras mayores a $100
          </p>
        </div>
      </div>
    </div>
  );
}
