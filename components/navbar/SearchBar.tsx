// * Este contiene toda la lógica de búsqueda, historial y sugerencias

"use client";

import { useSearchDropdown } from "@/hooks/busqueda/useSearchDropdown";
import { Search, Loader2, Trash2 } from "lucide-react";

export default function SearchBar() {
  const {
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
    fetchSuggestionsImmediately,
  } = useSearchDropdown();

  return (
    <div className="hidden md:flex flex-1 justify-center px-8 max-w-2xl mx-auto">
      <form
        onSubmit={handleSearchSubmit}
        ref={formRef}
        className="relative w-full"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            openDropdown();
            if (query.trim().length >= 2) {
              fetchSuggestionsImmediately(query);
            }
          }}
          className="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-11 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {isDropdownVisible &&
          (query.trim().length > 0 || history.length > 0) && (
            <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-lg border max-h-60 overflow-y-auto">
              <div className="p-2 space-y-1">
                {isFetchingSuggestions && (
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Buscando...
                  </div>
                )}

                {suggestions.length > 0 ? (
                  suggestions.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={(e) => {
                        e.preventDefault();
                        addToHistory(prod);
                        window.location.href = `/buscar?q=${encodeURIComponent(
                          prod.name
                        )}`;
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      <img
                        src={prod.image || "/placeholder.svg"}
                        alt={prod.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span>{prod.name}</span>
                    </button>
                  ))
                ) : query.trim().length >= 2 && !isFetchingSuggestions ? (
                  <div className="text-sm text-gray-500 px-4 py-2">
                    Sin resultados
                  </div>
                ) : history.length > 0 ? (
                  <>
                    {history.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 rounded"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            addToHistory(item);
                            window.location.href = `/buscar?q=${encodeURIComponent(
                              item.name
                            )}`;
                          }}
                          className="flex items-center gap-2 text-left flex-1"
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-6 h-6 object-cover rounded"
                          />
                          {item.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItemFromHistory(i)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="text-center mt-2">
                      <button
                        type="button"
                        onClick={clearHistory}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Borrar historial
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}
      </form>
    </div>
  );
}
