import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUserAppRouter } from "@/lib/auth";
import { Role } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const currentUser = await getCurrentUserAppRouter();
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Procesar la solicitud multipart/form-data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)",
        },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error:
            "El archivo es demasiado grande. El tamaño máximo permitido es 5MB",
        },
        { status: 400 }
      );
    }

    // Crear nombre de archivo único
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Asegurarse de que el directorio existe
    const publicDir = path.join(process.cwd(), "public");
    const uploadsDir = path.join(publicDir, "uploads");

    // Convertir el archivo a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Asegurarse de que el directorio exista
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Guardar el archivo
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Devolver la URL del archivo
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: fileUrl }, { status: 201 });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json(
      { error: "Error al procesar la subida del archivo" },
      { status: 500 }
    );
  }
}
