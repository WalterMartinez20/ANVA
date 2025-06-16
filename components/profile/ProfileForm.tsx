// * Contiene el formulario editable de información personal del usuario (nombre, email, dirección, etc.).

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { formatPhoneNumber } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Profile {
  nombres: string;
  apellidos: string;
  email: string;
  phone: string;
  address: string;
}

interface ProfileFormProps {
  profile: Profile;
  handleInputChange: (field: keyof Profile, value: any) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  handleInputChange,
}) => {
  return (
    <Card className="shadow-md border border-gray-100 bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="nombres"
              className="text-sm font-medium text-gray-700"
            >
              Nombre(s)
            </Label>
            <Input
              id="nombres"
              value={profile.nombres}
              onChange={(e) => handleInputChange("nombres", e.target.value)}
              placeholder="Ingresa tu nombre"
              className="mt-1"
            />
          </div>
          <div>
            <Label
              htmlFor="apellidos"
              className="text-sm font-medium text-gray-700"
            >
              Apellidos
            </Label>
            <Input
              id="apellidos"
              value={profile.apellidos}
              onChange={(e) => handleInputChange("apellidos", e.target.value)}
              placeholder="Ingresa tus apellidos"
              className="mt-1"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Correo electrónico
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-11"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <Label
            htmlFor="telefono"
            className="text-sm font-medium text-gray-700"
          >
            Número de teléfono
          </Label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="telefono"
              value={formatPhoneNumber(profile.phone ?? "")}
              onChange={(e) =>
                handleInputChange(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 8)
                )
              }
              className="pl-11"
              placeholder="7865 9463"
              type="tel"
            />
          </div>
        </div>

        {/* Dirección */}
        <div>
          <Label
            htmlFor="direccion"
            className="text-sm font-medium text-gray-700"
          >
            Dirección
          </Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="direccion"
              value={profile.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="pl-11"
              placeholder="Colonia San Benito, Calle los Robles #12, casa blanca con portón negro"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
