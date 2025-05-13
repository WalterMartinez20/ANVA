import { cn } from "@/lib/utils";

interface Color {
  id: string;
  name: string;
  value: string;
}

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: string | null;
  onSelect: (colorId: string) => void;
  disabledColors?: string[];
  showLabel?: boolean;
  showSelectedName?: boolean;
  hoverReveal?: boolean;
  compact?: boolean;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onSelect,
  disabledColors = [],
  showLabel = true,
  showSelectedName = true,
  hoverReveal = false,
  compact = false,
}: ColorSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className={hoverReveal ? "relative h-6 group" : "mb-3 mt-3"}>
      {showLabel && !hoverReveal && (
        <h3 className="text-sm font-medium mb-2">Color</h3>
      )}

      {/* ✅ Mostrar cantidad de colores disponibles por defecto cuando hoverReveal está activo */}
      {hoverReveal && (
        <div className="text-xs text-muted-foreground absolute top-0 left-0 group-hover:opacity-0 transition-opacity duration-150">
          {colors.length} colores disponibles
        </div>
      )}

      {/* 🎯 Selector de colores */}
      <div
        className={`flex gap-2 flex-wrap ${
          hoverReveal
            ? "absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            : ""
        }`}
      >
        {colors.map((color) => {
          const isSelected = selectedColor === color.id;
          const isDisabled = disabledColors.includes(color.id);

          return (
            <button
              key={color.id}
              onClick={() => {
                if (!isDisabled) onSelect(color.id);
              }}
              className={cn(
                compact ? "w-5 h-5" : "w-7 h-7",
                "rounded-full border transition-all duration-200 ease-in-out",
                isSelected
                  ? "border-[2.5px] border-white scale-90 ring-2 ring-primary"
                  : "border-gray-300 hover:ring-1 hover:ring-primary"
              )}
              style={{ backgroundColor: color.value }}
              aria-label={`Color ${color.name}`}
              title={color.name}
              disabled={isDisabled}
            />
          );
        })}
      </div>

      {showSelectedName && selectedColor && !hoverReveal && (
        <p className="text-sm text-muted-foreground mt-2">
          Color seleccionado:{" "}
          <span className="font-medium">
            {colors.find((c) => c.id === selectedColor)?.name || selectedColor}
          </span>
        </p>
      )}
    </div>
  );
}
