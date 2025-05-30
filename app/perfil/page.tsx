"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  User,
  Settings,
  LogOut,
  Phone,
  MapPin,
  CalendarIcon,
  Loader2,
  Mail,
  Heart,
  Star,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface UserProfile {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: Date | null;
  genero: string;
  ubicacion: string;
  codigoPostal: string;
  emailVerificado: boolean;
}

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: null,
    genero: "",
    ubicacion: "",
    codigoPostal: "",
    emailVerificado: false,
  });

  const [originalProfile, setOriginalProfile] = useState<UserProfile>({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: null,
    genero: "",
    ubicacion: "",
    codigoPostal: "",
    emailVerificado: false,
  });

  useEffect(() => {
    if (user) {
      const userProfile = {
        nombres: user.nombres || "",
        apellidos: user.apellidos || "",
        email: user.email || "",
        telefono: user.phone || "",
        direccion: user.address || "",
        fechaNacimiento: user.fechaNacimiento
          ? new Date(user.fechaNacimiento)
          : null,
        genero: user.genero || "",
        ubicacion: user.city || "",
        codigoPostal: user.zipCode || "",
        emailVerificado: user.emailVerificado || false,
      };
      setProfile(userProfile);
      setOriginalProfile(userProfile);
    }
  }, [user]);

  useEffect(() => {
    const hasProfileChanges =
      JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setHasChanges(hasProfileChanges);
  }, [profile, originalProfile]);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: profile.nombres,
          apellidos: profile.apellidos,
          email: profile.email,
          phone: profile.telefono,
          address: profile.direccion,
          fechaNacimiento: profile.fechaNacimiento?.toISOString(),
          genero: profile.genero,
          city: profile.ubicacion,
          zipCode: profile.codigoPostal,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar perfil");
      }

      setOriginalProfile(profile);
      setHasChanges(false);

      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardChanges = () => {
    setProfile(originalProfile);
    setHasChanges(false);
    toast({
      title: "Cambios descartados",
      description: "Se han restaurado los valores originales",
    });
  };

  const getInitials = () => {
    const nombre = profile.nombres?.trim();
    const apellido = profile.apellidos?.trim();

    if (!nombre && !apellido) return "U";
    if (nombre && !apellido) return nombre.charAt(0).toUpperCase();
    if (!nombre && apellido) return apellido.charAt(0).toUpperCase();

    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const menuItems = [
    {
      id: "personal",
      label: "Información Personal",
      icon: User,
      active: activeTab === "personal",
    },
    {
      id: "security",
      label: "Login y Contraseña",
      icon: Settings,
      active: activeTab === "security",
    },
    {
      id: "logout",
      label: "Cerrar Sesión",
      icon: LogOut,
      active: false,
      action: logout,
    },
  ];

  const ubicaciones = [
    "San Salvador, El Salvador",
    "Guatemala, Guatemala",
    "Tegucigalpa, Honduras",
    "Managua, Nicaragua",
    "San José, Costa Rica",
    "Ciudad de Panamá, Panamá",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm border border-gray-200 rounded-lg p-6 bg-white">
                {/* Avatar y datos del usuario */}
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 shadow ring-2 ring-white bg-[#d8c6bd] text-white">
                    <AvatarImage
                      src={user?.avatar || ""}
                      alt={`${profile.nombres} ${profile.apellidos}`}
                    />
                    <AvatarFallback className="text-2xl font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg font-semibold text-gray-900 mt-3">
                    {profile.nombres} {profile.apellidos}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                </div>

                <Separator className="my-4" />

                {/* Menú de navegación */}
                <nav className="space-y-2">
                  {[
                    {
                      id: "personal",
                      label: "Información Personal",
                      icon: User,
                    },
                    { id: "security", label: "Seguridad", icon: Settings },
                    { id: "orders", label: "Mis Pedidos", icon: ShoppingBag }, // puedes usar otro ícono
                    {
                      id: "logout",
                      label: "Cerrar Sesión",
                      icon: LogOut,
                      action: logout,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() =>
                          item.action ? item.action() : setActiveTab(item.id)
                        }
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md transition-colors",
                          activeTab === item.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>

            {/* Main Content */}
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {activeTab === "personal" && (
                <>
                  {/* Card de estadísticas */}
                  <Card className="shadow-sm border border-gray-200 bg-white rounded-lg p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <ShoppingBag className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <p className="text-lg font-semibold">0</p>
                        <p className="text-xs text-muted-foreground">Pedidos</p>
                      </div>

                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                        <p className="text-lg font-semibold">0</p>
                        <p className="text-xs text-muted-foreground">
                          Favoritos
                        </p>
                      </div>

                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Star className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                        <p className="text-lg font-semibold">0</p>
                        <p className="text-xs text-muted-foreground">Reseñas</p>
                      </div>

                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-semibold">$0.00</p>
                        <p className="text-xs text-muted-foreground">
                          Total gastado
                        </p>
                      </div>
                    </div>

                    {/* Nivel de cliente (Se comenta porque por el momento no se usa) */}
                    {/* <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Nivel de Cliente</span>
                        <span className="text-sm text-primary font-medium">
                          Nivel 1
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#e0cfc7] overflow-hidden">
                        <div
                          className="h-full bg-[#a67c6b]"
                          style={{ width: "20%" }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Realiza 5 pedidos más para subir al siguiente nivel
                      </p>
                    </div> */}
                  </Card>

                  {/* Información personal + formulario */}
                  <Card className="p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Información Personal
                    </h2>

                    <div className="space-y-6">
                      {/* Nombres y Apellidos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nombres">Nombre(s)</Label>
                          <Input
                            id="nombres"
                            value={profile.nombres}
                            onChange={(e) =>
                              handleInputChange("nombres", e.target.value)
                            }
                            placeholder="Ingresa tu nombre"
                          />
                        </div>
                        <div>
                          <Label htmlFor="apellidos">Apellidos</Label>
                          <Input
                            id="apellidos"
                            value={profile.apellidos}
                            onChange={(e) =>
                              handleInputChange("apellidos", e.target.value)
                            }
                            placeholder="Ingresa tus apellidos"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email">Correo electrónico</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="pl-10"
                            placeholder="correo@ejemplo.com"
                          />
                        </div>
                      </div>

                      {/* Teléfono */}
                      <div>
                        <Label htmlFor="telefono">Número de teléfono</Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="telefono"
                            value={profile.telefono}
                            onChange={(e) =>
                              handleInputChange("telefono", e.target.value)
                            }
                            className="pl-10"
                            placeholder="(000) 000-0000"
                          />
                        </div>
                      </div>

                      {/* Dirección */}
                      <div>
                        <Label htmlFor="direccion">Dirección</Label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="direccion"
                            value={profile.direccion}
                            onChange={(e) =>
                              handleInputChange("direccion", e.target.value)
                            }
                            className="pl-10"
                            placeholder="Ingresa tu dirección completa"
                          />
                        </div>
                      </div>

                      {/* Ciudad y Código Postal */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ubicacion">Ubicación</Label>
                          <Select
                            value={profile.ubicacion}
                            onValueChange={(value) =>
                              handleInputChange("ubicacion", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu ubicación" />
                            </SelectTrigger>
                            <SelectContent>
                              {ubicaciones.map((ubicacion) => (
                                <SelectItem key={ubicacion} value={ubicacion}>
                                  {ubicacion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="codigoPostal">Código Postal</Label>
                          <Input
                            id="codigoPostal"
                            value={profile.codigoPostal}
                            onChange={(e) =>
                              handleInputChange("codigoPostal", e.target.value)
                            }
                            placeholder="00000"
                          />
                        </div>
                      </div>

                      {/* Fecha de nacimiento */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Fecha de nacimiento
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1",
                                !profile.fechaNacimiento &&
                                  "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {profile.fechaNacimiento ? (
                                format(
                                  profile.fechaNacimiento,
                                  "d 'de' MMMM, yyyy",
                                  { locale: es }
                                )
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={profile.fechaNacimiento || undefined}
                              onSelect={(date) =>
                                handleInputChange("fechaNacimiento", date)
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
                      <Button
                        variant="ghost"
                        onClick={handleDiscardChanges}
                        disabled={!hasChanges || isLoading}
                        className="sm:w-auto w-full"
                      >
                        Descartar cambios
                      </Button>

                      <Button
                        onClick={handleSaveChanges}
                        disabled={!hasChanges || isLoading}
                        className="sm:w-auto w-full bg-primary text-white hover:bg-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          "Guardar cambios"
                        )}
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "security" && (
                <Card className="p-8 text-center">
                  <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Configuración de Seguridad
                  </h3>
                  <p className="text-gray-600">
                    Esta sección estará disponible próximamente
                  </p>
                </Card>
              )}

              {activeTab === "orders" && (
                <Card className="p-8 text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-2">
                    No tienes pedidos
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Aún no has realizado ningún pedido
                  </p>
                  <Button asChild>
                    <a href="/">Explorar productos</a>
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
