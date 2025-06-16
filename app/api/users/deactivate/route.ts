// app/api/users/deactivate/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserAppRouter } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getCurrentUserAppRouter();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: false }, // asumimos que este campo existe en tu modelo User
    });

    return NextResponse.json({ message: "Cuenta desactivada exitosamente." });
  } catch (error) {
    console.error("Error al desactivar cuenta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
