import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET() {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const materials = await prisma.material.findMany({
      orderBy: { name: "asc" },
      include: {
        categoria: true,
        propiedades: {
          include: { propiedad: true },
        },
      },
    });

    return NextResponse.json({ materials });
  } catch (err) {
    console.error("GET /materials error:", err);
    return NextResponse.json(
      { error: "Error al obtener materiales" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const {
      name,
      description = "",
      stock = 0,
      unit = "",
      categoriaId,
      propiedades = [],
    } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    if (!categoriaId || typeof categoriaId !== "number") {
      return NextResponse.json(
        { error: "La categoría es obligatoria" },
        { status: 400 }
      );
    }

    const existing = await prisma.material.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un material con ese nombre" },
        { status: 409 }
      );
    }

    const material = await prisma.material.create({
      data: {
        name: name.trim(),
        description: description || null,
        stock: Number.isFinite(stock) ? stock : 0,
        unit: unit || null,
        categoriaId,
        propiedades: {
          create: propiedades.map(
            (p: { propiedadId: number; valor: string }) => ({
              propiedadId: p.propiedadId,
              valor: p.valor,
            })
          ),
        },
      },
      include: {
        categoria: true,
        propiedades: {
          include: { propiedad: true },
        },
      },
    });

    return NextResponse.json({ material }, { status: 201 });
  } catch (err) {
    console.error("POST /materials error:", err);
    return NextResponse.json(
      { error: "Error al crear material" },
      { status: 500 }
    );
  }
}
