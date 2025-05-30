// components/checkout/success-message.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";

type Props = {
  total: number;
};

export function SuccessMessage({ total }: Props) {
  const router = useRouter();
  const { items: cartItems } = useCart();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold">¡Gracias por tu compra!</h1>
        <p className="text-gray-600">
          Tu pedido #12345 ha sido procesado correctamente. Hemos enviado un
          correo electrónico con los detalles de tu compra.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="font-semibold mb-2">Resumen del pedido</h2>
          <p className="text-sm text-gray-600 mb-4">
            Fecha de compra: {new Date().toLocaleDateString()}
          </p>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push("/")}>Volver a la tienda</Button>
          <Button variant="outline" onClick={() => router.push("/pedidos")}>
            Ver mis pedidos
          </Button>
        </div>
      </div>
    </div>
  );
}
