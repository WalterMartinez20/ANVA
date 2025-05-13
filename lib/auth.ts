import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { Role } from "@prisma/client";
import { NextApiHandler, NextApiRequest } from "next";
import { NextResponse } from "next/server";

// Constantes para la autenticación
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("No se ha definido la variable secreta de JWT");
}
const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

// Tipos
export type JWTPayload = {
  id: number;
  email: string;
  role: Role;
  nombres: string;
  apellidos: string;
  lastLogin?: number;
};

// Funciones para hash y verificación de contraseñas
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

// Funciones para tokens JWT
export function createToken(payload: JWTPayload): string {
  // Añadir timestamp de último login
  const enrichedPayload = {
    ...payload,
    lastLogin: Date.now(),
  };
  return sign(enrichedPayload, JWT_SECRET as string, {
    // El paquete jsonwebtoken en TypeScript necesita que declares explícitamente que JWT_SECRET es un string (porque process.env.JWT_SECRET puede ser undefined en teoría).
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

// Hay que hacer type assertion correcta y tratar el resultado de verify con más cuidado. Así evitamos forzar un tipo incorrectamente.
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = verify(token, JWT_SECRET as string);
    if (typeof decoded === "object" && decoded !== null) {
      return decoded as JWTPayload;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Funciones para manejo de cookies
// Error: cookies() devuelve una promesa, no un objeto directamente. Problema: estás usando cookies() como si fuera síncrono. Solución: en Next 14+ debes usar await cookies() porque ahora es asíncrono.
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "strict",
  });
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

// Función para obtener el usuario actual desde el token
export async function getCurrentUserAppRouter(): Promise<JWTPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

// Para API Routes (pages/api)
export function getCurrentUserFromApiRequest(
  req: NextApiRequest
): JWTPayload | null {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token);
}

// Utilidad para agregar cookie a la respuesta
export function withAuthCookie(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "strict",
  });
  return response;
}

// Verificaciones de sesión y roles
export function isAuthenticated(): boolean {
  return getAuthCookie() !== undefined;
}

// No puedes usar un resultado de promesa directamente. Porque getCurrentUserAppRouter() ahora devuelve una Promise<JWTPayload | null>. Así que cambia hasRole para ser async también:
export async function hasRole(required: Role): Promise<boolean> {
  const user = await getCurrentUserAppRouter();
  return user !== null && user.role === required;
}

// Middlewares para API Routes
export function requireAuth(handler: NextApiHandler): NextApiHandler {
  return (req, res) => {
    const user = getCurrentUserFromApiRequest(req);
    if (!user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    (req as any).user = user;
    return handler(req, res);
  };
}

export function requireAdmin(handler: NextApiHandler): NextApiHandler {
  return (req, res) => {
    const user = getCurrentUserFromApiRequest(req);
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "No autorizado" });
    }
    (req as any).user = user;
    return handler(req, res);
  };
}
