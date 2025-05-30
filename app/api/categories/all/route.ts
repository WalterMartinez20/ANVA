// * Función: Obtener todas las categorías sin filtros.
// * ✔️ Correcto: Ideal para usarse en panel de administración o en CategorySidebar.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: { name: true, slug: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories); // ✅ devuelve array directo
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}
