"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem("cookie_consent", accepted ? "accepted" : "rejected");
    setVisible(false);
  };

  const resetConsent = () => {
    localStorage.removeItem("cookie_consent");
    setVisible(true);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:w-auto sm:max-w-md bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 animate-fade-in transition-all">
      <div className="flex items-start gap-3">
        <div className="hidden sm:flex bg-primary/10 p-2 rounded-md">
          <Cookie className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1 text-sm text-gray-700">
          <p>
            Este sitio usa cookies para mejorar la experiencia, analizar el
            tráfico y personalizar contenido.{" "}
            <Link
              href="/politicas/cookies"
              className="text-primary underline font-medium"
            >
              Más información
            </Link>
            .
          </p>

          <div className="flex flex-wrap gap-2 pt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleConsent(false)}
            >
              Rechazar
            </Button>
            <Button size="sm" onClick={() => handleConsent(true)}>
              Aceptar
            </Button>
            <button
              onClick={resetConsent}
              className="text-xs text-gray-400 hover:text-gray-600 underline ml-auto"
            >
              Resetear cookies
            </button>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
