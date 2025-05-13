import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUserAppRouter } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

function parseId(param: any): number | null {
  const raw = Array.isArray(param) ? param[0] : param;
  const id = parseInt(raw);
  return isNaN(id) ? null : id;
}

// PUT - Actualizar imagen (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const currentUser = await getCurrentUserAppRouter();
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const productId = parseId(params.id);
    const imageId = parseId(params.imageId);
    if (!productId || !imageId)
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const { url, isMain } = await request.json();

    const existingImage = await prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });

    if (!existingImage)
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      );

    if (isMain) {
      await prisma.productImage.updateMany({
        where: {
          productId,
          id: { not: imageId },
        },
        data: { isMain: false },
      });
    }

    const updated = await prisma.productImage.update({
      where: { id: imageId },
      data: {
        url: url ?? existingImage.url,
        isMain: isMain ?? existingImage.isMain,
      },
    });

    return NextResponse.json({ image: updated });
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    return NextResponse.json(
      { error: "Error al actualizar imagen" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar imagen (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const currentUser = await getCurrentUserAppRouter();
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const productId = parseId(params.id);
    const imageId = parseId(params.imageId);
    if (!productId || !imageId)
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const existingImage = await prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });

    if (!existingImage)
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      );

    const imageCount = await prisma.productImage.count({
      where: { productId },
    });
    if (imageCount <= 1) {
      return NextResponse.json(
        { error: "No se puede eliminar la última imagen" },
        { status: 400 }
      );
    }

    await prisma.productImage.delete({ where: { id: imageId } });

    if (existingImage.isMain) {
      const newMain = await prisma.productImage.findFirst({
        where: { productId },
        orderBy: { id: "asc" },
      });
      if (newMain) {
        await prisma.productImage.update({
          where: { id: newMain.id },
          data: { isMain: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return NextResponse.json(
      { error: "Error al eliminar imagen" },
      { status: 500 }
    );
  }
}
