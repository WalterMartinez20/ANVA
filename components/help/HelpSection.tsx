// components/help/HelpSection.tsx
"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface HelpSectionProps {
  videoUrl: string;
}

export default function HelpSection({ videoUrl }: HelpSectionProps) {
  return (
    <div className="mb-6 p-4 rounded-lg border bg-primary/5 border-primary/20 flex items-center justify-between shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <ExternalLink className="h-5 w-5 text-primary" />
        <div className="text-sm text-primary font-medium">
          ¿Nuevo en esta sección?{" "}
          <Link
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary/80 transition"
          >
            Ver video explicativo
          </Link>
        </div>
      </div>
    </div>
  );
}
