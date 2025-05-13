import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserAppRouter } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"

function parseId(param: any): number | null {
  const raw = Array.isArray(param) ? param[0] : param
  const id = parseInt(raw)
  return isNaN(id) ? null : id
}

// GET - Obtener imágenes de un producto
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = parseId(params.id)
    if (!productId) return NextResponse.json({ error: "ID de producto inválido" }, { status: 400 })

    const images = await prisma.productImage.findMany({
      where: { productId },
      orderBy: [{ isMain: "desc" }, { id: "asc" }],
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error al obtener imágenes:", error)
    return NextResponse.json({ error: "Error al obtener imágenes" }, { status: 500 })
  }
}

// POST - Añadir imagen (solo admin)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUserAppRouter()
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const productId = parseId(params.id)
    if (!productId) return NextResponse.json({ error: "ID de producto inválido" }, { status: 400 })

    const { url, isMain } = await request.json()
    if (!url) return NextResponse.json({ error: "URL de imagen requerida" }, { status: 400 })

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })

    if (isMain) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isMain: false },
      })
    }

    const image = await prisma.productImage.create({
      data: { url, isMain: isMain ?? false, productId },
    })

    return NextResponse.json({ image }, { status: 201 })
  } catch (error) {
    console.error("Error al añadir imagen:", error)
    return NextResponse.json({ error: "Error al añadir imagen" }, { status: 500 })
  }
}
