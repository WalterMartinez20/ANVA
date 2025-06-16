// app/api/stock-check/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { cartItems } = await req.json();

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuficiente para el producto "${
              product?.name || "desconocido"
            }"`,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en /api/stock-check:", error);
    return NextResponse.json(
      { error: "Error al verificar stock" },
      { status: 500 }
    );
  }
}
