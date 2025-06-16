"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomizationOption {
  name: string;
  price: number;
}

interface ProductCustomizationProps {
  colors?: string[];
  sizes?: string[];
  materials?: CustomizationOption[];
  extras?: CustomizationOption[];
  onCustomizationChange: (customization: ProductCustomization) => void;
}

export interface ProductCustomization {
  color?: string;
  size?: string;
  material?: string;
  extras: string[];
  additionalPrice: number;
}

export default function ProductCustomization({
  colors = [],
  sizes = [],
  materials = [],
  extras = [],
  onCustomizationChange,
}: ProductCustomizationProps) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colors[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    sizes[0]
  );
  const [selectedMaterial, setSelectedMaterial] = useState<string | undefined>(
    materials.length > 0 ? materials[0].name : undefined
  );
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    updateCustomization({ color });
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    updateCustomization({ size });
  };

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material);
    updateCustomization({ material });
  };

  const handleExtraChange = (extra: string, checked: boolean) => {
    const newExtras = checked
      ? [...selectedExtras, extra]
      : selectedExtras.filter((item) => item !== extra);

    setSelectedExtras(newExtras);
    updateCustomization({ extras: newExtras });
  };

  const updateCustomization = (
    changes: Partial<Omit<ProductCustomization, "additionalPrice">>
  ) => {
    const customization: ProductCustomization = {
      color: changes.color !== undefined ? changes.color : selectedColor,
      size: changes.size !== undefined ? changes.size : selectedSize,
      material:
        changes.material !== undefined ? changes.material : selectedMaterial,
      extras: changes.extras !== undefined ? changes.extras : selectedExtras,
      additionalPrice: calculateAdditionalPrice(
        changes.material !== undefined ? changes.material : selectedMaterial,
        changes.extras !== undefined ? changes.extras : selectedExtras
      ),
    };

    onCustomizationChange(customization);
  };

  const calculateAdditionalPrice = (
    material?: string,
    selectedExtras: string[] = []
  ) => {
    let price = 0;

    // Añadir precio del material seleccionado
    if (material) {
      const materialOption = materials.find((m) => m.name === material);
      if (materialOption) {
        price += materialOption.price;
      }
    }

    // Añadir precio de los extras seleccionados
    selectedExtras.forEach((extra) => {
      const extraOption = extras.find((e) => e.name === extra);
      if (extraOption) {
        price += extraOption.price;
      }
    });

    return price;
  };

  // Si no hay opciones de personalización, no mostrar el componente
  if (
    colors.length === 0 &&
    sizes.length === 0 &&
    materials.length === 0 &&
    extras.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">Personalización</h3>

      {/* Selección de color */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color
                    ? "border-primary"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                onClick={() => handleColorChange(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Selección de tamaño */}
      {sizes.length > 0 && (
        <div className="space-y-2">
          <Label>Tamaño</Label>
          <RadioGroup
            value={selectedSize}
            onValueChange={handleSizeChange}
            className="flex flex-wrap gap-2"
          >
            {sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size} id={`size-${size}`} />
                <Label htmlFor={`size-${size}`}>{size}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Selección de material */}
      {materials.length > 0 && (
        <div className="space-y-2">
          <Label>Material</Label>
          <Select value={selectedMaterial} onValueChange={handleMaterialChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un material" />
            </SelectTrigger>
            <SelectContent>
              {materials.map((material) => (
                <SelectItem key={material.name} value={material.name}>
                  {material.name}{" "}
                  {material.price > 0 && `(+$${material.price.toFixed(2)})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Extras opcionales */}
      {extras.length > 0 && (
        <div className="space-y-2">
          <Label>Extras</Label>
          <div className="space-y-2">
            {extras.map((extra) => (
              <div key={extra.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`extra-${extra.name}`}
                  checked={selectedExtras.includes(extra.name)}
                  onCheckedChange={(checked) =>
                    handleExtraChange(extra.name, checked === true)
                  }
                />
                <Label htmlFor={`extra-${extra.name}`}>
                  {extra.name}{" "}
                  {extra.price > 0 && `(+$${extra.price.toFixed(2)})`}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
