import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createToken, withAuthCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { nombres, apellidos, email, password, phone, address } =
      await req.json();

    // Validar datos
    if (!nombres || !apellidos || !email || !password || !phone || !address) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        nombres,
        apellidos,
        email,
        password: hashedPassword,
        phone,
        address,
        role: Role.USER,
        isActive: true,
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        isActive: true, // Lo incluimos también para usarlo en el frontend
      },
    });

    // Crear token JWT
    const token = createToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      nombres: newUser.nombres,
      apellidos: newUser.apellidos,
      phone: newUser.phone ?? undefined,
      address: newUser.address ?? undefined,
    });

    // Crear respuesta y setear cookie
    const response = NextResponse.json({ user: newUser });
    withAuthCookie(response, token); // Agregar el token a la respuesta correctamente
    return response;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    );
  }
}
