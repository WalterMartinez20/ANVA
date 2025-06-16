"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { formatPhoneNumber } from "@/lib/utils";

interface ShippingInfo {
  phone: string;
  address: string;
}

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  saveInfo: boolean;
  setSaveInfo: React.Dispatch<React.SetStateAction<boolean>>;
  formErrors: Record<string, string>;
  shippingMethod: string;
  paymentMethod: string;
}

export function ShippingForm({
  shippingInfo,
  setShippingInfo,
  onSubmit,
  saveInfo,
  setSaveInfo,
  formErrors,
  shippingMethod,
  paymentMethod,
}: ShippingFormProps) {
  const { user } = useAuth();

  // Cargar datos guardados al montar
  useEffect(() => {
    const saved = localStorage.getItem("savedShippingInfo");

    if (saved) {
      setShippingInfo(JSON.parse(saved));
      setSaveInfo(true);
    } else if (user?.address || user?.phone) {
      setShippingInfo({
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user, setShippingInfo, setSaveInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === "phone" ? formatPhoneNumber(value) : value;
    setShippingInfo((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (saveInfo) {
      localStorage.setItem("savedShippingInfo", JSON.stringify(shippingInfo));
      localStorage.setItem("savedShippingMethod", shippingMethod);
      localStorage.setItem("savedPaymentMethod", paymentMethod);
    } else {
      localStorage.removeItem("savedShippingInfo");
      localStorage.removeItem("savedShippingMethod");
      localStorage.removeItem("savedPaymentMethod");
    }

    onSubmit(e);
  };

  const renderFieldError = (field: string) =>
    formErrors[field] && (
      <p className="text-sm text-red-500 mt-1">{formErrors[field]}</p>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-md border"
    >
      {/* Datos del usuario (no editables) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" value={user?.nombres || ""} disabled readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            value={user?.apellidos || ""}
            disabled
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            readOnly
          />
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          name="address"
          value={user?.address || ""}
          disabled
          readOnly
        />
        {renderFieldError("address")}
      </div>

      {/* Teléfono */}
      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formatPhoneNumber(user?.phone || "")}
          disabled
          readOnly
        />
        {renderFieldError("phone")}
      </div>

      {/* Guardar info */}
      {/* <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="saveInfo"
          checked={saveInfo}
          onCheckedChange={(checked) => setSaveInfo(checked === true)}
        />
        <Label htmlFor="saveInfo" className="text-sm font-normal">
          Guardar esta información para la próxima compra
        </Label>
      </div> */}

      {/* Botón de envío */}
      <div className="pt-4">
        <Button type="submit" className="w-full" size="lg">
          <span>Continuar al envío</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
