import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Campo requerido"),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: "Debe ser un número" })
    .min(0.01, "El precio debe ser mayor a 0"),
  stock: z.number().min(0, "El stock no puede ser negativo").optional(),
  category: z.string().min(1, "Selecciona una categoría"),
  colors: z.array(z.string()).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  depth: z.number().optional(),
  strapDescription: z.string().optional(),
});

export type ProductFormSchema = z.infer<typeof productSchema>;
