"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth-context";

export const ChangePasswordForm = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const toggleVisibility = (field: keyof typeof show) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isTooShort = form.newPass.length > 0 && form.newPass.length < 8;
  const doPasswordsMismatch =
    form.newPass.length > 0 &&
    form.confirm.length > 0 &&
    form.newPass !== form.confirm;

  const isDisabled =
    !form.current ||
    !form.newPass ||
    !form.confirm ||
    isTooShort ||
    doPasswordsMismatch;

  const handleSubmit = async () => {
    if (isDisabled) return;

    setLoading(true);
    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.current,
          newPassword: form.newPass,
        }),
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Contraseña actualizada",
        description: "Tu sesión ha sido cerrada por seguridad.",
      });

      setForm({ current: "", newPass: "", confirm: "" });

      // Cerrar sesión (redirigir a login)
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      toast({
        title: "Error",
        description: "Verificá tu contraseña actual.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  if (!user?.isActive) {
    return (
      <Card className="p-6 shadow-lg border bg-white w-full space-y-6">
        <p className="text-red-600 text-sm">
          Tu cuenta está desactivada. Reactivala para poder cambiar tu
          contraseña.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg border bg-white w-full space-y-6">
      <div className="flex items-center gap-3">
        <LockKeyhole className="text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">
          Cambiar contraseña
        </h2>
      </div>

      <div className="space-y-4">
        {/* Campo actual */}
        <div>
          <Label>Contraseña actual</Label>
          <div className="relative">
            <Input
              type={show.current ? "text" : "password"}
              placeholder="••••••••"
              value={form.current}
              onChange={(e) => handleChange("current", e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => toggleVisibility("current")}
            >
              {show.current ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Nueva contraseña */}
        <div>
          <Label>Nueva contraseña</Label>
          <div className="relative">
            <Input
              type={show.newPass ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={form.newPass}
              onChange={(e) => handleChange("newPass", e.target.value)}
              className={clsx({
                "border-red-500 focus-visible:ring-red-500": isTooShort,
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => toggleVisibility("newPass")}
            >
              {show.newPass ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {isTooShort && (
            <p className="text-sm text-red-500 mt-1">
              La contraseña debe tener al menos 8 caracteres.
            </p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <Label>Confirmar nueva contraseña</Label>
          <div className="relative">
            <Input
              type={show.confirm ? "text" : "password"}
              placeholder="Repetí la nueva contraseña"
              value={form.confirm}
              onChange={(e) => handleChange("confirm", e.target.value)}
              className={clsx({
                "border-red-500 focus-visible:ring-red-500":
                  doPasswordsMismatch,
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => toggleVisibility("confirm")}
            >
              {show.confirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {doPasswordsMismatch && (
            <p className="text-sm text-red-500 mt-1">
              Las contraseñas no coinciden.
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <Button onClick={handleSubmit} disabled={isDisabled || loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </Card>
  );
};
