import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
        materials: {
          include: { material: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      products: products.map((product) => ({
        ...product,
        category: product.category?.name ?? "",
      })),
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      stock,
      category, // se espera el nombre de la categoría
      colors,
      width,
      height,
      depth,
      strapDescription,
      materialInfo,
      images,
      materials,
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Buscar la categoría por nombre
    const categoryRecord = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!categoryRecord) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        categorySlug: categoryRecord.slug,
        colors: colors?.join(", "),
        width,
        height,
        depth,
        strapDescription,
        materialInfo,
        images: {
          create:
            images?.map((img: any) => ({
              url: img.url,
              isMain: img.isMain || false,
            })) || [],
        },
        materials: {
          create:
            materials?.map((m: any) => ({
              materialId: m.material.id,
              quantity: m.quantity,
            })) || [],
        },
      },
    });

    const created = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        images: true,
        category: true,
        materials: { include: { material: true } },
      },
    });

    return NextResponse.json(
      {
        product: {
          ...created,
          category: created?.category?.name ?? "",
        },
      },
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
