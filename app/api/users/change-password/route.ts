import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserAppRouter } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const user = await getCurrentUserAppRouter();
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Ambos campos son requeridos" },
      { status: 400 }
    );
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!userRecord || !userRecord.password) {
    return NextResponse.json({ error: "Usuario no válido" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(currentPassword, userRecord.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "La contraseña actual no es correcta" },
      { status: 401 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return NextResponse.json(
    { message: "Contraseña actualizada correctamente" },
    { status: 200 }
  );
}
