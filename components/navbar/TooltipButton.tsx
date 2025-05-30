// * Componente reutilizable para botones con tooltip. Puedes pasar cualquier icono o contenido como children

"use client";

import * as Tooltip from "@radix-ui/react-tooltip";

interface TooltipButtonProps {
  label: string;
  children: React.ReactNode;
}

export default function TooltipButton({ label, children }: TooltipButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="bg-black text-white text-xs rounded px-2 py-1 shadow-md"
          side="top"
          sideOffset={8}
        >
          {label}
          <Tooltip.Arrow className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
