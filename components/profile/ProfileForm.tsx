// * Contiene el formulario editable de información personal del usuario (nombre, email, dirección, etc.).

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, User } from "lucide-react";
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
    <Card className="p-6 shadow-lg border bg-white w-full space-y-6">
      <div className="flex items-center gap-3">
        <User className="text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">
          Información personal
        </h2>
      </div>

      <div className="space-y-6">
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombres">Nombre(s)</Label>
            <Input
              id="nombres"
              value={profile.nombres}
              onChange={(e) => handleInputChange("nombres", e.target.value)}
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div>
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input
              id="apellidos"
              value={profile.apellidos}
              onChange={(e) => handleInputChange("apellidos", e.target.value)}
              placeholder="Ingresa tus apellidos"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <div className="relative">
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
          <Label htmlFor="telefono">Número de teléfono</Label>
          <div className="relative">
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
          <Label htmlFor="direccion">Dirección</Label>
          <div className="relative">
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
