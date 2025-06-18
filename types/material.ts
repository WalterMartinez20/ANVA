// types/material.ts

export interface Property {
  id: number;
  nombre: string;
  tipo: "string" | "number" | "boolean";
}

export interface Category {
  id: number;
  nombre: string;
  propiedades: Property[];
}

export interface PropertyValue {
  propiedadId: number;
  valor: string;
}

export interface Material {
  id: number;
  name: string;
  description: string | null;
  stock: number;
  unit: string | null;
  categoriaId: number;
  categoria: Category;
  propiedades: {
    propiedadId: number;
    valor: string;
    propiedad: Property;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  name: string;
  description: string;
  stock: number;
  unit: string;
  categoriaId: number | null;
  propiedades: PropertyValue[];
}

export type MaterialWithProps = Material & {
  categoriaId: number;
  propiedades: PropertyValue[];
};

export interface GroupedMaterials {
  [categoryId: number]: {
    categoryName: string;
    materials: Material[];
  };
}
