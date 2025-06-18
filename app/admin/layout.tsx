"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Home,
  Boxes,
  Loader2,
  Tags,
  UserCheck2,
  FolderKanban,
  Layers,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      toast({
        title: "Acceso denegado",
        description:
          "No tienes permisos para acceder al panel de administración",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, isLoading, pathname]);

  const menuItems = [
    {
      title: "Inicio",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Productos",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/admin/productos",
    },
    // {title: "Categorias", icon: <Tags className="h-5 w-5" />, href: "/admin/categorias",},
    {
      title: "Materiales",
      icon: <Boxes className="h-5 w-5" />,
      href: "/admin/materiales",
    },
    {
      title: "Pedidos",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/pedidos",
    },
    {
      title: "Usuarios",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/usuarios",
    },
    // {title: "Inventario", icon: <FolderKanban className="h-5 w-5" />, href: "/admin/inventario",},
    {
      title: "Equipo de Desarrollo",
      icon: <UserCheck2 className="h-5 w-5" />,
      href: "/admin/equipo",
    },
  ];

  if (isLoading || (isAuthenticated && !isAdmin)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed z-40 md:relative w-64 transition-transform duration-300 border-r bg-white shadow-sm",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link
            href="/admin"
            className="text-xl font-bold tracking-tight text-primary"
          >
            Admin Panel
          </Link>
          <button
            className="md:hidden p-1 hover:bg-gray-100 rounded"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-gray-100"
              )}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </Link>
          ))}
          <div className="mt-6 border-t pt-4 space-y-2">
            <Link
              href="/"
              className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-gray-100"
            >
              <Home className="h-5 w-5 text-muted-foreground" />
              <span className="ml-3">Ir a la tienda</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <header className="h-16 px-4 md:px-6 flex items-center justify-between bg-white border-b">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="md:hidden mr-2 p-1 rounded hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="hidden md:block text-lg font-semibold">
              Panel de Administración
            </h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir a la tienda
            </Link>
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
