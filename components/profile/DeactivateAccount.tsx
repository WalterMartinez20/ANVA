// components/DeactivateAccount.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export const DeactivateAccount = () => {
  const [loading, setLoading] = useState(false);
  const { logout, deactivate } = useAuth();

  const router = useRouter();

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await deactivate();

      toast({
        title: "Cuenta desactivada",
        description: "Tu sesión ha sido cerrada. Serás redirigido...",
      });

      router.push("/goodbye?deactivated=1");
    } catch {
      toast({
        title: "Error al desactivar cuenta",
        description: "Intentá de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-lg font-semibold text-red-600 mb-2">
        Desactivar Cuenta
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Al desactivar tu cuenta perderás el acceso inmediato, pero podrás
        reactivarla fácilmente al iniciar sesión nuevamente.
      </p>
      <Button
        variant="destructive"
        onClick={handleDeactivate}
        disabled={loading}
      >
        {loading ? "Desactivando..." : "Desactivar mi cuenta"}
      </Button>
    </div>
  );
};
