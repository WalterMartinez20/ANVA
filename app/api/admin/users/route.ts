import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { nombres, apellidos, email, role, phone, address } =
      await req.json();

    const nuevoUsuario = await prisma.user.create({
      data: {
        nombres,
        apellidos,
        email,
        password: "temporal123", // ⚠️ placeholder — hashear luego
        role,
        phone,
        address,
        isActive: true,
      },
    });

    return NextResponse.json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
