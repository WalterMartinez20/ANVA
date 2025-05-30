"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ban, Truck, RotateCcw } from "lucide-react";
import clsx from "clsx";

const items = [
  {
    href: "/politicas/cancelacion",
    title: "Cancelación",
    icon: <Ban className="h-5 w-5 mr-2" />,
  },
  {
    href: "/politicas/entrega",
    title: "Entrega",
    icon: <Truck className="h-5 w-5 mr-2" />,
  },
  {
    href: "/politicas/devolucion",
    title: "Devolución",
    icon: <RotateCcw className="h-5 w-5 mr-2" />,
  },
];

export default function PoliticasNavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-60 sticky top-24 h-fit pr-6 border-r">
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
