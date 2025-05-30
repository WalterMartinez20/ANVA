// * Menú lateral que aparece en móviles. Incluye enlaces de navegación y cuenta del usuario.

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, Home, Package, User, Mail } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-40 md:hidden shadow-lg border-l">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-800">
              Carteras Artesanales
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-black" />
          </Button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center py-2 px-2 rounded-md text-gray-700 hover:bg-[#D3B29A]/40 transition-colors"
              >
                <Home className="mr-2 h-5 w-5 text-black" />
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/productos"
                onClick={onClose}
                className="flex items-center py-2 px-2 rounded-md text-gray-700 hover:bg-[#D3B29A]/40 transition-colors"
              >
                <Package className="mr-2 h-5 w-5 text-black" />
                Productos
              </Link>
            </li>
            <li>
              <Link
                href="/categorias"
                onClick={onClose}
                className="flex items-center py-2 px-2 rounded-md text-gray-700 hover:bg-[#D3B29A]/40 transition-colors"
              >
                <Package className="mr-2 h-5 w-5 text-black" />
                Categorías
              </Link>
            </li>
            <li>
              <Link
                href="/nosotros"
                onClick={onClose}
                className="flex items-center py-2 px-2 rounded-md text-gray-700 hover:bg-[#D3B29A]/40 transition-colors"
              >
                <User className="mr-2 h-5 w-5 text-black" />
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                onClick={onClose}
                className="flex items-center py-2 px-2 rounded-md text-gray-700 hover:bg-[#D3B29A]/40 transition-colors"
              >
                <Mail className="mr-2 h-5 w-5 text-black" />
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        {/* Cuenta */}
        <div className="p-4 border-t">
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-black" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {user?.nombres} {user?.apellidos}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/perfil" onClick={onClose}>
                    Mi Perfil
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-red-500 hover:bg-red-100 transition-colors"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login" onClick={onClose}>
                  Iniciar Sesión
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/registro" onClick={onClose}>
                  Registrarse
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
