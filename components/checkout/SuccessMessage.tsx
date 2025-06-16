"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { getPaymentLabel, getShippingLabel } from "@/lib/utils";

type Props = {
  order: {
    id: number;
    total: number;
    address: string | null;
    phone: string | null;
    shippingMethod: string | null;
    paymentMethod: string | null;
    createdAt: string;
    items: {
      id: number;
      quantity: number;
      price: number;
      product: {
        name: string;
      };
    }[];
  };
};

export function SuccessMessage({ order }: Props) {
  const router = useRouter();
  const [secondsRemaining, setSecondsRemaining] = useState(15);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (secondsRemaining <= 0) {
      router.push("/pedidos");
      return;
    }

    const countdown = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdown); // detener intervalo cuando llega a 0
          router.push("/pedidos"); // redirigir inmediatamente
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [secondsRemaining, router]);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
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

        <h1 className="text-3xl font-bold text-gray-900">
          ¡Gracias por tu compra!
        </h1>

        <p className="text-gray-700 text-base">
          Tu pedido{" "}
          <span className="font-semibold text-black">#{order.id}</span> ha sido
          recibido. Te enviamos un correo con los detalles.
        </p>

        <p className="text-sm text-muted-foreground">
          Serás redirigido a{" "}
          <span className="font-semibold text-primary">Mis pedidos</span> en{" "}
          <span className="font-semibold text-primary">
            {secondsRemaining} segundos
          </span>
          ...
        </p>

        {/* 🧾 Resumen del pedido */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-4 text-center space-y-4 mt-6 mx-auto max-w-md">
          <h2 className="text-base font-semibold text-gray-900">
            Resumen del Pedido
          </h2>

          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold text-gray-800">Fecha:</span>{" "}
              <span className="text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-800">Dirección:</span>{" "}
              <span className="text-gray-600">
                {order.address || "No proporcionada"}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-800">Teléfono:</span>{" "}
              <span className="text-gray-600">
                {order.phone || "No proporcionado"}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-800">Envío:</span>{" "}
              <span className="text-gray-600">
                {getShippingLabel(order.shippingMethod || "")}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-800">Pago:</span>{" "}
              <span className="text-gray-600">
                {getPaymentLabel(order.paymentMethod || "")}
              </span>
            </p>
          </div>

          <Separator className="my-3" />

          <div className="space-y-1 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-800">
                  {item.quantity}x {item.product?.name || "Producto"}
                </span>
                <span className="text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <Separator className="my-2" />

            <div className="flex justify-between font-bold text-base text-black pt-1">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 🔁 Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button onClick={() => router.push("/")}>Volver a la tienda</Button>
          <Button variant="outline" onClick={() => router.push("/pedidos")}>
            Ver mis pedidos
          </Button>
        </div>
      </div>
    </div>
  );
}
