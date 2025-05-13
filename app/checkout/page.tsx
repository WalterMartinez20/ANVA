"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Shield, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { OrderSummary } from "@/components/checkout/order-summary";
import { ShippingForm } from "@/components/checkout/shipping-form";
import { PaymentMethods } from "@/components/checkout/payment-methods";
import { TrustIndicators } from "@/components/checkout/trust-indicators";
import { ShippingOptions } from "@/components/checkout/shipping-options";

// Datos de ejemplo para simular productos en el carrito
const cartItems = [
  {
    id: 1,
    name: "Cartera de Cuero Premium",
    price: 89.99,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
    options: "Color: Negro, Tamaño: Mediano",
  },
  {
    id: 2,
    name: "Billetera Minimalista",
    price: 39.99,
    quantity: 2,
    image: "/placeholder.svg?height=80&width=80",
    options: "Color: Marrón, Personalización: Iniciales",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("information");
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Estados Unidos",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [saveInfo, setSaveInfo] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Calcular totales
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping =
    shippingMethod === "express"
      ? 12.99
      : shippingMethod === "priority"
      ? 8.99
      : 0;
  const tax = subtotal * 0.07; // 7% de impuesto
  const total = subtotal + shipping + tax;

  const handleInformationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!shippingInfo.firstName) errors.firstName = "Nombre requerido";
    if (!shippingInfo.lastName) errors.lastName = "Apellido requerido";
    if (!shippingInfo.email || !/\S+@\S+\.\S+/.test(shippingInfo.email))
      errors.email = "Correo inválido";
    if (!shippingInfo.phone) errors.phone = "Teléfono requerido";
    if (!shippingInfo.address) errors.address = "Dirección requerida";
    if (!shippingInfo.city) errors.city = "Ciudad requerida";
    if (!shippingInfo.state) errors.state = "Estado requerido";
    if (!shippingInfo.zipCode) errors.zipCode = "Código postal requerido";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Información incompleta",
        description: "Por favor corrige los errores en el formulario.",
        variant: "destructive",
      });
      return;
    }

    setFormErrors({});
    setCurrentStep("shipping");
  };

  const handleShippingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simular procesamiento de pedido
    setTimeout(() => {
      setLoading(false);
      setOrderProcessed(true);
      toast({
        title: "¡Pedido realizado con éxito!",
        description: "Recibirás un correo con los detalles de tu compra.",
      });
    }, 2000);
  };

  if (orderProcessed) {
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
            <Button
              variant="outline"
              onClick={() => router.push("/account/orders")}
            >
              Ver mis pedidos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between max-w-md mb-8">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "information" ||
                currentStep === "shipping" ||
                currentStep === "payment"
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="text-xs mt-1">Información</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div
              className={`h-full ${
                currentStep === "shipping" || currentStep === "payment"
                  ? "bg-primary"
                  : "bg-gray-200"
              }`}
              style={{ width: currentStep === "information" ? "0%" : "100%" }}
            ></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "shipping" || currentStep === "payment"
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="text-xs mt-1">Envío</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div
              className={`h-full ${
                currentStep === "payment" ? "bg-primary" : "bg-gray-200"
              }`}
              style={{
                width:
                  currentStep === "shipping" || currentStep === "payment"
                    ? currentStep === "payment"
                      ? "100%"
                      : "0%"
                    : "0%",
              }}
            ></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "payment"
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
            >
              3
            </div>
            <span className="text-xs mt-1">Pago</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          {currentStep === "information" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Información de Contacto
                </h2>
                <ShippingForm
                  shippingInfo={shippingInfo}
                  setShippingInfo={setShippingInfo}
                  onSubmit={handleInformationSubmit}
                  saveInfo={saveInfo}
                  setSaveInfo={setSaveInfo}
                  formErrors={formErrors}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === "shipping" && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Método de Envío</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep("information")}
                    className="h-8 text-sm"
                  >
                    Editar información
                  </Button>
                </div>

                <div className="bg-gray-50 p-3 rounded-md mb-6">
                  <p className="font-medium">Enviar a:</p>
                  <p className="text-sm text-gray-600">
                    {shippingInfo.firstName} {shippingInfo.lastName},{" "}
                    {shippingInfo.address}, {shippingInfo.city},{" "}
                    {shippingInfo.state} {shippingInfo.zipCode},{" "}
                    {shippingInfo.country}
                  </p>
                </div>

                <ShippingOptions
                  shippingMethod={shippingMethod}
                  setShippingMethod={setShippingMethod}
                  onSubmit={handleShippingSubmit}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === "payment" && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Método de Pago</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep("shipping")}
                    className="h-8 text-sm"
                  >
                    Editar envío
                  </Button>
                </div>

                <div className="bg-gray-50 p-3 rounded-md mb-6">
                  <p className="font-medium">Método de envío:</p>
                  <div className="flex items-center mt-1">
                    {shippingMethod === "standard" && (
                      <>
                        <Truck className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          Envío Estándar (3-5 días hábiles) - Gratis
                        </span>
                      </>
                    )}
                    {shippingMethod === "priority" && (
                      <>
                        <Clock className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          Envío Prioritario (2-3 días hábiles) - $8.99
                        </span>
                      </>
                    )}
                    {shippingMethod === "express" && (
                      <>
                        <Clock className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          Envío Express (1-2 días hábiles) - $12.99
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <PaymentMethods
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  onSubmit={handlePaymentSubmit}
                  loading={loading}
                />
              </CardContent>
            </Card>
          )}

          <TrustIndicators />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-6 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Resumen del Pedido
                </h2>
                <OrderSummary
                  items={cartItems}
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                />

                {currentStep !== "payment" && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>Tiempo estimado de entrega:</span>
                      <span className="font-medium">
                        {shippingMethod === "express"
                          ? "1-2 días hábiles"
                          : shippingMethod === "priority"
                          ? "2-3 días hábiles"
                          : "3-5 días hábiles"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Shield className="h-4 w-4" />
                      <span>Garantía de devolución de 30 días</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingBag className="h-5 w-5 text-gray-700" />
                <h3 className="font-medium">¿Necesitas ayuda?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Nuestro equipo de atención al cliente está disponible para
                ayudarte con cualquier pregunta.
              </p>
              <div className="text-sm">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <a
                    href="mailto:anvahechoamano@gmail.com"
                    className="text-primary hover:underline"
                  >
                    anvahechoamano@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Teléfono:</span>
                  <a
                    href="tel:+50378659463"
                    className="text-primary hover:underline"
                  >
                    +503 7865 9463
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
