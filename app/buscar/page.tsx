"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Filter, X } from "lucide-react";
import ProductGrid from "@/components/product-grid";
import SortSelector from "@/components/sort-selector";
import { toast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  images: ProductImage[];
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice") || "0";
  const maxPrice = searchParams.get("maxPrice") || "1000";

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number.parseInt(minPrice),
    Number.parseInt(maxPrice),
  ]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    category ? [category] : []
  );
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Cargar categorías disponibles
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Error al cargar categorías");

        const data = await response.json();
        setAvailableCategories(data.categories.map((cat: any) => cat.name));
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  // Cargar productos con filtros
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (selectedCategories.length > 0) {
          selectedCategories.forEach((cat) => params.append("category", cat));
        }
        params.append("page", currentPage.toString());
        params.append("limit", "12");
        params.append("sort", sort);
        params.append("minPrice", priceRange[0].toString());
        params.append("maxPrice", priceRange[1].toString());
        if (showOnlyInStock) params.append("inStock", "true");

        const response = await fetch(`/api/search?${params.toString()}`);
        if (!response.ok) throw new Error("Error al buscar productos");

        const data = await response.json();
        setProducts(data.products || []);
        setPagination(
          data.pagination || { total: 0, page: 1, limit: 12, totalPages: 0 }
        );
      } catch (error) {
        console.error("Error al buscar productos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los resultados de búsqueda",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    query,
    selectedCategories,
    currentPage,
    sort,
    priceRange,
    showOnlyInStock,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Construir URL con todos los parámetros de búsqueda
    const params = new URLSearchParams();
    if (searchTerm) params.append("q", searchTerm);
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((cat) => params.append("category", cat));
    }
    params.append("sort", sort);
    params.append("minPrice", priceRange[0].toString());
    params.append("maxPrice", priceRange[1].toString());
    if (showOnlyInStock) params.append("inStock", "true");

    router.push(`/buscar?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setShowOnlyInStock(false);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/buscar?${params.toString()}`);
  };

  const activeFiltersCount =
    (selectedCategories.length > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    (showOnlyInStock ? 1 : 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar de categorías y filtros - Solo visible en desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-6">
            <div>
              <h3 className="font-medium mb-3">Categorías</h3>
              <div className="space-y-2">
                {availableCategories.map((cat) => (
                  <div key={cat} className="flex items-center">
                    <Checkbox
                      id={`category-${cat}`}
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={() => handleCategoryToggle(cat)}
                    />
                    <Label
                      htmlFor={`category-${cat}`}
                      className="ml-2 cursor-pointer"
                    >
                      {cat}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Precio</h3>
              <div className="px-2">
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  className="mb-6"
                />
                <div className="flex items-center justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <Checkbox
                  id="in-stock"
                  checked={showOnlyInStock}
                  onCheckedChange={(checked) =>
                    setShowOnlyInStock(checked as boolean)
                  }
                />
                <Label htmlFor="in-stock" className="ml-2 cursor-pointer">
                  Solo productos en stock
                </Label>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full"
              >
                Limpiar filtros ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">
              {query ? `Resultados para "${query}"` : "Todos los productos"}
              {selectedCategories.length === 1 &&
                ` en ${selectedCategories[0]}`}
            </h1>

            <form onSubmit={handleSearch} className="mt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit">Buscar</Button>

                {/* Botón de filtros móvil */}
                <Sheet
                  open={isMobileFiltersOpen}
                  onOpenChange={setIsMobileFiltersOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2 md:hidden"
                    >
                      <Filter className="h-4 w-4" />
                      Filtros
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                      <SheetDescription>
                        Refina tu búsqueda con estos filtros
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <Accordion
                        type="single"
                        collapsible
                        defaultValue="categories"
                      >
                        <AccordionItem value="categories">
                          <AccordionTrigger>Categorías</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 mt-2">
                              {availableCategories.map((cat) => (
                                <div key={cat} className="flex items-center">
                                  <Checkbox
                                    id={`mobile-category-${cat}`}
                                    checked={selectedCategories.includes(cat)}
                                    onCheckedChange={() =>
                                      handleCategoryToggle(cat)
                                    }
                                  />
                                  <Label
                                    htmlFor={`mobile-category-${cat}`}
                                    className="ml-2 cursor-pointer"
                                  >
                                    {cat}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="price">
                          <AccordionTrigger>Precio</AccordionTrigger>
                          <AccordionContent>
                            <div className="px-2 mt-4">
                              <Slider
                                min={0}
                                max={1000}
                                step={10}
                                value={priceRange}
                                onValueChange={handlePriceChange}
                                className="mb-6"
                              />
                              <div className="flex items-center justify-between">
                                <span>${priceRange[0]}</span>
                                <span>${priceRange[1]}</span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="stock">
                          <AccordionTrigger>Disponibilidad</AccordionTrigger>
                          <AccordionContent>
                            <div className="flex items-center mt-2">
                              <Checkbox
                                id="mobile-in-stock"
                                checked={showOnlyInStock}
                                onCheckedChange={(checked) =>
                                  setShowOnlyInStock(checked as boolean)
                                }
                              />
                              <Label
                                htmlFor="mobile-in-stock"
                                className="ml-2 cursor-pointer"
                              >
                                Solo productos en stock
                              </Label>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={handleClearFilters}
                          className="flex-1"
                        >
                          Limpiar filtros
                        </Button>
                        <SheetClose asChild>
                          <Button className="flex-1">Aplicar</Button>
                        </SheetClose>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </form>
          </div>

          {/* Filtros activos */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {cat}
                  <button onClick={() => handleCategoryToggle(cat)}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              ))}

              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Precio: ${priceRange[0]} - ${priceRange[1]}
                  <button onClick={() => setPriceRange([0, 1000])}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}

              {showOnlyInStock && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Solo en stock
                  <button onClick={() => setShowOnlyInStock(false)}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-sm h-7"
              >
                Limpiar todos
              </Button>
            </div>
          )}

          {/* Resultados y ordenamiento */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">
              {pagination.total}{" "}
              {pagination.total === 1 ? "resultado" : "resultados"} encontrados
            </p>
            <SortSelector value={sort} onChange={handleSortChange} />
          </div>

          {/* Productos */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">
                No se encontraron resultados
              </h2>
              <p className="text-muted-foreground mb-6">
                Intenta con otros términos de búsqueda o ajusta los filtros
              </p>
              <Button asChild>
                <a href="/">Ver todos los productos</a>
              </Button>
            </div>
          ) : (
            <>
              <ProductGrid products={products} />

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
