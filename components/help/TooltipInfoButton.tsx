// components/help/TooltipInfoButton.tsx
"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipInfoButtonProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export default function TooltipInfoButton({
  content,
  position = "top",
}: TooltipInfoButtonProps) {
  return (
    <TooltipProvider delayDuration={0}>
      {" "}
      {/* Muestra inmediata */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-primary border border-primary shadow-sm hover:bg-primary hover:text-white transition"
            aria-label="Más información"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={position}
          className="bg-white text-sm text-gray-900 border border-gray-300 shadow-lg rounded-md px-3 py-2 max-w-xs"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
