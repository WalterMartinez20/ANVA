// * Función: Endpoint exclusivo para la búsqueda general de productos (/buscar?q=...)
// * ✔️ Correcto: Usa filtros, paginación, ordenamiento, incluye imágenes y nombre de categoría.

import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category") || "";
    const minPrice = Number(searchParams.get("min") || "0");
    const maxPrice = Number(searchParams.get("max") || "999999");
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "12");
    const sort = searchParams.get("sort") || "name_asc";
    const skip = (page - 1) * limit;

    const filters: any = {
      price: { gte: minPrice, lte: maxPrice },
    };

    if (query) {
      filters.name = { contains: query, mode: "insensitive" };
    }

    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (!category) {
        return NextResponse.json({
          products: [],
          pagination: { total: 0, page, limit, totalPages: 0 },
        });
      }

      filters.categorySlug = categorySlug;
    }

    // ✅ orderBy con typing homogéneo
    let orderBy: { [key: string]: "asc" | "desc" } = {};
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

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        orderBy,
        skip,
        take: limit,
        include: {
          images: true,
          category: true,
        },
      }),
      prisma.product.count({ where: filters }),
    ]);

    const mappedProducts = products.map((p) => ({
      ...p,
      category: p.category?.name ?? "",
    }));

    return NextResponse.json({
      products: mappedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return NextResponse.json(
      { error: "Error al buscar productos" },
      { status: 500 }
    );
  }
}
