"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MembershipSectionProps {
  membershipApplied: boolean;
  setMembershipApplied: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MembershipSection({
  membershipApplied,
  setMembershipApplied,
}: MembershipSectionProps) {
  const [membershipCode, setMembershipCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyMembership = () => {
    if (!membershipCode) {
      toast({
        title: "Código vacío",
        description: "Por favor ingresa tu código de membresía",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    // Simular verificación
    setTimeout(() => {
      setIsVerifying(false);
      setMembershipApplied(true);
      toast({
        title: "Membresía aplicada",
        description: "Tu membresía Premium ha sido aplicada correctamente",
      });
    }, 1500);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Membresía</h3>
          {membershipApplied && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Aplicada
            </Badge>
          )}
        </div>

        {membershipApplied ? (
          <div className="bg-green-50 p-3 rounded-md flex items-center gap-3">
            <User className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Membresía Premium</p>
              <p className="text-sm text-green-700">5% de descuento aplicado</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="h-4 w-4" />
              <span>
                Ingresa tu código de membresía para obtener beneficios
                exclusivos
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Código de membresía"
                value={membershipCode}
                onChange={(e) => setMembershipCode(e.target.value)}
              />
              <Button onClick={handleVerifyMembership} disabled={isVerifying}>
                {isVerifying ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verificando
                  </>
                ) : (
                  "Aplicar"
                )}
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              ¿No tienes una membresía?{" "}
              <a href="/membership" className="text-primary hover:underline">
                Obtén una aquí
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
