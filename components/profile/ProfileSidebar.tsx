// * Muestra el avatar, nombre, email y el menú lateral para cambiar de sección del perfil.

"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  User,
  Settings,
  Bell,
  LogOut,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  action?: () => void;
};

interface ProfileSidebarProps {
  profile: {
    nombres: string;
    apellidos: string;
    email: string;
    isActive: boolean;
  };
  avatarUrl?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  logout: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  avatarUrl,
  activeTab,
  setActiveTab,
  logout,
}) => {
  const getInitials = () => {
    const nombre = profile.nombres?.trim();
    const apellido = profile.apellidos?.trim();
    if (!nombre && !apellido) return "U";
    if (nombre && !apellido) return nombre.charAt(0).toUpperCase();
    if (!nombre && apellido) return apellido.charAt(0).toUpperCase();
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const menuItems: MenuItem[] = [
    { id: "personal", label: "Información Personal", icon: User },
    { id: "security", label: "Seguridad", icon: Settings },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    {
      id: "logout",
      label: "Cerrar Sesión",
      icon: LogOut,
      action: handleLogout,
    },
  ];

  console.log("📦 Sidebar user:", user); // ✅ LOG 4
  console.log("👤 Sidebar profile:", profile); // ✅ LOG 5

  return (
    <Card className="shadow-md border border-gray-100 rounded-xl p-6 bg-white">
      <TooltipProvider delayDuration={0}>
        {/* Avatar y datos del usuario */}
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 shadow-lg ring-2 ring-white bg-[#d8c6bd] text-white">
            <AvatarImage
              src={avatarUrl || ""}
              alt={`${profile.nombres} ${profile.apellidos}`}
            />
            <AvatarFallback className="text-2xl font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-xl font-bold text-gray-900 mt-4">
            {profile.nombres} {profile.apellidos}
          </h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>

          {/* Rol y estado */}
          <div className="flex flex-col gap-3 items-center mt-3">
            {/* Badge de Rol */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={`inline-flex items-center gap-3 px-3 py-1 text-xs font-semibold rounded-full ring-1 shadow-sm cursor-help ${
                    user?.role === "ADMIN"
                      ? "bg-purple-50 text-purple-800 ring-purple-200"
                      : "bg-blue-50 text-blue-800 ring-blue-200"
                  }`}
                >
                  {user?.role === "ADMIN" ? (
                    <>
                      <Shield className="w-4 h-4 opacity-80" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 opacity-80" />
                      Usuario
                    </>
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                {user?.role === "ADMIN"
                  ? "Acceso total al sistema."
                  : "Permisos estándar."}
              </TooltipContent>
            </Tooltip>

            {/* Badge de Estado */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={`inline-flex items-center gap-3 px-3 py-1 text-xs font-semibold rounded-full ring-1 shadow-sm cursor-help ${
                    user?.isActive
                      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                      : "bg-rose-50 text-rose-800 ring-rose-200"
                  }`}
                >
                  {user?.isActive ? (
                    <>
                      <CheckCircle className="w-4 h-4 opacity-80" />
                      Activo
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 opacity-80" />
                      Inactivo
                    </>
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                {user?.isActive
                  ? "Acceso Habilitado."
                  : "Acceso Deshabilitado."}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      <Separator className="my-4" />

      {/* Menú de navegación */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() =>
                item.action ? item.action() : setActiveTab(item.id)
              }
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </Card>
  );
};
