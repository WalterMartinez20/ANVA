import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/busqueda/use-debounce";

export function useSearchDropdown() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // ⏱️ Reduce el delay para respuesta más rápida
  const debouncedQuery = useDebounce(query, 100);

  // 🧠 Búsqueda diferida (normal)
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsFetchingSuggestions(false);
      return;
    }

    fetchSuggestions(trimmed);
  }, [debouncedQuery]);

  // ✅ Búsqueda inmediata para onFocus
  const fetchSuggestions = async (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 2) return;

    setIsFetchingSuggestions(true);
    try {
      const res = await fetch(
        `/api/search?autocomplete=true&q=${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();
      setSuggestions(data.products || []);
    } catch (error) {
      console.error("Error al obtener sugerencias:", error);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  const openDropdown = () => setIsDropdownVisible(true);

  const addToHistory = (item: any) => {
    const exists = history.find((h) => h.id === item.id);
    if (!exists) {
      const newHistory = [item, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const removeItemFromHistory = (index: number) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (query.trim()) {
        window.location.href = `/buscar?q=${encodeURIComponent(query.trim())}`;
      }
    },
    [query]
  );

  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
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
    addToHistory,
    isFetchingSuggestions,
    fetchSuggestionsImmediately: fetchSuggestions, // ✅ exportar para usar en onFocus
  };
}
