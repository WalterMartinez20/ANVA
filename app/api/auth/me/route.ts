import { NextResponse } from "next/server";
import { getCurrentUserAppRouter, removeAuthCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    // Obtener usuario actual desde el token
    const userPayload = await getCurrentUserAppRouter();

    if (!userPayload) {
      // Si no hay usuario autenticado, devolver un "invitado". return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      return NextResponse.json({
        user: {
          id: 0,
          nombres: "Invitado",
          apellidos: "",
          email: "",
          role: Role.GUEST,
        },
      });
    }

    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userPayload.id },
      select: {
        id: true,
        email: true,
        role: true,
        nombres: true,
        apellidos: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        favorites: true,
        orders: true,
        isActive: true, //esto soluciono que no se desactivara sola la cuenta
      },
    });

    if (!user) {
      // Si el usuario no existe en la base de datos, eliminar la cookie
      await removeAuthCookie();
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    console.log("✅ Usuario desde base de datos:", user);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}
