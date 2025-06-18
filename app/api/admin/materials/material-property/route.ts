import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET() {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const propiedades = await prisma.materialProperty.findMany({
      include: { categoria: true },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json({ propiedades });
  } catch (error) {
    console.error("GET /material-property error:", error);
    return NextResponse.json(
      { error: "Error al obtener propiedades" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const { nombre, tipo, categoriaId } = await request.json();

    if (
      !nombre ||
      typeof nombre !== "string" ||
      !["string", "number", "boolean"].includes(tipo) ||
      typeof categoriaId !== "number"
    ) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const propiedad = await prisma.materialProperty.create({
      data: { nombre, tipo, categoriaId },
    });

    return NextResponse.json({ propiedad }, { status: 201 });
  } catch (error) {
    console.error("POST /material-property error:", error);
    return NextResponse.json(
      { error: "Error al crear propiedad" },
      { status: 500 }
    );
  }
}
