import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function parseId(id: string) {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  _req: NextRequest,
  context: any // usar 'any' o 'Record<string, any>' evita problemas con el proxy
) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const rawId = context?.params?.id;
  const id = parseInt(rawId ?? "", 10);
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
  const id = parseInt(rawId ?? "");
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

    // Validación
    for (const p of propiedades) {
      if (typeof p.propiedadId !== "number" || typeof p.valor !== "string") {
        return NextResponse.json(
          { error: "Propiedades mal formateadas." },
          { status: 400 }
        );
      }

      if (p.propiedadId < 0 && (!p.nombre || typeof p.nombre !== "string")) {
        return NextResponse.json(
          { error: "Propiedad nueva sin nombre válido." },
          { status: 400 }
        );
      }

      if (p.propiedadId >= 0 && "nombre" in p) {
        return NextResponse.json(
          { error: "Propiedad existente no debe incluir nombre." },
          { status: 400 }
        );
      }
    }

    const existing = await prisma.material.findUnique({
      where: { id },
      include: {
        propiedades: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Material no encontrado" },
        { status: 404 }
      );
    }

    // ------------------------------------
    // 1. Crear propiedades nuevas si vienen con propiedadId < 0
    // ------------------------------------
    const nuevasPropiedades = propiedades.filter((p: any) => p.propiedadId < 0);
    const propiedadesFinal: { propiedadId: number; valor: string }[] = [];

    for (const p of nuevasPropiedades) {
      const nueva = await prisma.materialProperty.create({
        data: {
          nombre: p.nombre.trim(),
          tipo: "string",
          categoriaId: categoriaId ?? existing.categoriaId ?? 1,
        },
      });
      propiedadesFinal.push({ propiedadId: nueva.id, valor: p.valor });
    }

    // ------------------------------------
    // 2. Agregar propiedades existentes
    // ------------------------------------
    for (const p of propiedades.filter((p: any) => p.propiedadId >= 0)) {
      propiedadesFinal.push({ propiedadId: p.propiedadId, valor: p.valor });
    }

    // ------------------------------------
    // 3. Determinar qué propiedades eliminar (fueron quitadas)
    // ------------------------------------
    const idsEnviado = propiedadesFinal.map((p) => p.propiedadId);
    const idsExistentes = existing.propiedades.map((p) => p.propiedadId);
    const idsAEliminar = idsExistentes.filter((id) => !idsEnviado.includes(id));

    // ------------------------------------
    // 4. Actualizar el material
    // ------------------------------------
    await prisma.material.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description ?? existing.description,
        stock: Number.isFinite(stock) ? stock : existing.stock,
        unit: unit ?? existing.unit,
        categoriaId: categoriaId ?? existing.categoriaId,
        propiedades: {
          deleteMany: {
            propiedadId: { in: idsAEliminar },
          },
          create: propiedadesFinal,
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
  request: Request,
  context: any // 👈 Este debe ser 'any' o sin desestructurar para evitar el bug
) {
  // ✅ Accedemos así para evitar el error
  const rawId = context?.params?.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Validar relaciones
    const count = await prisma.productMaterial.count({
      where: { materialId: id },
    });

    if (count > 0) {
      return NextResponse.json(
        {
          error: `Este material está siendo utilizado en ${count} producto${
            count > 1 ? "s" : ""
          }. Elimínalo de los productos antes de intentar borrarlo.`,
        },
        { status: 400 }
      );
    }

    // Eliminar el material
    await prisma.material.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error eliminando material:", err);

    if (err.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Este material está en uso y no puede ser eliminado. Elimínalo de los productos relacionados primero.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error inesperado al intentar eliminar el material." },
      { status: 500 }
    );
  }
}
