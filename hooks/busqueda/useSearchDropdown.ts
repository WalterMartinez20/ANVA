import { useEffect, useRef, useState } from "react";
import { useDebounce } from "./use-debounce";
import type { Product } from "@/types/producto_admin";

export function useSearchDropdown() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const formRef = useRef<HTMLFormElement>(null);

  const openDropdown = () => {
    if (suggestions.length > 0 || history.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    setHistory([]);
    setIsDropdownVisible(false);
  };

  const removeItemFromHistory = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setHistory(updated);
    setIsDropdownVisible(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const newHistory = [query, ...history.filter((h) => h !== query)].slice(
      0,
      5
    );
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    window.location.href = `/buscar?q=${encodeURIComponent(query)}`;
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${debouncedQuery}&limit=5`);
        const data = await res.json();
        setSuggestions(data.products || []);
      } catch (err) {
        console.error("Error cargando sugerencias:", err);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const initHistory = () => {
      const stored = localStorage.getItem("searchHistory");
      if (stored) setHistory(JSON.parse(stored));
    };

    const syncHistory = (event: StorageEvent) => {
      if (event.key === "searchHistory") {
        const updated = event.newValue ? JSON.parse(event.newValue) : [];
        setHistory(updated);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    window.addEventListener("storage", syncHistory);
    document.addEventListener("mousedown", handleClickOutside);
    initHistory();

    return () => {
      window.removeEventListener("storage", syncHistory);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    history,
    isDropdownVisible,
    openDropdown,
    clearHistory,
    removeItemFromHistory,
    handleSearchSubmit,
    formRef,
  };
}
