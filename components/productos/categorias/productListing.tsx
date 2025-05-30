"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/productos/categorias/breadcrumb";
import CategorySidebar from "@/components/productos/categorias/category-sidebar";
import SortSelector from "@/components/sort-selector";
import ProductGrid from "@/components/home/product-grid";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types/producto_admin";
import { useFavorites } from "@/hooks/productos/useFavorites";

interface ProductListingPageProps {
  isSearchPage?: boolean;
  slug?: string;
}

export default function ProductListingPage({
  isSearchPage = false,
  slug: slugFromProps,
}: ProductListingPageProps) {
  const searchParams = useSearchParams();
  const slug = slugFromProps!;
  const [query, setQuery] = useState("");
  const [queryReady, setQueryReady] = useState(!isSearchPage); // <- NUEVO
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("name_asc");
  const [hasSearched, setHasSearched] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);

    // Solo activar queryReady si está en modo búsqueda
    if (isSearchPage) {
      setQueryReady(!!q); // solo si hay un valor
    } else {
      setQueryReady(true);
    }
  }, [searchParams, isSearchPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (isSearchPage && !queryReady) return;

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "12",
          sort,
        });

        const min = searchParams.get("min");
        const max = searchParams.get("max");
        const rating = searchParams.get("rating");

        if (min) params.append("min_price", min);
        if (max) params.append("max_price", max);
        if (rating) params.append("rating", rating);
        if (isSearchPage && query) params.append("q", query);

        let url = "";
        if (isSearchPage) {
          url = `/api/search?${params.toString()}`;
        } else if (slug === "todos") {
          url = `/api/products?${params.toString()}`;
        } else {
          url = `/api/categories/${slug}?${params.toString()}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setHasSearched(true);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    slug,
    query,
    queryReady, // <- NUEVO
    currentPage,
    sort,
    searchParams,
    isSearchPage,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const breadcrumbItems = isSearchPage
    ? [
        { label: "Inicio", href: "/" },
        { label: "Búsqueda", href: "/buscar" },
        ...(query ? [{ label: query }] : []),
      ]
    : [
        { label: "Inicio", href: "/" },
        { label: "Categorías", href: "/categorias" },
        { label: slug?.replace(/-/g, " ") ?? "" },
      ];

  return (
    <div className="container py-8 px-4">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64">
          <CategorySidebar />
        </aside>

        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {isSearchPage
                ? query
                  ? `Resultados para "${query}"`
                  : "Todos los productos"
                : slug?.replace(/-/g, " ")?.toUpperCase()}
            </h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : products.length === 0 && hasSearched ? (
            <div className="text-center py-12 border rounded-lg">
              <h2 className="text-xl font-medium mb-2">
                No se encontraron productos
              </h2>
              <p className="text-muted-foreground mb-6">
                Intenta con otra búsqueda o categoría
              </p>
              <Button asChild>
                <a href="/">Ver todos los productos</a>
              </Button>
            </div>
          ) : (
            <>
              <ProductGrid
                products={products}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />

              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
