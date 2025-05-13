"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  UserPlus,
  ArrowUpDown,
  Shield,
  User,
} from "lucide-react";
import SortSelector from "@/components/sort-selector";

// Datos de ejemplo para los usuarios
const usuariosEjemplo = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    rol: "admin",
    fechaRegistro: "2023-01-15",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "María López",
    email: "maria.lopez@example.com",
    rol: "user",
    fechaRegistro: "2023-02-20",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    rol: "user",
    fechaRegistro: "2023-03-10",
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    email: "ana.martinez@example.com",
    rol: "user",
    fechaRegistro: "2023-04-05",
    estado: "Inactivo",
  },
  {
    id: 5,
    nombre: "Roberto Sánchez",
    email: "roberto.sanchez@example.com",
    rol: "admin",
    fechaRegistro: "2023-05-12",
    estado: "Activo",
  },
];

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(usuariosEjemplo);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  // Añadir las opciones de ordenación después de la declaración de estados
  const sortOptions = [
    { label: "Por defecto", value: "default" },
    { label: "Nombre A-Z", value: "nombre_asc" },
    { label: "Nombre Z-A", value: "nombre_desc" },
    { label: "Email A-Z", value: "email_asc" },
    { label: "Email Z-A", value: "email_desc" },
    { label: "Más recientes", value: "fecha_desc" },
    { label: "Más antiguos", value: "fecha_asc" },
  ];

  // Filtrar usuarios por término de búsqueda
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar usuarios
  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    if (!sortConfig) return 0;

    const key = sortConfig.key as keyof typeof a;

    if (a[key] < b[key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Añadir una función para manejar el cambio de ordenación
  const handleSortChange = (value: string) => {
    let key = "nombre";
    let direction: "ascending" | "descending" = "ascending";

    switch (value) {
      case "nombre_asc":
        key = "nombre";
        direction = "ascending";
        break;
      case "nombre_desc":
        key = "nombre";
        direction = "descending";
        break;
      case "email_asc":
        key = "email";
        direction = "ascending";
        break;
      case "email_desc":
        key = "email";
        direction = "descending";
        break;
      case "fecha_asc":
        key = "fechaRegistro";
        direction = "ascending";
        break;
      case "fecha_desc":
        key = "fechaRegistro";
        direction = "descending";
        break;
      default:
        key = "id";
        direction = "ascending";
    }

    setSortConfig({ key, direction });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    }
  };

  const toggleUserRole = (id: number) => {
    setUsuarios(
      usuarios.map((usuario) => {
        if (usuario.id === id) {
          return {
            ...usuario,
            rol: usuario.rol === "admin" ? "user" : "admin",
          };
        }
        return usuario;
      })
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Actualizar la sección de búsqueda para incluir el componente SortSelector */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-64">
          <SortSelector
            options={sortOptions}
            defaultValue="default"
            onChange={handleSortChange}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="min-w-[200px]">
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("nombre")}
                >
                  Nombre
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("email")}
                >
                  Email
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("fechaRegistro")}
                >
                  Fecha de registro
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsuarios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              sortedUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.id}</TableCell>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <span
                      className={`flex items-center gap-1 ${
                        usuario.rol === "admin"
                          ? "text-purple-600"
                          : "text-blue-600"
                      }`}
                    >
                      {usuario.rol === "admin" ? (
                        <>
                          <Shield className="h-4 w-4" />
                          Administrador
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4" />
                          Usuario
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>{usuario.fechaRegistro}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        usuario.estado === "Activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {usuario.estado}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => toggleUserRole(usuario.id)}
                        >
                          {usuario.rol === "admin" ? (
                            <>
                              <User className="h-4 w-4" />
                              <span>Cambiar a Usuario</span>
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4" />
                              <span>Cambiar a Admin</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-2 text-red-600"
                          onClick={() => handleDelete(usuario.id)}
                        >
                          <Trash className="h-4 w-4" />
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
    </div>
  );
}
