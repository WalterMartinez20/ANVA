// app/api/users/addresses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserAppRouter } from "@/lib/auth";

// Eliminar dirección
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUserAppRouter();
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const addressId = parseInt(params.id);
  if (isNaN(addressId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== user.id) {
    return NextResponse.json(
      { error: "No autorizado para eliminar" },
      { status: 403 }
    );
  }

  await prisma.address.delete({ where: { id: addressId } });
  return NextResponse.json({ success: true });
}

// PATCH → Actualizar dirección (label, texto o setear como predeterminada)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUserAppRouter();
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const addressId = parseInt(params.id);
  if (isNaN(addressId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();
  const { label, fullText, isDefault } = body;

  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== user.id) {
    return NextResponse.json(
      { error: "Dirección no encontrada o no autorizada" },
      { status: 403 }
    );
  }

  if (isDefault === true) {
    // Desmarcar otras
    await prisma.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id: addressId },
    data: {
      ...(label && { label }),
      ...(fullText && { fullText }),
      ...(isDefault !== undefined && { isDefault }),
    },
  });

  return NextResponse.json({ address: updated });
}
