"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ban,
  Truck,
  RotateCcw,
  FileText,
  ShieldCheck,
  Lock,
  Info,
  HelpCircle,
  LayoutGrid,
  Cookie,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

type NavItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
};

type NavGroup = {
  title: string;
  icon?: React.ReactNode;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Términos y Condiciones",
    icon: <FileText className="h-4 w-4" />,
    items: [
      {
        title: "Terminos y Condiciones",
        href: "/politicas/terminos",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        title: "Devolución",
        href: "/politicas/devolucion",
        icon: <RotateCcw className="h-4 w-4" />,
      },
      {
        title: "Cancelación",
        href: "/politicas/cancelacion",
        icon: <Ban className="h-4 w-4" />,
      },
      {
        title: "Envíos",
        href: "/politicas/entrega",
        icon: <Truck className="h-4 w-4" />,
      },
      {
        title: "Métodos de pago",
        href: "/politicas/pago",
        icon: <Info className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Políticas de Privacidad",
    icon: <ShieldCheck className="h-4 w-4" />,
    items: [
      {
        title: "Política de Privacidad",
        href: "/politicas/privacidad",
        icon: <Lock className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Otros",
    icon: <Info className="h-4 w-4" />,
    items: [
      {
        title: "Política de cookies",
        href: "/politicas/cookies",
        icon: <Cookie className="h-4 w-4" />,
      },
      {
        title: "Preguntas frecuentes (FAQ)",
        href: "/politicas/faq",
        icon: <HelpCircle className="h-4 w-4" />,
      },
    ],
  },
];

export default function PoliticasNavSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>(
    () => navGroups.map((g) => g.title) // todos abiertos por defecto
  );

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <aside className="hidden md:block w-64 sticky top-24 h-fit pr-6 border-r">
      <nav className="space-y-6">
        {/* Botón "Ver todas las políticas" al inicio */}
        <div>
          <Link
            href="/politicas"
            className="flex items-center gap-2 px-3 py-2 mb-2 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition"
          >
            <LayoutGrid className="h-5 w-5" />
            Ver todas las políticas
          </Link>
        </div>

        {/* Navegación por grupos */}
        {navGroups.map((group) => {
          const isOpen = openGroups.includes(group.title);
          return (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between text-base font-semibold text-gray-900 hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  {group.icon}
                  {group.title}
                </div>
                <ChevronDown
                  className={clsx(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              <ul
                className={clsx(
                  "overflow-hidden transition-all duration-300 mt-2 space-y-1 pl-4 border-l border-gray-200",
                  isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-2 px-2 py-1 text-sm rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
