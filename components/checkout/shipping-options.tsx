"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, Truck, Clock } from "lucide-react";
import clsx from "clsx";

interface ShippingOptionsProps {
  shippingMethod: string;
  setShippingMethod: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface Option {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  price: string;
}

const options: Option[] = [
  {
    value: "standard",
    label: "Retiro en tienda",
    description: "Disponible para retiro en nuestra tienda principal",
    icon: <Truck className="h-4 w-4 text-muted-foreground" />,
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

function ShippingOptionCard({
  option,
  selected,
}: {
  option: Option;
  selected: boolean;
}) {
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
