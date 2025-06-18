// lib/auth/requireAdmin.ts
// * Esto sirve para verificar que el usuario actual sea administrador
// * Y así centralizar la validación de permisos en todos los endpoints protegidos. Te ahorra repetir esa lógica en cada ruta.
import { getCurrentUserAppRouter } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function requireAdmin() {
  const user = await getCurrentUserAppRouter();
  if (!user || user.role !== Role.ADMIN) {
    return { error: "No autorizado", status: 403 };
  }
  return { user };
}
