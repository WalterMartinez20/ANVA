// * Función: Endpoint exclusivo para la búsqueda general de productos (/buscar?q=...)
// * Usa filtros, paginación, ordenamiento, incluye imágenes y nombre de categoría.

import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q")?.trim().toLowerCase() || "";
    const categorySlug = searchParams.get("category") || "";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "12");
    const sort = searchParams.get("sort") || "name_asc";
    const isAutocomplete = searchParams.get("autocomplete") === "true";

    const skip = (page - 1) * limit;
    const minPrice = parseFloat(searchParams.get("min") || "0");
    const maxPrice = parseFloat(searchParams.get("max") || "999999");

    if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) {
      return NextResponse.json(
        { error: "Parámetros de precio inválidos" },
        { status: 400 }
      );
    }

    if (isAutocomplete && query.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const filters: any = {
      price: { gte: minPrice, lte: maxPrice },
    };

    if (query.length > 0) {
      filters.name = { contains: query };
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

    // Define ordenamiento
    let orderBy: any = {};
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

    // 👇 SELECT dinámico según si es autocomplete
    // 👇 Primero define el SELECT dinámico antes del findMany
    const select = isAutocomplete
      ? {
          id: true,
          name: true,
          price: true,
          images: {
            take: 1,
            where: { isMain: true },
            select: { url: true },
          },
        }
      : {
          id: true,
          name: true,
          price: true,
          category: { select: { name: true } },
          images: {
            select: {
              id: true,
              url: true,
              isMain: true,
              createdAt: true,
            },
          },
        };

    // 👇 Luego úsalo aquí en findMany
    const products = await prisma.product.findMany({
      where: filters,
      orderBy,
      skip: isAutocomplete ? 0 : skip,
      take: isAutocomplete ? 5 : limit,
      select, // ✅ usamos la variable aquí
    });

    const mappedProducts = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      ...(isAutocomplete
        ? {
            image: p.images?.[0]?.url || "/placeholder.svg",
          }
        : {
            category: p.category?.name || "",
            images: p.images || [],
          }),
    }));

    const total = isAutocomplete
      ? undefined
      : await prisma.product.count({ where: filters });

    return NextResponse.json({
      products: mappedProducts,
      ...(total !== undefined && {
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }),
    });
  } catch (error: any) {
    console.error("🔴 Error en API /search:", error.message);
    return NextResponse.json(
      { error: "Error al buscar productos" },
      { status: 500 }
    );
  }
}
