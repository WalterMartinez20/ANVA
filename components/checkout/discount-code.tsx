"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Tag, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DiscountCodeProps {
  discountApplied: boolean;
  setDiscountApplied: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DiscountCode({
  discountApplied,
  setDiscountApplied,
}: DiscountCodeProps) {
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCode = () => {
    if (!code) {
      toast({
        title: "Código vacío",
        description: "Por favor ingresa un código de descuento",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);

    // Simular verificación
    setTimeout(() => {
      setIsApplying(false);
      setDiscountApplied(true);
      setAppliedCode(code);
      toast({
        title: "Código aplicado",
        description: "Tu código de descuento ha sido aplicado correctamente",
      });
    }, 1000);
  };

  const handleRemoveCode = () => {
    setDiscountApplied(false);
    setAppliedCode("");
    setCode("");
    toast({
      title: "Código eliminado",
      description: "El código de descuento ha sido eliminado",
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Código de Descuento</h3>
          {discountApplied && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Aplicado
            </Badge>
          )}
        </div>

        {discountApplied ? (
          <div className="bg-green-50 p-3 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{appliedCode}</p>
                <p className="text-sm text-green-700">
                  10% de descuento aplicado
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveCode}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Eliminar código</span>
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Código de descuento"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={handleApplyCode} disabled={isApplying}>
              {isApplying ? (
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
                  Aplicando
                </>
              ) : (
                "Aplicar"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
