// * Agrupa todos los botones de acciones del navbar (carrito, favoritos, pedidos, login/cuenta)

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Package, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/components/cart/cart-provider";
import { Skeleton } from "@/components/ui/skeleton";
import * as Tooltip from "@radix-ui/react-tooltip";
import UserDropdown from "./UserDropdown";

interface NavActionsProps {
  setMobileMenuOpen: (open: boolean) => void;
}

export default function NavActions({ setMobileMenuOpen }: NavActionsProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { totalItems, setIsOpen: setCartOpen } = useCart();

  return (
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

          {/* 👤 Usuario */}
          {isLoading ? (
            <Skeleton className="w-10 h-10 rounded-full animate-pulse bg-gray-200" />
          ) : isAuthenticated ? (
            <UserDropdown />
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
  );
}
