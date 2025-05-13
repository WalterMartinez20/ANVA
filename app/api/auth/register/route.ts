import { NextRequest, NextResponse } from "next/server"
import { hashPassword, createToken, withAuthCookie } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const { nombres, apellidos, email, password } = await req.json()

    // Validar datos
    if (!nombres || !apellidos || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 400 });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password)

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        nombres,
        apellidos,
        email,
        password: hashedPassword,
        role: Role.USER, // Por defecto, todos los registros son usuarios normales
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },

    })

    // Crear token JWT
    const token = createToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      nombres: newUser.nombres,
      apellidos: newUser.apellidos,
    })

    // Crear respuesta y setear cookie
    const response = NextResponse.json({ user: newUser })
    withAuthCookie(response, token) // Agregar el token a la respuesta correctamente
    return response;
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}
