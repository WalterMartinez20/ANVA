import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserAppRouter } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(_req: NextRequest) {
  try {
    const user = await getCurrentUserAppRouter();
    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const categories = await prisma.materialCategory.findMany({
      include: {
        materiales: {
          include: {
            propiedades: {
              include: { propiedad: true },
            },
          },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET /api/admin/materials/grouped error:", error);
    return NextResponse.json(
      { error: "Error al obtener materiales agrupados" },
      { status: 500 }
    );
  }
}
/*
* Objeto que devuelve:
{
  "categories": [
    {
      "id": 1,
      "nombre": "Ovillos de trapillo",
      "materiales": [
        {
          "id": 10,
          "name": "Azul Rey Stretch",
          "stock": 1,
          "unit": "pieza",
          "propiedades": [
            {
              "valor": "200g",
              "propiedad": { "nombre": "Gramos", "tipo": "TEXT" }
            },
            {
              "valor": "$2.75",
              "propiedad": { "nombre": "Precio", "tipo": "TEXT" }
            }
          ]
        },
        ...
      ]
    },
    ...
  ]
}
*/
