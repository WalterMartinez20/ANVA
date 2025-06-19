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

    // Validar estructura de propiedades
    for (const p of propiedades) {
      if (typeof p.propiedadId !== "number" || typeof p.valor !== "string") {
        return NextResponse.json(
          { error: "Propiedades mal formateadas." },
          { status: 400 }
        );
      }

      if (p.propiedadId < 0) {
        if (!p.nombre || typeof p.nombre !== "string" || !p.nombre.trim()) {
          return NextResponse.json(
            { error: "Propiedad nueva sin nombre válido." },
            { status: 400 }
          );
        }
      } else {
        if ("nombre" in p) {
          return NextResponse.json(
            { error: "Propiedad existente no debe incluir nombre." },
            { status: 400 }
          );
        }
      }
    }

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

    // 1. Separar propiedades nuevas (id < 0) y existentes
    const nuevasPropiedades = propiedades.filter(
      (p: any) => p.propiedadId < 0 && p.nombre
    );
    const propiedadesFinal: { propiedadId: number; valor: string }[] = [];

    // 2. Crear nuevas propiedades en la tabla Propiedad
    for (const p of nuevasPropiedades) {
      const nueva = await prisma.materialProperty.create({
        data: {
          nombre: p.nombre.trim(),
          tipo: "string", // asunción
          categoriaId,
        },
      });
      propiedadesFinal.push({ propiedadId: nueva.id, valor: p.valor });
    }

    // 3. Agregar las propiedades ya existentes
    for (const p of propiedades.filter((p: any) => p.propiedadId >= 0)) {
      propiedadesFinal.push({ propiedadId: p.propiedadId, valor: p.valor });
    }

    // 4. Crear el material
    const material = await prisma.material.create({
      data: {
        name: name.trim(),
        description: description || null,
        stock: Number.isFinite(stock) ? stock : 0,
        unit: unit || null,
        categoriaId,
        propiedades: {
          create: propiedadesFinal,
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
