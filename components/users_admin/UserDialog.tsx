"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  UserCheck,
  UserX,
  Shield,
  User,
} from "lucide-react";
import { formatPhoneNumber } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newUser: {
    nombres: string;
    apellidos: string;
    email: string;
    role: "ADMIN" | "USER";
    phone?: string;
    address?: string;
    isActive: boolean;
  }) => void;
  onUpdate?: (id: number, updatedUser: any) => void;
  userToEdit?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    role: "ADMIN" | "USER";
    phone?: string;
    address?: string;
    isActive: boolean;
  } | null;
}

export default function UserDialog({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  userToEdit,
}: Props) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [isActive, setIsActive] = useState(true);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (userToEdit) {
      setNombres(userToEdit.nombres);
      setApellidos(userToEdit.apellidos);
      setEmail(userToEdit.email);
      setPhone(userToEdit.phone || "");
      setAddress(userToEdit.address || "");
      setRole(userToEdit.role);
      setIsActive(userToEdit.isActive);
    } else {
      setNombres("");
      setApellidos("");
      setEmail("");
      setPhone("");
      setAddress("");
      setRole("USER");
      setIsActive(true);
    }
  }, [userToEdit]);

  const isFormValid = nombres && apellidos && email;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const userData = {
      nombres,
      apellidos,
      email,
      role,
      phone,
      address,
      isActive,
    };

    if (userToEdit && onUpdate) {
      onUpdate(userToEdit.id, userData);
    } else {
      onCreate(userData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-zinc-800">
            {userToEdit ? "Editar usuario" : "Crear nuevo usuario"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nombres">Nombres</Label>
            <Input
              id="nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              placeholder="Ej: María Fernanda"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              placeholder="Ej: López Ramírez"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 opacity-70" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="pl-11"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 opacity-70" />
              <Input
                id="phone"
                type="tel"
                value={formatPhoneNumber(phone)}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))
                }
                placeholder="7865 9463"
                className="pl-11"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Dirección</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 opacity-70" />
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Colonia Centro, Calle 15 #44, casa blanca"
                className="pl-11"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Rol</Label>
            <Select value={role} onValueChange={(val) => setRole(val as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">
                  <User className="w-4 h-4 mr-2 inline" />
                  Usuario
                </SelectItem>
                <SelectItem value="ADMIN">
                  <Shield className="w-4 h-4 mr-2 inline" />
                  Administrador
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Estado</Label>
            <Select
              value={isActive ? "activo" : "inactivo"}
              onValueChange={(val) => setIsActive(val === "activo")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">
                  <UserCheck className="inline w-4 h-4 mr-2" /> Activo
                </SelectItem>
                <SelectItem value="inactivo">
                  <UserX className="inline w-4 h-4 mr-2" /> Inactivo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {userToEdit ? "Guardar cambios" : "Crear Usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
