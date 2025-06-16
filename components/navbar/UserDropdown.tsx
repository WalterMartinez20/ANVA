// * Muestra el menú desplegable con los datos del usuario logueado y acciones como ir al perfil, pedidos, administración, o cerrar sesión.

"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function UserDropdown() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <Tooltip.Root>
      <DropdownMenu>
        <Tooltip.Trigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <User className="h-6 w-6 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
        </Tooltip.Trigger>

        <DropdownMenuContent
          align="end"
          className="w-56 border bg-white shadow-md rounded-md"
        >
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-semibold text-primary">
                {user?.nombres} {user?.apellidos}
              </span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href="/perfil"
              className="cursor-pointer flex items-center text-gray-700 hover:!bg-[#D3B29A]/40 transition-colors" //hover:bg-[#D3B29A]/40
            >
              <User className="mr-2 h-4 w-4 text-black" />
              <span>Mi Perfil</span>
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link
                href="/admin"
                className="cursor-pointer flex items-center text-gray-700 hover:!bg-[#D3B29A]/40 transition-colors"
              >
                <Settings className="mr-2 h-4 w-4 text-black" />
                <span>Administración</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer text-red-500 hover:!bg-[#D3B29A]/40 transition-colors"
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
  );
}
