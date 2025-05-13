import { Shield, Truck, CreditCard, RefreshCw } from "lucide-react";

export function TrustIndicators() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center text-center p-4 border rounded-lg">
        <Shield className="h-6 w-6 mb-2 text-primary" />
        <h3 className="font-medium text-sm">Compra Segura</h3>
        <p className="text-xs text-gray-500 mt-1">Tus datos están protegidos</p>
      </div>

      <div className="flex flex-col items-center text-center p-4 border rounded-lg">
        <Truck className="h-6 w-6 mb-2 text-primary" />
        <h3 className="font-medium text-sm">Envío Rápido</h3>
        <p className="text-xs text-gray-500 mt-1">A todo el país</p>
      </div>

      <div className="flex flex-col items-center text-center p-4 border rounded-lg">
        <CreditCard className="h-6 w-6 mb-2 text-primary" />
        <h3 className="font-medium text-sm">Pago Seguro</h3>
        <p className="text-xs text-gray-500 mt-1">Múltiples métodos</p>
      </div>

      <div className="flex flex-col items-center text-center p-4 border rounded-lg">
        <RefreshCw className="h-6 w-6 mb-2 text-primary" />
        <h3 className="font-medium text-sm">Devolución Fácil</h3>
        <p className="text-xs text-gray-500 mt-1">30 días de garantía</p>
      </div>
    </div>
  );
}
