// app/api/users/addresses/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserAppRouter } from "@/lib/auth";

// GET → Obtener todas las direcciones del usuario
export async function GET() {
  const user = await getCurrentUserAppRouter();
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ addresses });
}

// POST → Crear una nueva dirección
export async function POST(req: NextRequest) {
  const user = await getCurrentUserAppRouter();
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { label, fullText, isDefault } = body;

  if (!label || !fullText) {
    return NextResponse.json(
      { error: "label y fullText son requeridos" },
      { status: 400 }
    );
  }

  // Si será predeterminada, desmarcar las anteriores
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: user.id,
      label,
      fullText,
      isDefault: !!isDefault,
    },
  });

  return NextResponse.json({ address }, { status: 201 });
}
