import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUserAppRouter } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

// Obtener todos los favoritos del usuario actual
export async function GET() {
  try {
    const currentUser = await getCurrentUserAppRouter();

    if (!currentUser || currentUser.role === Role.GUEST) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: currentUser.id },
      include: {
        product: {
          include: {
            images: true, // Incluye imagenes del producto
          },
        },
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return NextResponse.json(
      { error: "Error al obtener favoritos" },
      { status: 500 }
    );
  }
}

// Añadir un producto a favoritos
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserAppRouter();

    if (!currentUser || currentUser.role === Role.GUEST) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "ID de producto requerido" },
        { status: 400 }
      );
    }

    // Verificar si el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: currentUser.id,
        productId,
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "El producto ya está en favoritos" },
        { status: 409 }
      );
    }

    // Añadir a favoritos
    const favorite = await prisma.favorite.create({
      data: {
        userId: currentUser.id,
        productId,
      },
      include: { product: true },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error("Error al añadir a favoritos:", error);
    return NextResponse.json(
      { error: "Error al añadir a favoritos" },
      { status: 500 }
    );
  }
}
