"use client";

import { useState } from "react";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-provider";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { colorMap } from "@/lib/colorMap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStockCheck } from "@/hooks/productos/useStockCheck";

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen,
    totalItems,
    totalPrice,
  } = useCart();
  const { isAuthenticated, isGuest } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { checkStock } = useStockCheck();

  const handleCheckout = async () => {
    if (isGuest || !isAuthenticated) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Debes iniciar sesión para realizar la compra",
      });
      setIsOpen(false);
      router.push("/login");
      return;
    }

    const minimalCartItems = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const stockResult = await checkStock(minimalCartItems);

    if (!stockResult.ok) {
      toast({
        title: "Problema con stock",
        description: stockResult.error,
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    setTimeout(() => {
      router.push("/checkout");
      setIsOpen(false);
      setIsCheckingOut(false);
    }, 1000);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Carrito */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Cabecera */}
          <div className="flex justify-between items-center p-4 border-b">
            {/* Izquierda: ícono, título y contador */}
            <div className="flex items-center gap-3 flex-wrap">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-lg">Carrito de Compras</h2>
              <span className="bg-primary text-white text-xs font-medium rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            </div>

            {/* Derecha: acciones */}
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={clearCart}
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hidden sm:inline-flex"
                        aria-label="Vaciar carrito"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <span>Vaciar carrito</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
                <p className="text-sm text-gray-400 mb-4">
                  Parece que aún no has añadido ningún producto a tu carrito
                </p>
                <Button onClick={() => setIsOpen(false)}>
                  Continuar Comprando
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.customization}`}
                    className="flex gap-3 border-b pb-4"
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2">
                        {item.name}
                      </h3>
                      {item.customization &&
                        (() => {
                          const colorName = item.customization
                            ?.split(":")[1]
                            ?.trim()
                            .toLowerCase();
                          const colorValue = colorMap[colorName] || "#ccc";

                          return (
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: colorValue }}
                              />
                              <p className="text-xs text-gray-500 italic">
                                {item.customization}
                              </p>
                            </div>
                          );
                        })()}
                      <p className="text-primary font-bold mt-1">
                        ${item.price.toFixed(2)}
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.customization,
                                item.quantity - 1
                              )
                            }
                            className="px-2 py-1 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.customization,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.id, item.customization)
                          }
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pie */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>Calculado en el checkout</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Procesando..." : "Proceder al pago"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
