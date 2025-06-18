import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET() {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const categories = await prisma.materialCategory.findMany({
      include: { propiedades: true },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET /material-category error:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const { nombre } = await request.json();

    if (!nombre || typeof nombre !== "string") {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }

    const existing = await prisma.materialCategory.findUnique({
      where: { nombre },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una categoría con ese nombre" },
        { status: 409 }
      );
    }

    const category = await prisma.materialCategory.create({
      data: { nombre },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("POST /material-category error:", error);
    return NextResponse.json(
      { error: "Error al crear categoría" },
      { status: 500 }
    );
  }
}
