"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileTabPanel } from "@/components/profile/ProfileTabPanel";

interface UserProfile {
  nombres: string;
  apellidos: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  // emailVerificado: boolean;
}

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("personal");
  const [hasChanges, setHasChanges] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    nombres: "",
    apellidos: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
    // emailVerificado: false,
  });

  const [originalProfile, setOriginalProfile] = useState<UserProfile>(profile);

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      const userProfile = {
        nombres: user.nombres || "",
        apellidos: user.apellidos || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        isActive: user.isActive,
      };
      setProfile(userProfile);
      setOriginalProfile(userProfile);
    }
  }, [user]);

  // Detectar cambios
  useEffect(() => {
    const hasProfileChanges =
      JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setHasChanges(hasProfileChanges);
  }, [profile, originalProfile]);

  // Manejadores
  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setSavingProfile(true); // en vez de setIsLoading
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: profile.nombres,
          apellidos: profile.apellidos,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar perfil");
      }

      setOriginalProfile(profile);
      setHasChanges(false);

      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDiscardChanges = () => {
    setProfile(originalProfile);
    setHasChanges(false);
    toast({
      title: "Cambios descartados",
      description: "Se han restaurado los valores originales",
    });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar skeleton */}
            <div className="lg:col-span-1 space-y-4">
              <Skeleton className="h-24 w-24 rounded-full mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
              <div className="space-y-2 mt-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Main panel skeleton */}
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-12 w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar
                profile={profile}
                avatarUrl={user?.avatar || ""}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                logout={logout}
              />
            </div>

            {/* Contenido principal */}
            <div className="lg:col-span-3 space-y-8">
              <ProfileTabPanel
                activeTab={activeTab}
                profile={profile}
                hasChanges={hasChanges}
                isLoading={savingProfile}
                handleInputChange={handleInputChange}
                handleSaveChanges={handleSaveChanges}
                handleDiscardChanges={handleDiscardChanges}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
