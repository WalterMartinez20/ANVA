"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  X,
  LogOut,
  Package,
  Settings,
  Home,
  Mail,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/components/cart-provider";
import { Skeleton } from "@/components/ui/skeleton";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useSearchDropdown } from "@/hooks/busqueda/useSearchDropdown";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();
  const { totalItems, setIsOpen: setCartOpen } = useCart();

  const {
    query,
    setQuery,
    suggestions,
    history,
    isDropdownVisible,
    openDropdown,
    clearHistory,
    removeItemFromHistory,
    handleSearchSubmit,
    formRef,
  } = useSearchDropdown();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && scrollY > 60) return true;
        if (prev && scrollY < 30) return false;
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-6">
            <img
              src="/logos/logo_negativo.png"
              alt="Logo"
              className="h-6 w-6 object-contain scale-[4] origin-left translate-x-1 translate-y-1"
            />
            {/* <span className="text-2xl font-bold text-gray-800">ANVA</span> */}
          </Link>
          {/* src="/placeholder.svg?height=32&width=32&text=E" */}

          {/* Campo de búsqueda centrado en escritorio */}
          <div className="hidden md:flex flex-1 justify-center px-8 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              ref={formRef}
              className="relative w-full"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={openDropdown}
                className="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-11 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {isDropdownVisible &&
                (suggestions.length > 0 || history.length > 0) && (
                  <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-lg border max-h-60 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {suggestions.length > 0 ? (
                        suggestions.map((prod) => (
                          <button
                            type="button"
                            key={prod.id}
                            onClick={() =>
                              (window.location.href = `/producto/${prod.id}`)
                            }
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                          >
                            {prod.name}
                          </button>
                        ))
                      ) : history.length > 0 ? (
                        <>
                          {history.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 rounded"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  (window.location.href = `/buscar?q=${encodeURIComponent(
                                    item
                                  )}`)
                                }
                                className="text-left flex-1"
                              >
                                {item}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItemFromHistory(i)}
                                className="ml-2 text-gray-400 hover:text-red-500"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="text-center mt-2">
                            <button
                              type="button"
                              onClick={clearHistory}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Borrar historial
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                )}
            </form>
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            <Tooltip.Provider delayDuration={0}>
              <div className="flex items-center space-x-4">
                {/* 📦 Pedidos */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Link href="/pedidos">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-100"
                      >
                        <Package className="h-6 w-6" />
                      </Button>
                    </Link>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-black text-white text-xs rounded px-2 py-1 shadow-md"
                      side="top"
                      sideOffset={8}
                    >
                      Pedidos
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* ❤️ Favoritos */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Link href="/favoritos">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-100"
                      >
                        <Heart className="h-6 w-6" />
                      </Button>
                    </Link>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-black text-white text-xs rounded px-2 py-1 shadow-md"
                      side="top"
                      sideOffset={8}
                    >
                      Favoritos
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* 🛒 Carrito */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100 relative"
                      onClick={() => setCartOpen(true)}
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-black text-white text-xs rounded px-2 py-1 shadow-md"
                      side="top"
                      sideOffset={8}
                    >
                      Carrito
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* 👤 Usuario / Skeleton / Login */}
                {isLoading ? (
                  <Skeleton className="w-10 h-10 rounded-full animate-pulse bg-gray-200" />
                ) : isAuthenticated ? (
                  <Tooltip.Root>
                    <DropdownMenu>
                      <Tooltip.Trigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-100"
                          >
                            <User className="h-6 w-6" />
                          </Button>
                        </DropdownMenuTrigger>
                      </Tooltip.Trigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="flex flex-col">
                            <span>
                              {user?.nombres} {user?.apellidos}
                            </span>
                            <span className="text-xs text-gray-500">
                              {user?.email}
                            </span>
                          </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link
                            href="/perfil"
                            className="cursor-pointer flex items-center"
                          >
                            <User className="mr-2 h-4 w-4" />
                            <span>Mi Perfil</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            href="/pedidos"
                            className="cursor-pointer flex items-center"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            <span>Mis Pedidos</span>
                          </Link>
                        </DropdownMenuItem>

                        {isAdmin && (
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin"
                              className="cursor-pointer flex items-center"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Administración</span>
                            </Link>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={logout}
                          className="cursor-pointer text-red-500"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-black text-white text-xs rounded px-2 py-1 shadow-md"
                        side="top"
                        sideOffset={8}
                      >
                        Cuenta
                        <Tooltip.Arrow className="fill-black" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                ) : (
                  <Link href="/login">
                    <Button variant="default" size="sm">
                      Iniciar Sesión
                    </Button>
                  </Link>
                )}
              </div>
            </Tooltip.Provider>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold">Carteras Artesanales</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="flex items-center py-2 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/productos"
                    className="flex items-center py-2 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Productos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categorias"
                    className="flex items-center py-2 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Categorías
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nosotros"
                    className="flex items-center py-2 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contacto"
                    className="flex items-center py-2 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Contacto
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="p-4 border-t">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {user?.nombres} {user?.apellidos}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/perfil">Mi Perfil</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-500"
                      onClick={() => logout()}
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/registro">Registrarse</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
