import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUserAppRouter } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

// GET - obtener lista de productos con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "name_asc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = category ? { category } : {};

    let orderBy = {};
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

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { images: true },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

// POST - crear producto (solo admin)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserAppRouter();

    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const {
      name,
      description,
      price,
      stock,
      category,
      colors,
      width,
      height,
      depth,
      strapDescription,
      materialInfo,
      images,
      materials,
    } = await request.json();

    if (!name || !price) {
      return NextResponse.json(
        { error: "Nombre y precio son requeridos" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ?? 0,
        category,
        colors,
        width,
        height,
        depth,
        strapDescription,
        materialInfo,
      },
    });

    if (Array.isArray(images)) {
      await prisma.$transaction(
        images.map((img) =>
          prisma.productImage.create({
            data: {
              url: img.url,
              isMain: img.isMain ?? false,
              productId: product.id,
            },
          })
        )
      );
    }

    if (Array.isArray(materials)) {
      await prisma.$transaction(
        materials.map((mat) =>
          prisma.productMaterial.create({
            data: {
              productId: product.id,
              materialId: mat.materialId,
              quantity: mat.quantity ?? 0,
            },
          })
        )
      );
    }

    const productWithRelations = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        materials: {
          include: { material: true },
        },
      },
    });

    return NextResponse.json(
      { product: productWithRelations },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
