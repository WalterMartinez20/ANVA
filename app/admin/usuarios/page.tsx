"use client";

import { useEffect, useState } from "react";
import UsersTopbar from "@/components/users_admin/UsersTopbar";
import UsersTable from "@/components/users_admin/UsersTable";
import UserModal from "@/components/users_admin/UserDialog";
import HelpSection from "@/components/help/HelpSection";

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  role: "ADMIN" | "USER";
  isActive: boolean;
  createdAt: string;
  phone?: string;
  address?: string;
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al cargar usuarios", err));
  }, []);

  const handleSortChange = (value: string) => {
    let key = "nombres";
    let direction: "ascending" | "descending" = "ascending";

    switch (value) {
      case "nombre_asc":
        key = "nombres";
        direction = "ascending";
        break;
      case "nombre_desc":
        key = "nombres";
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
        key = "createdAt";
        direction = "ascending";
        break;
      case "fecha_desc":
        key = "createdAt";
        direction = "descending";
        break;
      default:
        key = "id";
        direction = "ascending";
    }

    setSortConfig({ key, direction });
  };

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

  const filteredUsuarios = usuarios.filter(
    (u) =>
      `${u.nombres} ${u.apellidos}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key as keyof typeof a;
    if (a[key]! < b[key]!) return sortConfig.direction === "ascending" ? -1 : 1;
    if (a[key]! > b[key]!) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    }
  };

  const handleCreateUser = async (newUser: {
    nombres: string;
    apellidos: string;
    email: string;
    role: "ADMIN" | "USER";
    phone?: string;
    address?: string;
    isActive: boolean;
  }) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const created = await res.json();
        setUsuarios((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error("Error creando usuario:", err);
    }
  };

  const handleUpdateUser = async (id: number, updated: any) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsuarios((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
      }
    } catch (err) {
      console.error("Error actualizando usuario:", err);
    }
  };

  return (
    <div>
      <HelpSection videoUrl="/help-videos/usuarios.mp4" />

      <UsersTopbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSortChange={handleSortChange}
        onOpenCreate={() => {
          setEditingUser(null);
          setShowModal(true);
        }}
      />

      <UsersTable
        users={sortedUsuarios.map((u) => ({
          id: u.id,
          nombre: `${u.nombres} ${u.apellidos}`,
          email: u.email,
          rol: u.role.toLowerCase() as "admin" | "user",
          fechaRegistro: u.createdAt.split("T")[0],
          estado: u.isActive ? "Activo" : "Inactivo",
        }))}
        sortConfig={sortConfig}
        onRequestSort={requestSort}
        onDelete={handleDelete}
        onEdit={(user) => {
          const [nombres, ...rest] = user.nombre.split(" ");
          const apellidos = rest.join(" ");
          const original = usuarios.find((u) => u.id === user.id);
          setEditingUser({
            ...original!,
            nombres,
            apellidos,
          });
          setShowModal(true);
        }}
      />

      <UserModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onCreate={handleCreateUser}
        onUpdate={handleUpdateUser}
        userToEdit={editingUser}
      />
    </div>
  );
}
