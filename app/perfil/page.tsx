"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  User,
  Lock,
  Mail,
  ShoppingBag,
  Heart,
  Star,
  MapPin,
  Phone,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  reviewsCount: number;
  favoritesCount: number;
  lastOrderDate: string | null;
}

export default function PerfilPage() {
  const { user, isGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    reviewsCount: 0,
    favoritesCount: 0,
    lastOrderDate: null,
  });

  // Estado para el formulario de información personal
  const [personalInfo, setPersonalInfo] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Estado para el formulario de cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // useEffect(() => {
  //   if (user) {
  //     setPersonalInfo({
  //       nombres: user.nombres || "",
  //       apellidos: user.apellidos || "",
  //       email: user.email || "",
  //       phone: user.phone || "",
  //       address: user.address || "",
  //       city: user.city || "",
  //       state: user.state || "",
  //       zipCode: user.zipCode || "",
  //     });

  //     // Cargar estadísticas del usuario
  //     fetchUserStats();
  //   }
  // }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/users/stats");
      if (!response.ok) throw new Error("Error al cargar estadísticas");

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleUpdatePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personalInfo),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al actualizar perfil");
      }

      toast({
        title: "Perfil actualizado",
        description:
          "Tu información personal ha sido actualizada correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al actualizar perfil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al cambiar contraseña");
      }

      // Limpiar formulario
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente",
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al cambiar contraseña",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.nombres.charAt(0)}${user.apellidos.charAt(0)}`.toUpperCase();
  };

  if (isGuest) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
        <div className="max-w-md mx-auto p-8 border rounded-lg">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">
            Inicia sesión para ver tu perfil
          </h2>
          <p className="text-muted-foreground mb-6">
            Necesitas iniciar sesión para ver y editar tu información personal
          </p>
          <Button asChild>
            <a href="/login">Iniciar Sesión</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Cabecera del perfil */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.avatar || ""}
                alt={`${user?.nombres} ${user?.apellidos}`}
              />
              <AvatarFallback className="text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">
                {user?.nombres} {user?.apellidos}
              </h1>
              <p className="text-muted-foreground mb-4">{user?.email}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <ShoppingBag className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-semibold">{stats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Pedidos</p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                  <p className="text-lg font-semibold">
                    {stats.favoritesCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Favoritos</p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                  <p className="text-lg font-semibold">{stats.reviewsCount}</p>
                  <p className="text-xs text-muted-foreground">Reseñas</p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-lg">
                    ${stats.totalSpent.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total gastado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nivel de cliente */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Nivel de Cliente</span>
              <span className="text-sm text-primary font-medium">
                Nivel {Math.min(Math.floor(stats.totalOrders / 5) + 1, 5)}
              </span>
            </div>
            <Progress
              value={Math.min((stats.totalOrders % 5) * 20, 100)}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalOrders < 5
                ? `Realiza ${
                    5 - (stats.totalOrders % 5)
                  } pedidos más para subir al siguiente nivel`
                : stats.totalOrders >= 25
                ? "¡Has alcanzado el nivel máximo!"
                : `Realiza ${
                    5 - (stats.totalOrders % 5)
                  } pedidos más para subir al siguiente nivel`}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Información Personal
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Seguridad
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Mis Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePersonalInfo} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombres">Nombres</Label>
                      <Input
                        id="nombres"
                        name="nombres"
                        value={personalInfo.nombres}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellidos</Label>
                      <Input
                        id="apellidos"
                        name="apellidos"
                        value={personalInfo.apellidos}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        value={personalInfo.address}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        name="city"
                        value={personalInfo.city}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado/Provincia</Label>
                      <Input
                        id="state"
                        name="state"
                        value={personalInfo.state}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={personalInfo.zipCode}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña actual</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar nueva contraseña
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cambiando contraseña...
                      </>
                    ) : (
                      "Cambiar Contraseña"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Mis Pedidos Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.totalOrders > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Has realizado un total de {stats.totalOrders} pedidos.
                      {stats.lastOrderDate &&
                        ` Tu último pedido fue el ${new Date(
                          stats.lastOrderDate
                        ).toLocaleDateString()}.`}
                    </p>
                    <Button asChild>
                      <Link href="/pedidos">Ver todos mis pedidos</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">
                      No tienes pedidos
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Aún no has realizado ningún pedido
                    </p>
                    <Button asChild>
                      <Link href="/">Explorar productos</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
