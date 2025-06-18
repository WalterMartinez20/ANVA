import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function parseId(id: string) {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  _req: NextRequest,
  context: { params?: { id?: string } }
) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { id: rawId } = context.params ?? {};
  const id = parseId(rawId ?? "");
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        categoria: true,
        propiedades: { include: { propiedad: true } },
        products: { include: { product: true } },
      },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ material });
  } catch (err) {
    console.error("GET /materials/[id] error:", err);
    return NextResponse.json(
      { error: "Error al obtener material" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params?: { id?: string } }
) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { id: rawId } = context.params ?? {};
  const id = parseId(rawId ?? "");
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const {
      name,
      description,
      stock,
      unit,
      categoriaId,
      propiedades = [],
    } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }

    const existing = await prisma.material.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Material no encontrado" },
        { status: 404 }
      );
    }

    await prisma.material.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description ?? existing.description,
        stock: Number.isFinite(stock) ? stock : existing.stock,
        unit: unit ?? existing.unit,
        categoriaId: categoriaId ?? existing.categoriaId,
        propiedades: {
          deleteMany: {},
          create: propiedades.map(
            (p: { propiedadId: number; valor: string }) => ({
              propiedadId: p.propiedadId,
              valor: p.valor,
            })
          ),
        },
      },
    });

    const updated = await prisma.material.findUnique({
      where: { id },
      include: {
        categoria: true,
        propiedades: { include: { propiedad: true } },
      },
    });

    return NextResponse.json({ material: updated });
  } catch (err) {
    console.error("PUT /materials/[id] error:", err);
    return NextResponse.json(
      { error: "Error al actualizar material" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params?: { id?: string } }
) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { id: rawId } = context.params ?? {};
  const id = parseId(rawId ?? "");
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const exists = await prisma.material.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json(
        { error: "Material no encontrado" },
        { status: 404 }
      );
    }

    const linked = await prisma.productMaterial.findFirst({
      where: { materialId: id },
    });
    if (linked) {
      return NextResponse.json(
        { error: "No se puede eliminar: material en uso" },
        { status: 400 }
      );
    }

    await prisma.material.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /materials/[id] error:", err);
    return NextResponse.json(
      { error: "Error al eliminar material" },
      { status: 500 }
    );
  }
}
