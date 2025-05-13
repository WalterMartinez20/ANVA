import { NextResponse } from "next/server"
import { getCurrentUserAppRouter } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUserAppRouter()

    if (!currentUser || currentUser.role === Role.GUEST) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const orderId = Number.parseInt(params.id)

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "ID de pedido inválido" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    if (currentUser.role !== Role.ADMIN && order.userId !== currentUser.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error al obtener pedido:", error)
    return NextResponse.json({ error: "Error al obtener pedido" }, { status: 500 })
  }
}
