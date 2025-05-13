"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    setIsMobileMenuOpen(false);
  }, [isAuthenticated, isAdmin, isLoading, router, toast, pathname]);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Productos",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/admin/productos",
    },
    {
      title: "Materiales",
      icon: <Boxes className="h-5 w-5" />,
      href: "/admin/materiales",
    },
    // { title: "Inventario", icon: <Package className="h-5 w-5" />, href: "/admin/inventario" },
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
    // { title: "Configuración", icon: <Settings className="h-5 w-5" />, href: "/admin/configuracion" },
  ];

  if (isLoading || (isAuthenticated && !isAdmin)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-md p-1 hover:bg-gray-100 md:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-md px-4 py-2 transition-colors hover:bg-gray-100 ${
                      pathname === item.href
                        ? "bg-gray-100 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t p-4">
            <Link
              href="/"
              className="flex items-center rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Home className="h-5 w-5" />
              <span className="ml-3">Ir a la tienda</span>
            </Link>
            <button
              onClick={logout}
              className="mt-2 flex w-full items-center rounded-md px-4 py-2 text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 rounded-md p-1 hover:bg-gray-100 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="hidden md:block text-lg font-medium">
              Panel de Administración
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Ir a la tienda
              </Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
