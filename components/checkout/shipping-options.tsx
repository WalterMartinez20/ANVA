"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, Truck, Clock } from "lucide-react";

interface ShippingOptionsProps {
  shippingMethod: string;
  setShippingMethod: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ShippingOptions({
  shippingMethod,
  setShippingMethod,
  onSubmit,
}: ShippingOptionsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <RadioGroup
        value={shippingMethod}
        onValueChange={setShippingMethod}
        className="space-y-3"
      >
        <div
          className={`flex items-center justify-between border rounded-lg p-4 ${
            shippingMethod === "standard"
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="standard" id="standard" />
            <div>
              <Label htmlFor="standard" className="font-medium">
                Envío Estándar
              </Label>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Truck className="h-3.5 w-3.5" />
                <span>3-5 días hábiles</span>
              </div>
            </div>
          </div>
          <span className="font-medium text-green-600">Gratis</span>
        </div>

        <div
          className={`flex items-center justify-between border rounded-lg p-4 ${
            shippingMethod === "priority"
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="priority" id="priority" />
            <div>
              <Label htmlFor="priority" className="font-medium">
                Envío Prioritario
              </Label>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>2-3 días hábiles</span>
              </div>
            </div>
          </div>
          <span className="font-medium">$8.99</span>
        </div>

        <div
          className={`flex items-center justify-between border rounded-lg p-4 ${
            shippingMethod === "express"
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="express" id="express" />
            <div>
              <Label htmlFor="express" className="font-medium">
                Envío Express
              </Label>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>1-2 días hábiles</span>
              </div>
            </div>
          </div>
          <span className="font-medium">$12.99</span>
        </div>
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
