// * Muestra los botones para guardar o descartar los cambios del formulario, manejando estados como loading.

"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProfileFormActionsProps {
  hasChanges: boolean;
  isLoading: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const ProfileFormActions: React.FC<ProfileFormActionsProps> = ({
  hasChanges,
  isLoading,
  onSave,
  onDiscard,
}) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
      <Button
        variant="ghost"
        onClick={onDiscard}
        disabled={!hasChanges || isLoading}
        className="sm:w-auto w-full"
      >
        Descartar cambios
      </Button>

      <Button
        onClick={onSave}
        disabled={!hasChanges || isLoading}
        className="sm:w-auto w-full bg-primary text-white hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar cambios"
        )}
      </Button>
    </div>
  );
};
