"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { CheckCircle, Ban, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function GoodbyePage() {
  const searchParams = useSearchParams();
  const { logout } = useAuth();

  const reactivated = searchParams.get("reactivated") === "1";
  const deactivated = searchParams.get("deactivated") === "1";

  useEffect(() => {
    if (reactivated || deactivated) {
      logout(); // ✅ cerrar sesión inmediatamente
    }
  }, [reactivated, deactivated, logout]);

  const icon = reactivated ? (
    <CheckCircle className="h-12 w-12 text-green-600" />
  ) : (
    <Ban className="h-12 w-12 text-red-600" />
  );

  const title = reactivated
    ? "Cuenta reactivada con éxito"
    : "Cuenta desactivada";

  const description = reactivated ? (
    <>
      Tu cuenta ha sido reactivada correctamente. Ahora podés iniciar sesión
      nuevamente para continuar usando la plataforma.
    </>
  ) : (
    <>
      Tu cuenta ha sido desactivada y tu sesión ha sido cerrada. Si cambiás de
      opinión, podés volver a activarla iniciando sesión nuevamente.
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <Card className="max-w-md w-full p-6 shadow-md text-center">
        <CardContent>
          <div className="flex justify-center mb-4">{icon}</div>
          <h1 className="text-2xl font-bold mb-3 text-gray-800">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            <LogIn className="h-5 w-5" />
            Iniciar sesión
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
