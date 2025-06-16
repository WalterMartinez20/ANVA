import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createToken, verifyPassword, withAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Extrae solo los campos requeridos para el token (coinciden con JWTPayload)
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      nombres: user.nombres,
      apellidos: user.apellidos,
      phone: user.phone ?? undefined,
      address: user.address ?? undefined,
    };

    const token = createToken(payload);

    const { password: _, ...userData } = user;
    const response = NextResponse.json({ user: userData });
    return withAuthCookie(response, token);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
