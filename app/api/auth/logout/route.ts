import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth"

export async function POST() {
  try {
    // Eliminar cookie de autenticación
    await removeAuthCookie()
    return NextResponse.json({ message: "Sesion cerrada con exito",success: true })
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 })
  }
}
