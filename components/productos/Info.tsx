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

  const safePrice =
    typeof price === "number" ? `$${price.toFixed(2)}` : "Precio no disponible";
  const safeOriginal =
    typeof originalPrice === "number" ? `$${originalPrice.toFixed(2)}` : null;

  return compact ? (
    <div className="flex flex-col gap-1">
      {category && (
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {category}
        </p>
      )}
      <Link href={`/producto/${id}`}>
        <h3 className="text-[15px] font-medium leading-snug truncate hover:underline text-foreground">
          {name}
        </h3>
      </Link>
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
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-foreground">
          {safePrice}
        </span>
        {safeOriginal && (
          <span className="text-[12px] text-muted-foreground line-through">
            {safeOriginal}
          </span>
        )}
      </div>
    </div>
  ) : (
    <div className="mb-6 space-y-4 border-b pb-6">
      <p className="text-sm uppercase tracking-wider text-muted-foreground">
        {category || "Sin categoría"}
      </p>
      <h1 className="text-3xl font-semibold text-foreground leading-tight">
        {name}
      </h1>
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
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-primary">{safePrice}</span>
        {safeOriginal && (
          <span className="text-base text-muted-foreground line-through">
            {safeOriginal}
          </span>
        )}
      </div>
    </div>
  );
}
