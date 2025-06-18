"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  ArrowUpDown,
  Shield,
  User,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type User = {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "user" | "guest";
  fechaRegistro: string;
  estado: "Activo" | "Inactivo";
};

interface UsersTableProps {
  users: User[];
  sortConfig: { key: string; direction: "ascending" | "descending" } | null;
  onRequestSort: (key: string) => void;
  onDelete: (id: number) => void;
  onEdit: (user: User) => void;
}

export default function UsersTable({
  users,
  sortConfig,
  onRequestSort,
  onDelete,
  onEdit,
}: UsersTableProps) {
  const renderSortButton = (label: string, key: string) => {
    const isActive = sortConfig?.key === key;
    const direction = isActive ? sortConfig?.direction : null;

    return (
      <button
        className="flex items-center gap-1 font-medium text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => onRequestSort(key)}
      >
        {label}
        <ArrowUpDown
          className={`h-4 w-4 transition-transform ${
            direction === "ascending"
              ? "rotate-180 text-blue-600"
              : direction === "descending"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        />
      </button>
    );
  };

  const roleStyles = {
    admin: {
      icon: <Shield className="w-4 h-4 opacity-80" />,
      style: "bg-purple-50 text-purple-800 ring-purple-200",
      label: "Admin",
      description: "Acceso total al sistema.",
    },
    user: {
      icon: <User className="w-4 h-4 opacity-80" />,
      style: "bg-blue-50 text-blue-800 ring-blue-200",
      label: "Usuario",
      description: "Permisos estándar.",
    },
    guest: {
      icon: <EyeOff className="w-4 h-4 opacity-80" />,
      style: "bg-zinc-50 text-zinc-700 ring-zinc-200",
      label: "Invitado",
      description: "Solo lectura.",
    },
  };

  const estadoStyles = {
    Activo: {
      icon: <CheckCircle className="w-4 h-4 opacity-80" />,
      style: "bg-emerald-50 text-emerald-800 ring-emerald-200",
      label: "Activo",
      description: "Acceso habilitado.",
    },
    Inactivo: {
      icon: <XCircle className="w-4 h-4 opacity-80" />,
      style: "bg-rose-50 text-rose-800 ring-rose-200",
      label: "Inactivo",
      description: "Acceso deshabilitado.",
    },
  };

  const renderBadge = ({
    icon,
    label,
    style,
    description,
  }: {
    icon: JSX.Element;
    label: string;
    style: string;
    description: string;
  }) => {
    const base =
      "inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ring-1 shadow-sm transition-colors duration-200 cursor-help";

    const Badge = (
      <span className={`${base} ${style}`} title={label}>
        {icon}
        {label}
      </span>
    );

    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{Badge}</TooltipTrigger>
          <TooltipContent>
            <span className="text-sm text-muted-foreground max-w-xs block">
              {description}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="rounded-xl border border-zinc-200 overflow-x-auto bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-zinc-50 text-zinc-600 border-b border-zinc-200">
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>{renderSortButton("Nombre", "nombre")}</TableHead>
            <TableHead>{renderSortButton("Email", "email")}</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>
              {renderSortButton("Registro", "fechaRegistro")}
            </TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No hay usuarios
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-zinc-50 transition-colors duration-200"
              >
                <TableCell className="font-medium text-gray-700">
                  {user.id}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {user.nombre}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {user.email}
                </TableCell>
                <TableCell>
                  {renderBadge(roleStyles[user.rol] || roleStyles["guest"])}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {user.fechaRegistro}
                </TableCell>
                <TableCell>
                  {renderBadge(
                    estadoStyles[user.estado] || estadoStyles["Inactivo"]
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                        aria-label="Acciones de usuario"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center gap-2 hover:bg-zinc-100 hover:text-zinc-800"
                        onClick={() => onEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
