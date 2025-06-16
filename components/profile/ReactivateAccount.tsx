"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export const ReactivateAccount = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { reactivate } = useAuth();
  const router = useRouter(); // ✅ CORREGIDO

  const handleReactivate = async () => {
    setLoading(true);
    try {
      await reactivate(); // ya refresca el user internamente

      toast({
        title: "Cuenta reactivada",
        description: "Ahora tu cuenta está activa nuevamente.",
      });

      router.refresh();
    } catch {
      toast({
        title: "Error",
        description: "No se pudo reactivar la cuenta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">
        Cuenta inactiva
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Tu cuenta está actualmente desactivada. Podés reactivarla cuando
        quieras.
      </p>
      <Button variant="default" onClick={handleReactivate} disabled={loading}>
        {loading ? "Reactivando..." : "Reactivar cuenta"}
      </Button>
    </div>
  );
};
