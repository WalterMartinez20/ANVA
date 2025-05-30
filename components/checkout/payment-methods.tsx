"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, AlertCircle } from "lucide-react";
import clsx from "clsx";

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
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-white p-6 rounded-md border"
    >
      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="space-y-4"
      >
        {/* Credit/Debit Card */}
        <div
          className={clsx(
            "border rounded-lg p-4",
            paymentMethod === "credit-card"
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <RadioGroupItem value="credit-card" id="credit-card" />
            <Label
              htmlFor="credit-card"
              className="flex items-center gap-2 font-medium"
            >
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              Tarjeta de Crédito/Débito
            </Label>
          </div>

          {paymentMethod === "credit-card" && (
            <div className="space-y-4 mt-2">
              <InputGroup
                id="card-number"
                name="number"
                label="Número de Tarjeta"
                placeholder="1234 5678 9012 3456"
                value={cardInfo.number}
                onChange={handleCardInfoChange}
              />
              <InputGroup
                id="card-name"
                name="name"
                label="Nombre en la Tarjeta"
                placeholder="Juan Pérez"
                value={cardInfo.name}
                onChange={handleCardInfoChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  id="card-expiry"
                  name="expiry"
                  label="Fecha de Expiración"
                  placeholder="MM/AA"
                  value={cardInfo.expiry}
                  onChange={handleCardInfoChange}
                />
                <InputGroup
                  id="card-cvc"
                  name="cvc"
                  label="CVC"
                  placeholder="123"
                  value={cardInfo.cvc}
                  onChange={handleCardInfoChange}
                />
              </div>

              <div className="flex items-center text-sm text-muted-foreground gap-2 mt-2">
                <AlertCircle className="h-4 w-4" />
                Tus datos de pago están seguros y encriptados.
              </div>
            </div>
          )}
        </div>

        {/* PayPal */}
        <PaymentOptionCard
          value="paypal"
          label="PayPal"
          selected={paymentMethod === "paypal"}
        >
          <svg
            className="h-5 w-5 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.5 19.5H3.5L5 8.5H9C11.5 8.5 12.5 10 12 12C11.5 14 9.5 14.5 7.5 14.5H6L7 10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M13.5 19.5H9.5L11 8.5H15C17.5 8.5 18.5 10 18 12C17.5 14 15.5 14.5 13.5 14.5H12L13 10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {paymentMethod === "paypal" && (
            <p className="mt-3 text-sm text-muted-foreground">
              Serás redirigido a PayPal para completar tu pago de forma segura.
            </p>
          )}
        </PaymentOptionCard>

        {/* Bank Transfer */}
        <PaymentOptionCard
          value="bank-transfer"
          label="Transferencia Bancaria"
          selected={paymentMethod === "bank-transfer"}
        >
          <svg
            className="h-5 w-5 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M3 21H21" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M6 11H10V17H6V11Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M14 11H18V17H14V11Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M4 7L12 3L20 7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {paymentMethod === "bank-transfer" && (
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>Realiza una transferencia a la siguiente cuenta:</p>
              <div className="bg-gray-50 p-3 rounded-md space-y-1">
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
      </RadioGroup>

      {/* Submit */}
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

function InputGroup({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

function PaymentOptionCard({
  value,
  label,
  selected,
  children,
  ...props
}: {
  value: string;
  label: string;
  selected: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "border rounded-lg p-4 transition-colors",
        selected ? "border-primary bg-primary/5" : "border-gray-200"
      )}
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value={value} id={value} />
        <Label htmlFor={value} className="flex items-center gap-2 font-medium">
          {props.children?.[0]}
          {label}
        </Label>
      </div>
      {children && <div className="ml-7">{children}</div>}
    </div>
  );
}
