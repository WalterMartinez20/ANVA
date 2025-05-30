// * Función: Obtener productos de una categoría específica + editar/eliminar categoría.
// * ✔️ Correcto: Perfecto para páginas como /categoria/bolsos y gestión desde el panel de admin.

import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { getCurrentUserAppRouter } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sort = searchParams.get("sort") || "name_asc";
    const skip = (page - 1) * limit;

    const category = await prisma.category.findUnique({ where: { slug } });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    let orderBy: Record<string, any> = {};
    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "name_desc":
        orderBy = { name: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { name: "asc" };
    }

    const where = { categorySlug: slug };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: true,
          category: {
            select: { name: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // 🔁 Estandariza el formato como en /api/search
    const mappedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category?.name || "",
      images: p.images,
    }));

    return NextResponse.json({
      category: {
        name: category.name,
        description: category.description,
        slug: category.slug,
      },
      products: mappedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    return NextResponse.json(
      { error: "Error al obtener categoría" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const currentUser = await getCurrentUserAppRouter();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { slug } = params;
    const { name, description } = await request.json();

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    let newSlug = slug;
    if (name && name !== existing.name) {
      newSlug = slugify(name);
      const conflict = await prisma.category.findUnique({
        where: { slug: newSlug },
      });
      if (conflict && conflict.id !== existing.id) {
        return NextResponse.json(
          { error: "Ya existe una categoría con este nombre" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id: existing.id },
      data: {
        name: name || existing.name,
        slug: newSlug,
        description: description ?? existing.description,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return NextResponse.json(
      { error: "Error al actualizar categoría" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const currentUser = await getCurrentUserAppRouter();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { slug } = params;

    const category = await prisma.category.findUnique({ where: { slug } });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    await prisma.category.delete({ where: { id: category.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return NextResponse.json(
      { error: "Error al eliminar categoría" },
      { status: 500 }
    );
  }
}
