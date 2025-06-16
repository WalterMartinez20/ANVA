"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, Clock, Store } from "lucide-react";
import clsx from "clsx";

interface ShippingOptionsProps {
  shippingMethod: string;
  setShippingMethod: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const options = [
  {
    value: "store-pickup",
    label: "Recoger en tienda",
    description: "Disponible para retiro en nuestra tienda principal",
    icon: <Store className="h-4 w-4 text-muted-foreground" />,
    price: "Gratis",
  },
  {
    value: "priority",
    label: "Envío Prioritario",
    description: "2-3 días hábiles",
    icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    price: "$8.99",
  },
  {
    value: "express",
    label: "Envío Express",
    description: "1-2 días hábiles",
    icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    price: "$12.99",
  },
];

function ShippingOptionCard({ option, selected }: any) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between border rounded-lg p-4 transition-colors",
        selected ? "border-primary bg-primary/5" : "border-gray-200"
      )}
    >
      <div className="flex items-center gap-3">
        <RadioGroupItem value={option.value} id={option.value} />
        <div>
          <Label htmlFor={option.value} className="font-medium">
            {option.label}
          </Label>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            {option.icon}
            <span>{option.description}</span>
          </div>
        </div>
      </div>
      <span className="font-medium text-sm text-gray-800">{option.price}</span>
    </div>
  );
}

export function ShippingOptions({
  shippingMethod,
  setShippingMethod,
  onSubmit,
}: ShippingOptionsProps) {
  // ✅ Asignar valor inicial si está vacío
  useEffect(() => {
    const saved = localStorage.getItem("savedShippingMethod");

    if (saved) {
      setShippingMethod(saved);
    } else {
      setShippingMethod(options[0].value);
      localStorage.setItem("savedShippingMethod", options[0].value);
    }
  }, []);

  useEffect(() => {
    if (shippingMethod) {
      localStorage.setItem("savedShippingMethod", shippingMethod);
    }
  }, [shippingMethod]);

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-white p-6 rounded-md border"
    >
      <RadioGroup
        value={shippingMethod}
        onValueChange={setShippingMethod}
        className="space-y-3"
      >
        {options.map((opt) => (
          <ShippingOptionCard
            key={opt.value}
            option={opt}
            selected={shippingMethod === opt.value}
          />
        ))}
      </RadioGroup>

      <div className="pt-4">
        <Button type="submit" className="w-full" size="lg">
          <span>Continuar al pago</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
