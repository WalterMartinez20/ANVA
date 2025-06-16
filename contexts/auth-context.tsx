"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User, Role } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  isUser: boolean;
  login: (email: string, password: string) => Promise<User>;
  continueAsGuest: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  reactivate: () => Promise<void>;
  deactivate: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  phone: string;
  address: string;
}

interface CreateUserData extends RegisterData {
  role: Role;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (response.ok) {
        console.log("🔄 user after /api/auth/me:", data.user);
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error al verificar autenticación:", error); // ✅ LOG 3
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Error al iniciar sesión");

      setUser(data.user);

      toast({
        title: "Sesión iniciada",
        description: `Bienvenido/a, ${data.user.nombres}`,
      });

      return data.user; // ✅ Devuelve el usuario
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Error desconocido",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = async () => {
    setUser({
      id: 0,
      nombres: "Invitado",
      apellidos: "",
      email: "",
      role: Role.GUEST,
      isActive: true,
    });
    router.push("/");
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, role: Role.USER }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al registrarse");

      setUser(data.user);
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Error desconocido",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: CreateUserData) => {
    if (!user || user.role !== Role.ADMIN) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para crear usuarios",
        variant: "destructive",
      });
      throw new Error("Acceso denegado");
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al crear usuario");

      toast({
        title: "Usuario creado",
        description: `Se creó a ${userData.nombres}`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Error desconocido",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });

      // 🧹 Limpiar carrito de localStorage
      localStorage.removeItem("cart");

      // 🧹 Disparar evento personalizado (opcional) para que el CartProvider también lo borre si es necesario
      window.dispatchEvent(new Event("clear-cart"));

      setUser(null);
      toast({ title: "Sesión cerrada", description: "Has cerrado sesión" });
      router.push("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reactivate = async () => {
    try {
      const res = await fetch("/api/users/reactivate", { method: "POST" });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "No se pudo reactivar la cuenta");

      await refreshUser(); // fuerza la recarga del usuario
      toast({
        title: "Cuenta reactivada",
        description: "Tu cuenta está activa nuevamente.",
      });

      router.push("/perfil"); // o router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo reactivar la cuenta",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deactivate = async () => {
    const confirmed = confirm(
      "¿Estás seguro de que querés desactivar tu cuenta?\n\nEsta acción cerrará tu sesión y desactivará temporalmente tu cuenta."
    );
    if (!confirmed) return;

    try {
      const res = await fetch("/api/users/deactivate", { method: "POST" });
      if (!res.ok) throw new Error();

      await logout(); // cierra sesión, limpia estado
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("clear-cart"));
    } catch (error) {
      throw new Error("No se pudo desactivar la cuenta");
    }
  };

  const isAuthenticated = !!user && user.role !== Role.GUEST;
  const isAdmin = user?.role === Role.ADMIN;
  const isGuest = user?.role === Role.GUEST;
  const isUser = user?.role === Role.USER;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        isGuest,
        isUser,
        login,
        continueAsGuest,
        register,
        createUser,
        logout,
        refreshUser,
        reactivate,
        deactivate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
