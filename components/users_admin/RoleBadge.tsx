// components/users_admin/RoleBadge.tsx
import { ShieldCheck, User, Eye } from "lucide-react";

interface RoleBadgeProps {
  role: "ADMIN" | "USER" | "GUEST";
}

const roleMap = {
  ADMIN: {
    label: "Administrador",
    icon: <ShieldCheck className="h-4 w-4" />,
    style: "bg-purple-100 text-purple-800 border-purple-200",
  },
  USER: {
    label: "Usuario",
    icon: <User className="h-4 w-4" />,
    style: "bg-blue-100 text-blue-800 border-blue-200",
  },
  GUEST: {
    label: "Invitado",
    icon: <Eye className="h-4 w-4" />,
    style: "bg-gray-100 text-gray-700 border-gray-300",
  },
};

export default function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleMap[role] ?? roleMap.USER;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border shadow-sm ${config.style}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
