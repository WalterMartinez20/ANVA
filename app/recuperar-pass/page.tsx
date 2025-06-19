"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("El email es requerido");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("El email no es válido");
      return;
    }

    // Aquí iría la lógica para enviar el email de recuperación
    console.log("Solicitud de recuperación enviada para:", email);
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Recuperar contraseña
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          {!submitted ? (
            <>
              <p className="text-muted-foreground mb-4">
                Ingresa tu dirección de correo electrónico y te enviaremos un
                enlace para restablecer tu contraseña.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={error ? "border-red-500" : ""}
                  />
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                </div>

                <Button type="submit" className="w-full">
                  Enviar instrucciones
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Instrucciones enviadas
              </h2>
              <p className="text-muted-foreground mb-4">
                Hemos enviado un correo electrónico a{" "}
                <span className="font-medium">{email}</span> con instrucciones
                para restablecer tu contraseña.
              </p>
              <p className="text-sm text-muted-foreground">
                Si no recibes el correo en unos minutos, revisa tu carpeta de
                spam o{" "}
                <button
                  className="text-primary hover:underline"
                  onClick={() => {
                    setSubmitted(false);
                  }}
                >
                  intenta nuevamente
                </button>
                .
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-4">
          <Link href="/login" className="text-primary hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
