// hooks/productos/useProductActions.ts
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/components/cart-provider";
import { useAuth } from "@/contexts/auth-context";
import { Product } from "@/types/producto_admin";

export function useProductActions() {
  const { toast } = useToast();
  const { addItem } = useCart();
  const { isGuest, isAuthenticated } = useAuth();

  function addToCartFromDetails(
    product: Product,
    selectedColor: string | null,
    availableColors: { id: string; name: string; value: string }[],
    quantity: number
  ) {
    if (!selectedColor) {
      toast({
        title: "Selecciona un color",
        description: "Debes seleccionar un color antes de añadir al carrito",
        variant: "destructive",
      });
      return;
    }

    const selectedColorName =
      availableColors.find((c) => c.id === selectedColor)?.name ||
      selectedColor;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.url || "/placeholder.svg",
      customization: `Color: ${selectedColorName}`,
    });

    toast({
      title: "Producto añadido",
      description: `${product.name} (${selectedColorName}) ha sido añadido al carrito`,
    });
  }

  const toggleFavoriteAndUpdate = async (
    product: Product,
    isFavorite: boolean,
    setIsFavorite: (val: boolean) => void,
    setLoading: (val: boolean) => void
  ) => {
    if (!isAuthenticated || isGuest) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar favoritos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites/${product.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error();
        setIsFavorite(false);
        toast({
          title: "Eliminado de favoritos",
          description: `${product.name} fue eliminado`,
        });
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (!res.ok) throw new Error();
        setIsFavorite(true);
        toast({
          title: "Añadido a favoritos",
          description: `${product.name} fue añadido`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar favoritos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    addToCartFromDetails,
    toggleFavoriteAndUpdate,
  };
}
