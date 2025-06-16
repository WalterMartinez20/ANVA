"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { Banknote, HandCoins } from "lucide-react";

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export function PaymentMethods({
  paymentMethod,
  setPaymentMethod,
  onSubmit,
  loading,
}: PaymentMethodsProps) {
  useEffect(() => {
    const saved = localStorage.getItem("savedPaymentMethod");
    if (saved) {
      setPaymentMethod(saved);
    }
  }, [setPaymentMethod]);
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-white p-6 rounded-md border"
    >
      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="space-y-4"
      >
        {/* Opción: Transferencia bancaria */}
        <PaymentOptionCard
          value="bank-transfer"
          label="Transferencia Bancaria"
          selected={paymentMethod === "bank-transfer"}
          icon={<Banknote className="h-5 w-5 text-muted-foreground" />}
        >
          {paymentMethod === "bank-transfer" && (
            <div className="mt-3 text-sm text-muted-foreground space-y-2">
              <p>Realiza una transferencia a la siguiente cuenta:</p>
              <div className="bg-gray-50 p-3 rounded-md space-y-1 border">
                <p>
                  <span className="font-medium">Banco:</span> Banco Nacional
                </p>
                <p>
                  <span className="font-medium">Titular:</span> Carteras Premium
                  S.A.
                </p>
                <p>
                  <span className="font-medium">Cuenta:</span>{" "}
                  1234-5678-9012-3456
                </p>
                <p>
                  <span className="font-medium">Referencia:</span> Tu número de
                  pedido
                </p>
              </div>
              <p>Procesaremos el pedido una vez confirmado el pago.</p>
            </div>
          )}
        </PaymentOptionCard>

        {/* Opción: Efectivo */}
        <PaymentOptionCard
          value="cash"
          label="Pago en Efectivo (al recoger)"
          selected={paymentMethod === "cash"}
          icon={<HandCoins className="h-5 w-5 text-muted-foreground" />}
        >
          {paymentMethod === "cash" && (
            <p className="mt-3 text-sm text-muted-foreground">
              Podrás pagar en efectivo al momento de retirar tu pedido en
              tienda.
            </p>
          )}
        </PaymentOptionCard>
      </RadioGroup>

      {/* Botón de enviar */}
      <div className="pt-4">
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Procesando...
            </>
          ) : (
            "Completar Pedido"
          )}
        </Button>
      </div>
    </form>
  );
}

function PaymentOptionCard({
  value,
  label,
  selected,
  icon,
  children,
}: {
  value: string;
  label: string;
  selected: boolean;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "border rounded-lg p-4 transition-colors",
        selected ? "border-primary bg-primary/5" : "border-gray-200"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <RadioGroupItem value={value} id={value} />
        <Label htmlFor={value} className="flex items-center gap-2 font-medium">
          {icon}
          {label}
        </Label>
      </div>
      {selected && children && <div className="ml-7">{children}</div>}
    </div>
  );
}
