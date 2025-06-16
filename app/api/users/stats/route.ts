import { NextResponse } from "next/server";
import { getCurrentUserAppRouter } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const currentUser = await getCurrentUserAppRouter();

    if (!currentUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener estadísticas de pedidos
    const ordersStats = await prisma.order.aggregate({
      where: {
        userId: currentUser.id,
      },
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
    });

    // Obtener el último pedido
    const lastOrder = await prisma.order.findFirst({
      where: {
        userId: currentUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    // Contar favoritos
    const favoritesCount = await prisma.favorite.count({
      where: {
        userId: currentUser.id,
      },
    });

    // Contar reseñas (si existe la tabla)
    let reviewsCount = 0;
    try {
      reviewsCount = await prisma.review.count({
        where: {
          userId: currentUser.id,
        },
      });
    } catch (error) {
      console.log("La tabla de reseñas no existe o no está accesible");
    }

    return NextResponse.json({
      stats: {
        totalOrders: ordersStats._count.id || 0,
        totalSpent: ordersStats._sum.total || 0,
        favoritesCount,
        reviewsCount,
        lastOrderDate: lastOrder?.createdAt || null,
      },
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
