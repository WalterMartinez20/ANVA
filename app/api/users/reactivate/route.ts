import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getCurrentUserAppRouter,
  createToken,
  withAuthCookie,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getCurrentUserAppRouter();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Actualizar la cuenta
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true },
    });

    // ✅ Crear nuevo token con estado actualizado
    const token = createToken({
      id: updated.id,
      email: updated.email,
      role: updated.role,
      nombres: updated.nombres,
      apellidos: updated.apellidos,
      phone: updated.phone ?? "",
      address: updated.address ?? "",
    });

    // ✅ Insertar cookie en la respuesta
    const response = NextResponse.json({
      message: "Cuenta reactivada con éxito.",
    });
    return withAuthCookie(response, token); // 👈 esto ya está en tu `lib/auth.ts`
  } catch (error) {
    console.error("Error al reactivar cuenta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
