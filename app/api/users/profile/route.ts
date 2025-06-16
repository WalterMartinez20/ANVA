import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUserAppRouter } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const currentUser = await getCurrentUserAppRouter();

    if (!currentUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener el perfil completo del usuario
    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        avatar: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json(
      { error: "Error al obtener perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserAppRouter();

    if (!currentUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombres, apellidos, email, phone, address } = await request.json();

    // Validar datos
    if (!nombres || !apellidos || !email) {
      return NextResponse.json(
        { error: "Nombres, apellidos y email son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el email ya está en uso por otro usuario
    if (email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json(
          { error: "El email ya está en uso" },
          { status: 400 }
        );
      }
    }

    if (phone && phone.replace(/\D/g, "").length !== 8) {
      return NextResponse.json(
        { error: "El teléfono debe tener exactamente 8 dígitos" },
        { status: 400 }
      );
    }

    // Actualizar perfil
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        nombres,
        apellidos,
        email,
        phone,
        address,
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        role: true,
        phone: true,
        address: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json(
      { error: "Error al actualizar perfil" },
      { status: 500 }
    );
  }
}
