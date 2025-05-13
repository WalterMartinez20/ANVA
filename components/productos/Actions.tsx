import { ShoppingCart, Heart, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionsProps {
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  onShare?: () => void;
  isFavorite: boolean;
  isSharing?: boolean;
  isAddingToFavorites?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

export default function Actions({
  onAddToCart,
  onToggleFavorite,
  onShare,
  isFavorite,
  isSharing = false,
  isAddingToFavorites = false,
  disabled = false,
  compact = false,
}: ActionsProps) {
  if (compact) {
    return (
      <>
        {/* Botón flotante en esquina */}
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className="opacity-90 bg-white/80 backdrop-blur-md hover:bg-white transition rounded-md"
            disabled={isAddingToFavorites}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 hover:text-red-500 hover:fill-red-500"
              }`}
            />
          </Button>
        </div>

        {/* Botón de carrito */}
        <Button
          className="w-full mt-auto"
          onClick={onAddToCart}
          disabled={disabled}
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Agregar al carrito
        </Button>
      </>
    );
  }

  // Vista normal
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <Button className="flex-1 py-6" onClick={onAddToCart} disabled={disabled}>
        <ShoppingCart className="h-5 w-5 mr-2" />
        Agregar al carrito
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`sm:w-12 h-12 ${
          isFavorite ? "text-red-500 hover:text-red-700" : ""
        }`}
        onClick={onToggleFavorite}
        disabled={isAddingToFavorites}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="sm:w-12 h-12"
        onClick={onShare}
        disabled={isSharing}
      >
        {isSharing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Share2 className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
