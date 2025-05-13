import { NextResponse } from "next/server";
import { getCurrentUserAppRouter } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUserAppRouter();

    if (!currentUser || currentUser.role === Role.GUEST) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const productId = Number.parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID de producto inválido" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: currentUser.id,
        productId,
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorito no encontrado" },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar de favoritos:", error);
    return NextResponse.json(
      { error: "Error al eliminar de favoritos" },
      { status: 500 }
    );
  }
}
