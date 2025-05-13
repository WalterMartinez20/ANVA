import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserAppRouter } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"

// Obtener un material específico (solo admin)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUserAppRouter()
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        products: {
          include: { product: true },
        },
      },
    })

    if (!material) {
      return NextResponse.json({ error: "Material no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ material })
  } catch (error) {
    console.error("Error al obtener material:", error)
    return NextResponse.json({ error: "Error al obtener material" }, { status: 500 })
  }
}

// Actualizar un material (solo admin)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUserAppRouter()
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const { name, description, stock, unit } = await request.json()
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const existing = await prisma.material.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Material no encontrado" }, { status: 404 })
    }

    const material = await prisma.material.update({
      where: { id },
      data: {
        name,
        description: description ?? existing.description,
        stock: typeof stock === "number" ? stock : existing.stock,
        unit: unit ?? existing.unit,
      },
    })

    return NextResponse.json({ material })
  } catch (error) {
    console.error("Error al actualizar material:", error)
    return NextResponse.json({ error: "Error al actualizar material" }, { status: 500 })
  }
}

// Eliminar un material (solo admin)
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUserAppRouter()
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const existing = await prisma.material.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Material no encontrado" }, { status: 404 })
    }

    const inUse = await prisma.productMaterial.findFirst({ where: { materialId: id } })
    if (inUse) {
      return NextResponse.json(
        { error: "No se puede eliminar el material porque está en uso en productos" },
        { status: 400 }
      )
    }

    await prisma.material.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar material:", error)
    return NextResponse.json({ error: "Error al eliminar material" }, { status: 500 })
  }
}
