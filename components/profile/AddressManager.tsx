"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Check, X, Star, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface Address {
  id: number;
  label: string;
  fullText: string;
  isDefault: boolean;
}

interface AddressManagerProps {
  onDefaultChange?: () => void;
}

export function AddressManager({ onDefaultChange }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Address>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newFullText, setNewFullText] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const res = await fetch("/api/users/addresses");
    const data = await res.json();
    setAddresses(data.addresses || []);
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({ label: address.label, fullText: address.fullText });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({});
  };

  const handleUpdate = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Dirección actualizada" });
      fetchAddresses();
      handleCancel();
      onDefaultChange?.();
    } catch {
      toast({ title: "Error al actualizar", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta dirección?")) return;
    const res = await fetch(`/api/users/addresses/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Dirección eliminada" });
      fetchAddresses();
    }
  };

  const handleSetDefault = async (id: number) => {
    const res = await fetch(`/api/users/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    if (res.ok) {
      toast({ title: "Dirección actualizada como predeterminada" });
      fetchAddresses();
      onDefaultChange?.();
    }
  };

  const handleCreate = async () => {
    if (!newLabel || !newFullText) {
      toast({ title: "Campos incompletos", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel, fullText: newFullText }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Dirección guardada" });
      setNewLabel("");
      setNewFullText("");
      fetchAddresses();
    } catch {
      toast({ title: "Error al guardar", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.isActive) {
    return (
      <div className="text-red-600 text-sm mt-4">
        Tu cuenta está desactivada. Reactivala desde tu perfil para gestionar
        direcciones.
      </div>
    );
  }

  return (
    <Card className="p-6 shadow-lg border bg-white w-full space-y-6">
      <div className="flex items-center gap-3">
        <MapPin className="text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Direcciones</h2>
      </div>

      {/* Nueva dirección */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">
          Agregar nueva dirección
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder="Etiqueta (Ej. Casa, Oficina)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <Input
            placeholder="Colonia San Benito, Calle 12 #123"
            value={newFullText}
            onChange={(e) => setNewFullText(e.target.value)}
          />
        </div>
        <div className="text-right">
          <Button
            onClick={handleCreate}
            disabled={isLoading || !newLabel.trim() || !newFullText.trim()}
          >
            Guardar dirección
          </Button>
        </div>
      </div>

      {/* Lista de direcciones */}
      {addresses.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No tienes direcciones registradas.
        </p>
      ) : (
        addresses.map((addr) => (
          <div
            key={addr.id}
            className={cn(
              "relative p-5 border rounded-md bg-white shadow-sm space-y-2",
              addr.isDefault && "border-primary ring-1 ring-primary/40"
            )}
          >
            {editingId === addr.id ? (
              <div className="space-y-2">
                <Input
                  placeholder="Etiqueta"
                  value={form.label || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, label: e.target.value }))
                  }
                />
                <Input
                  placeholder="Dirección completa"
                  value={form.fullText || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullText: e.target.value }))
                  }
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => handleUpdate(addr.id)}
                    disabled={isLoading}
                  >
                    <Check className="h-4 w-4 mr-1" /> Guardar
                  </Button>
                  <Button variant="ghost" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" /> Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-800">
                    {addr.label}
                    {addr.isDefault && (
                      <span className="ml-2 text-sm text-primary inline-flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Predeterminada
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(addr)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDelete(addr.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                    {!addr.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-primary"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Predeterminar
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{addr.fullText}</p>
              </>
            )}
          </div>
        ))
      )}
    </Card>
  );
}
