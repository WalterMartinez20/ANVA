"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12 relative">
      <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>

      {/* Botones de navegación */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md hidden sm:flex text-black h-10 w-10 rounded-full"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md hidden sm:flex text-black h-10 w-10 rounded-full"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Carrusel horizontal */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide scroll-smooth"
      >
        {products.map((product) => (
          <Card
            key={product.id}
            className="min-w-[200px] max-w-[220px] shrink-0 border border-gray-200 rounded-md"
          >
            <Link href={`/producto/${product.id}`}>
              <div className="p-3">
                <div className="aspect-square relative mb-3">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
