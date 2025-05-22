"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  saveInfo: boolean;
  setSaveInfo: React.Dispatch<React.SetStateAction<boolean>>;
  formErrors: Record<string, string>;
}

export function ShippingForm({
  shippingInfo,
  setShippingInfo,
  onSubmit,
  saveInfo,
  setSaveInfo,
  formErrors,
}: ShippingFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={shippingInfo.email}
          onChange={handleChange}
          required
        />
        {formErrors.email && (
          <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            name="firstName"
            value={shippingInfo.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            name="lastName"
            value={shippingInfo.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          name="address"
          value={shippingInfo.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            name="city"
            value={shippingInfo.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado/Provincia</Label>
          <Input
            id="state"
            name="state"
            value={shippingInfo.state}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">Código Postal</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={shippingInfo.zipCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Select
            value={shippingInfo.country}
            onValueChange={(value) => handleSelectChange("country", value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Seleccionar país" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="El Salvador">El Salvador</SelectItem>
              <SelectItem value="Guatemala">Guatemala</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={shippingInfo.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="saveInfo"
          checked={saveInfo}
          onCheckedChange={(checked) => setSaveInfo(checked === true)}
        />
        <Label htmlFor="saveInfo" className="text-sm font-normal">
          Guardar esta información para la próxima compra
        </Label>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" size="lg">
          <span>Continuar al envío</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
