import { Star } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/producto_admin";

interface Props {
  product: Product;
  compact?: boolean;
}

export default function Info({ product, compact = false }: Props) {
  const {
    id,
    name,
    category,
    price,
    originalPrice,
    rating = 4,
    reviews = 0,
  } = product;
  return compact ? (
    // 🧱 Vista compacta optimizada estilo tienda
    <div className="flex flex-col gap-1">
      {/* Categoría */}
      {category && (
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {category}
        </p>
      )}

      {/* Nombre del producto como link */}
      <Link href={`/producto/${id}`}>
        <h3 className="text-[15px] font-medium leading-snug truncate hover:underline text-foreground">
          {name}
        </h3>
      </Link>

      {/* Rating + reviews */}
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-[14px] w-[14px] ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1">({reviews})</span>
      </div>

      {/* Precio */}
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-foreground">
          ${price.toFixed(2)}
        </span>
        {originalPrice && (
          <span className="text-[12px] text-muted-foreground line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  ) : (
    // 🧱 Vista normal (sin cambios)
    <div className="mb-6 space-y-4 border-b pb-6">
      {/* Categoría */}
      <p className="text-sm uppercase tracking-wider text-muted-foreground">
        {category || "Sin categoría"}
      </p>

      {/* Nombre del producto */}
      <h1 className="text-3xl font-semibold text-foreground leading-tight">
        {name}
      </h1>

      {/* Rating y número de reseñas */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          ({reviews} reseñas)
        </span>
      </div>

      {/* Precio actual + precio anterior */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-primary">
          ${price.toFixed(2)}
        </span>
        {originalPrice && (
          <span className="text-base text-muted-foreground line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}
