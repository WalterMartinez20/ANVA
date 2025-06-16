"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Bell, Lock } from "lucide-react";
import { ProfileStatsCard } from "./ProfileStatsCard";
import { ProfileForm } from "./ProfileForm";
import { ProfileFormActions } from "./ProfileFormActions";
import { AddressManager } from "./AddressManager";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { DeactivateAccount } from "./DeactivateAccount";
import { ReactivateAccount } from "./ReactivateAccount";
import { useAuth } from "@/contexts/auth-context";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";

interface Profile {
  nombres: string;
  apellidos: string;
  email: string;
  phone: string;
  address: string;
}

interface ProfileTabPanelProps {
  activeTab: string;
  profile: Profile;
  hasChanges: boolean;
  isLoading: boolean;
  handleInputChange: (field: keyof Profile, value: any) => void;
  handleSaveChanges: () => void;
  handleDiscardChanges: () => void;
}

export const ProfileTabPanel: React.FC<ProfileTabPanelProps> = ({
  activeTab,
  profile,
  hasChanges,
  isLoading,
  handleInputChange,
  handleSaveChanges,
  handleDiscardChanges,
}) => {
  const { user } = useAuth();
  // 🔄 Sincroniza el campo "Dirección" con la dirección predeterminada
  const syncDefaultAddress = async () => {
    try {
      const res = await fetch("/api/users/addresses");
      const data = await res.json();
      const defaultAddr = data.addresses.find((a: any) => a.isDefault);
      if (defaultAddr) {
        handleInputChange("address", defaultAddr.fullText);
      }
    } catch (err) {
      console.error("Error al sincronizar dirección predeterminada:", err);
    }
  };

  // ⚡ Llama una vez al cargar la pestaña personal
  useEffect(() => {
    if (activeTab === "personal") {
      syncDefaultAddress();
    }
  }, [activeTab]);

  // 🔒 Seguridad
  if (activeTab === "security") {
    return (
      <Card className="p-8 w-full space-y-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Cambiar Contraseña
            </h3>
            <p className="text-sm text-muted-foreground">
              De forma opcional, podés actualizar tu contraseña actual.
            </p>
          </div>
        </div>

        <ChangePasswordForm />

        {/* Mostrar según estado de cuenta */}
        {user?.isActive ? <DeactivateAccount /> : <ReactivateAccount />}
      </Card>
    );
  }

  // 🔔 Notificaciones
  if (activeTab === "notifications") {
    return (
      <Card className="p-8 text-center">
        <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Notificaciones
        </h3>
        <p className="text-gray-600">
          Aquí podrás configurar tus preferencias de notificación próximamente.
        </p>
      </Card>
    );
  }

  // 👤 Información personal
  if (activeTab === "personal") {
    return (
      <>
        <ProfileStatsCard />
        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Información Personal
          </h2>

          {!user?.isActive ? (
            <div className="flex items-start gap-2 text-red-600 text-sm mt-2">
              Tu cuenta está desactivada. Reactivala desde la pestaña{" "}
              <span className="font-semibold">Seguridad</span> para editar tu
              perfil.
              <TooltipInfoButton content="Para reactivar tu cuenta, andá a la pestaña Seguridad y presioná el botón 'Reactivar cuenta'." />
            </div>
          ) : (
            <>
              <ProfileForm
                profile={profile}
                handleInputChange={handleInputChange}
              />
              <ProfileFormActions
                hasChanges={hasChanges}
                isLoading={isLoading}
                onSave={handleSaveChanges}
                onDiscard={handleDiscardChanges}
              />
            </>
          )}

          <div className="mt-8">
            <AddressManager onDefaultChange={syncDefaultAddress} />
          </div>
        </Card>
      </>
    );
  }

  return null;
};
