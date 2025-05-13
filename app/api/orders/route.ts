import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserAppRouter } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"

// Obtener todos los pedidos del usuario actual
export async function GET() {
  try {
    const currentUser = await getCurrentUserAppRouter()

    if (!currentUser || currentUser.role === Role.GUEST) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: currentUser.role === Role.ADMIN ? {} : { userId: currentUser.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

// Crear un nuevo pedido
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserAppRouter()

    if (!currentUser || currentUser.role === Role.GUEST) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items de pedido requeridos" }, { status: 400 })
    }

    let total = 0
    const orderItems = []

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== "number") {
        return NextResponse.json({ error: "Formato de item inválido" }, { status: 400 })
      }

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json({ error: `Producto ${item.productId} no encontrado` }, { status: 404 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Stock insuficiente para el producto ${product.name}` }, { status: 400 })
      }

      const itemTotal = product.price * item.quantity
      total += itemTotal

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })
    }

    const order = await prisma.order.create({
      data: {
        userId: currentUser.id,
        total,
        status: "PENDING",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    })

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("Error al crear pedido:", error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  }
}
