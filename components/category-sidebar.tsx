"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Tag,
  Star,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  count: number;
  slug: string;
}

export default function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: false,
  });

  useEffect(() => {
    // Simulación de carga de categorías
    // En un caso real, esto vendría de una API
    setTimeout(() => {
      setCategories([
        { name: "Carteras", count: 12, slug: "carteras" },
        { name: "Bolsos", count: 8, slug: "bolsos" },
        { name: "Mochilas", count: 5, slug: "mochilas" },
        { name: "Clutch", count: 7, slug: "clutch" },
        { name: "Carteras Premium", count: 4, slug: "carteras-premium" },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          className="w-full justify-between p-2 font-medium text-lg"
          onClick={() => toggleSection("categories")}
        >
          <span className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Categorías
          </span>
          {expandedSections.categories ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>

        {expandedSections.categories && (
          <div className="mt-2 space-y-1">
            {isLoading ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="h-8 bg-gray-100 animate-pulse rounded-md mb-1"
                  ></div>
                ))}
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-between pl-4 font-normal"
                  asChild
                >
                  <Link href="/">
                    <span className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Todos los productos
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {categories.reduce((sum, cat) => sum + cat.count, 0)}
                    </span>
                  </Link>
                </Button>

                {categories.map((category) => (
                  <Button
                    key={category.slug}
                    variant="ghost"
                    className="w-full justify-between pl-4 font-normal"
                    asChild
                  >
                    <Link href={`/categoria/${category.slug}`}>
                      <span>{category.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {category.count}
                      </span>
                    </Link>
                  </Button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <Separator />

      <div>
        <Button
          variant="ghost"
          className="w-full justify-between p-2 font-medium text-lg"
          onClick={() => toggleSection("price")}
        >
          <span>Precio</span>
          {expandedSections.price ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>

        {expandedSections.price && (
          <div className="mt-2 px-2">
            <div className="flex justify-between mb-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{
                  left: `${(priceRange[0] / 200) * 100}%`,
                  right: `${100 - (priceRange[1] / 200) * 100}%`,
                }}
              ></div>
            </div>
            <div className="mt-6">
              <Button className="w-full">Aplicar filtro</Button>
            </div>
          </div>
        )}
      </div>

      <Separator />

      <div>
        <Button
          variant="ghost"
          className="w-full justify-between p-2 font-medium text-lg"
          onClick={() => toggleSection("rating")}
        >
          <span className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            Valoración
          </span>
          {expandedSections.rating ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>

        {expandedSections.rating && (
          <div className="mt-2 space-y-2 px-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <input
                  type="checkbox"
                  id={`rating-${rating}`}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn("h-4 w-4", {
                        "text-yellow-400 fill-yellow-400": i < rating,
                        "text-gray-300": i >= rating,
                      })}
                    />
                  ))}
                  <span className="ml-1 text-sm">y más</span>
                </label>
              </div>
            ))}
            <Button className="w-full mt-4">Aplicar filtro</Button>
          </div>
        )}
      </div>
    </div>
  );
}
