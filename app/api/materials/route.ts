import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserAppRouter } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"

// Obtener todos los materiales (solo admin)
export async function GET() {
  try {
    const currentUser = await getCurrentUserAppRouter()
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const materials = await prisma.material.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ materials })
  } catch (error) {
    console.error("Error al obtener materiales:", error)
    return NextResponse.json({ error: "Error al obtener materiales" }, { status: 500 })
  }
}

// Crear un nuevo material (solo admin)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserAppRouter()
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { name, description, stock, unit } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const existing = await prisma.material.findUnique({ where: { name } })
    if (existing) {
      return NextResponse.json({ error: "Ya existe un material con ese nombre" }, { status: 400 })
    }

    const material = await prisma.material.create({
      data: {
        name,
        description: description || "",
        stock: typeof stock === "number" ? stock : 0,
        unit: unit || "",
      },
    })

    return NextResponse.json({ material }, { status: 201 })
  } catch (error) {
    console.error("Error al crear material:", error)
    return NextResponse.json({ error: "Error al crear material" }, { status: 500 })
  }
}
