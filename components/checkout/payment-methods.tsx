"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, AlertCircle } from "lucide-react";

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
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="space-y-4"
      >
        <div
          className={`border rounded-lg p-4 ${
            paymentMethod === "credit-card"
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-2 mb-4">
            <RadioGroupItem value="credit-card" id="credit-card" />
            <Label
              htmlFor="credit-card"
              className="flex items-center gap-2 font-medium"
            >
              <CreditCard className="h-5 w-5" />
              <span>Tarjeta de Crédito/Débito</span>
            </Label>
          </div>

          {paymentMethod === "credit-card" && (
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="card-number">Número de Tarjeta</Label>
                <Input
                  id="card-number"
                  name="number"
                  placeholder="1234 5678 9012 3456"
                  value={cardInfo.number}
                  onChange={handleCardInfoChange}
                  required={paymentMethod === "credit-card"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-name">Nombre en la Tarjeta</Label>
                <Input
                  id="card-name"
                  name="name"
                  placeholder="Juan Pérez"
                  value={cardInfo.name}
                  onChange={handleCardInfoChange}
                  required={paymentMethod === "credit-card"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-expiry">Fecha de Expiración</Label>
                  <Input
                    id="card-expiry"
                    name="expiry"
                    placeholder="MM/AA"
                    value={cardInfo.expiry}
                    onChange={handleCardInfoChange}
                    required={paymentMethod === "credit-card"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input
                    id="card-cvc"
                    name="cvc"
                    placeholder="123"
                    value={cardInfo.cvc}
                    onChange={handleCardInfoChange}
                    required={paymentMethod === "credit-card"}
                  />
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 gap-2 mt-2">
                <AlertCircle className="h-4 w-4" />
                <span>Tus datos de pago están seguros y encriptados</span>
              </div>
            </div>
          )}
        </div>

        <div
          className={`border rounded-lg p-4 ${
            paymentMethod === "paypal"
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label
              htmlFor="paypal"
              className="flex items-center gap-2 font-medium"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7.5 19.5H3.5L5 8.5H9C11.5 8.5 12.5 10 12 12C11.5 14 9.5 14.5 7.5 14.5H6L7 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 19.5H9.5L11 8.5H15C17.5 8.5 18.5 10 18 12C17.5 14 15.5 14.5 13.5 14.5H12L13 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>PayPal</span>
            </Label>
          </div>

          {paymentMethod === "paypal" && (
            <div className="mt-4 text-sm text-gray-600">
              <p>
                Serás redirigido a PayPal para completar tu pago de forma
                segura.
              </p>
            </div>
          )}
        </div>

        <div
          className={`border rounded-lg p-4 ${
            paymentMethod === "bank-transfer"
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
            <Label
              htmlFor="bank-transfer"
              className="flex items-center gap-2 font-medium"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 21H21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 7H21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 11H10V17H6V11Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 11H18V17H14V11Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 7L12 3L20 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Transferencia Bancaria</span>
            </Label>
          </div>

          {paymentMethod === "bank-transfer" && (
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>Realiza una transferencia a la siguiente cuenta bancaria:</p>
              <div className="space-y-1 bg-gray-50 p-3 rounded-md">
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
              <p>Tu pedido será procesado una vez confirmemos el pago.</p>
            </div>
          )}
        </div>
      </RadioGroup>

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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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
