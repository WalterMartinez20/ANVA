import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUserAppRouter } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

function parseId(param: any): number | null {
  const raw = Array.isArray(param) ? param[0] : param;
  const id = parseInt(raw);
  return isNaN(id) ? null : id;
}

// GET - obtener un producto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseId(params.id);
    if (!productId) {
      return NextResponse.json(
        { error: "ID inválido", product: null },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(params.id) },
      include: {
        images: true,
        materials: {
          include: { material: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado", product: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return NextResponse.json(
      { error: "Error al obtener producto", product: null },
      { status: 500 }
    );
  }
}

// PUT - actualizar producto (ya lo conoces)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUserAppRouter();
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const productId = parseId(params.id);
    if (!productId)
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct)
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );

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

    if (!name || !price)
      return NextResponse.json(
        { error: "Nombre y precio son requeridos" },
        { status: 400 }
      );

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ?? existingProduct.stock,
        category,
        colors,
        width,
        height,
        depth,
        strapDescription,
        materialInfo,
      },
    });

    if (Array.isArray(images) || Array.isArray(materials)) {
      const actions = [];

      if (Array.isArray(images)) {
        actions.push(prisma.productImage.deleteMany({ where: { productId } }));
        actions.push(
          ...images.map((img) =>
            prisma.productImage.create({
              data: {
                url: img.url,
                isMain: img.isMain ?? false,
                productId,
              },
            })
          )
        );
      }

      if (Array.isArray(materials)) {
        actions.push(
          prisma.productMaterial.deleteMany({ where: { productId } })
        );
        actions.push(
          ...materials.map((mat) =>
            prisma.productMaterial.create({
              data: {
                productId,
                materialId: mat.materialId,
                quantity: mat.quantity ?? 0,
              },
            })
          )
        );
      }

      await prisma.$transaction(actions);
    }
    const updatedProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        materials: { include: { material: true } },
      },
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

// DELETE - eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUserAppRouter();
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const productId = parseId(params.id);
    if (!productId)
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct)
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );

    const productInOrder = await prisma.orderItem.findFirst({
      where: { productId },
    });
    if (productInOrder) {
      return NextResponse.json(
        {
          error: "No se puede eliminar el producto porque está en pedidos",
        },
        { status: 400 }
      );
    }

    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.productMaterial.deleteMany({ where: { productId } });
    await prisma.favorite.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
