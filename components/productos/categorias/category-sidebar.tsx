"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ShoppingBag,
  Star,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
  count: number;
}

export default function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    rating: true,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const getParams = () => new URLSearchParams(searchParams.toString());

  const toggleSection = (key: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const params = getParams();

    if (priceRange[0] !== 0) params.set("min_price", priceRange[0].toString());
    else params.delete("min_price");

    if (priceRange[1] !== 200)
      params.set("max_price", priceRange[1].toString());
    else params.delete("max_price");

    if (selectedRating) params.set("rating", selectedRating.toString());
    else params.delete("rating");

    router.replace(`?${params.toString()}`);
  }, [priceRange, selectedRating]);

  const clearAllFilters = () => {
    const params = getParams();
    ["min_price", "max_price", "rating"].forEach((key) => params.delete(key));
    router.replace(`?${params.toString()}`);
    setPriceRange([0, 200]);
    setSelectedRating(null);
  };

  const removeFilter = (key: string) => {
    const params = getParams();
    params.delete(key);
    router.replace(`?${params.toString()}`);
    if (key === "min_price") setPriceRange([0, priceRange[1]]);
    if (key === "max_price") setPriceRange([priceRange[0], 200]);
    if (key === "rating") setSelectedRating(null);
  };

  const activeFilters: { key: string; label: string }[] = [];
  if (searchParams.get("min_price"))
    activeFilters.push({
      key: "min_price",
      label: `Desde $${searchParams.get("min_price")}`,
    });
  if (searchParams.get("max_price"))
    activeFilters.push({
      key: "max_price",
      label: `Hasta $${searchParams.get("max_price")}`,
    });
  if (searchParams.get("rating"))
    activeFilters.push({
      key: "rating",
      label: `${searchParams.get("rating")}★ o más`,
    });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories/all"),
          fetch("/api/products"),
        ]);
        const catData = await catRes.json();
        const prodData = await prodRes.json();

        const productCounts: Record<string, number> = {};
        for (const prod of prodData.products) {
          const slug = prod.categorySlug;
          if (slug) {
            productCounts[slug] = (productCounts[slug] || 0) + 1;
          }
        }

        const fullCategories = catData.map((cat: any) => ({
          name: cat.name,
          slug: cat.slug,
          count: productCounts[cat.slug] || 0,
        }));

        setCategories(fullCategories);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {activeFilters.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            {activeFilters.map((filter) => (
              <div
                key={filter.key}
                className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.key)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Borrar todo
            </Button>
          </div>
        </div>
      )}

      <div>
        <Button
          variant="ghost"
          onClick={() => toggleSection("categories")}
          className="w-full justify-between text-lg font-medium p-2"
        >
          <span className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Categorías
          </span>
          {expanded.categories ? <ChevronUp /> : <ChevronDown />}
        </Button>

        {expanded.categories && (
          <div className="space-y-1 mt-2">
            <Button
              variant="ghost"
              className="w-full justify-between pl-4 font-normal"
              asChild
            >
              <Link href="/categoria/todos">
                <span className="flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Todos los productos
                </span>
                <span className="text-muted-foreground text-sm">
                  {categories.reduce((sum, cat) => sum + cat.count, 0)}
                </span>
              </Link>
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.slug}
                variant="ghost"
                className="w-full justify-between pl-4 font-normal"
                asChild
              >
                <Link href={`/categoria/${cat.slug}`}>
                  <span>{cat.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {cat.count}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* PRECIO */}
      <div>
        <Button
          variant="ghost"
          className="w-full justify-between p-2 font-medium text-lg"
          onClick={() => toggleSection("price")}
        >
          <span>Precio</span>
          {expanded.price ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>

        {expanded.price && (
          <div className="mt-2 px-2 space-y-4">
            <div className="flex justify-between text-sm font-medium">
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
              {[0, 1].map((i) => (
                <input
                  key={i}
                  type="range"
                  min={0}
                  max={200}
                  value={priceRange[i]}
                  onChange={(e) =>
                    setPriceRange((prev) =>
                      i === 0
                        ? [+e.target.value, prev[1]]
                        : [prev[0], +e.target.value]
                    )
                  }
                  className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-auto z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer"
                />
              ))}
            </div>

            <div className="flex justify-between gap-2 text-sm">
              <div className="w-full">
                <input
                  type="number"
                  min={0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([+e.target.value, priceRange[1]])
                  }
                  className="w-full border border-gray-300 bg-white text-black px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="w-full">
                <input
                  type="number"
                  min={priceRange[0]}
                  max={200}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], +e.target.value])
                  }
                  className="w-full border border-gray-300 bg-white text-black px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* VALORACIÓN */}
      <div>
        <Button
          variant="ghost"
          onClick={() => toggleSection("rating")}
          className="w-full justify-between text-lg font-medium p-2"
        >
          <span className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            Valoración
          </span>
          {expanded.rating ? <ChevronUp /> : <ChevronDown />}
        </Button>

        {expanded.rating && (
          <div className="space-y-2 px-2 mt-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <input
                  type="radio"
                  id={`rating-${rating}`}
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() =>
                    setSelectedRating(selectedRating === rating ? null : rating)
                  }
                  className="mr-2 h-4 w-4 accent-primary"
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center text-sm cursor-pointer"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn("h-5 w-5", {
                        "text-yellow-400 fill-yellow-400": i < rating,
                        "text-gray-300": i >= rating,
                      })}
                    />
                  ))}
                  <span className="ml-2">y más</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
