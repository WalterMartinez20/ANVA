import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/producto_admin";

interface Props {
  images: ProductImage[];
  altText: string;
  aspectRatio?: "square" | "landscape" | "portrait";
  rounded?: boolean;
  largeButtons?: boolean;
  showArrows?: boolean;
  showThumbnails?: boolean;
  layout?: "default" | "vertical"; // mostrar horizontalmente (por defecto) o verticalmente
}

const ProductGallerySlider: React.FC<Props> = ({
  images,
  altText,
  aspectRatio = "square",
  rounded = true,
  largeButtons = false,
  showArrows = true,
  showThumbnails = true,
  layout = "default",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ordenar: primero la imagen principal (isMain), luego por posiciĆ³n
  const sortedImages = [...images].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return (a.position ?? 0) - (b.position ?? 0);
  });

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "landscape"
      ? "aspect-video"
      : "aspect-[3/4]";

  if (!Array.isArray(images) || images.length === 0) {
    return (
      <div className={cn("bg-gray-100", aspectClass, rounded && "rounded-md")}>
        <img
          src="/carteras/E1.png"
          alt="Sin imagen"
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  if (layout === "vertical") {
    return (
      <div className="flex gap-4">
        {/* Miniaturas a la izquierda */}
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px]">
          {sortedImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-16 h-16 border rounded-md overflow-hidden",
                idx === currentIndex ? "border-primary" : "border-gray-200"
              )}
              aria-label={`Seleccionar imagen ${idx + 1}`}
            >
              <img
                src={img.url}
                alt={`${altText} miniatura ${idx + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>

        {/* Imagen principal */}
        <div
          className={cn(
            "relative flex-1 bg-gray-100 rounded-md overflow-hidden",
            aspectClass
          )}
        >
          <img
            src={sortedImages[currentIndex]?.url}
            alt={`${altText} vista ${currentIndex + 1}`}
            className="object-cover w-full h-full rounded-md"
          />

          {sortedImages.length > 1 && showArrows && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPrevious();
                }}
                className={cn(
                  "absolute top-1/2 left-2 -translate-y-1/2 bg-white/90 rounded-full shadow-md z-10",
                  largeButtons ? "p-3" : "p-2"
                )}
              >
                <ChevronLeft className="text-black w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToNext();
                }}
                className={cn(
                  "absolute top-1/2 right-2 -translate-y-1/2 bg-white/90 rounded-full shadow-md z-10",
                  largeButtons ? "p-3" : "p-2"
                )}
              >
                <ChevronRight className="text-black w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "relative overflow-hidden bg-gray-100 rounded-md group",
          aspectClass
        )}
      >
        <img
          src={sortedImages[currentIndex]?.url}
          alt={`${altText} vista ${currentIndex + 1}`}
          className="object-cover w-full h-full rounded-md"
        />

        {sortedImages.length > 1 && showArrows && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPrevious();
              }}
              className={cn(
                "absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition",
                largeButtons && "p-3"
              )}
              aria-label="Imagen anterior"
            >
              <ChevronLeft
                className={cn(
                  "text-black",
                  largeButtons ? "w-7 h-7" : "w-5 h-5"
                )}
              />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
              }}
              className={cn(
                "absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition",
                largeButtons && "p-3"
              )}
              aria-label="Imagen siguiente"
            >
              <ChevronRight
                className={cn(
                  "text-black",
                  largeButtons ? "w-7 h-7" : "w-5 h-5"
                )}
              />
            </button>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {sortedImages.map((_, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    idx === currentIndex ? "bg-primary" : "bg-gray-300"
                  )}
                  aria-label={`Imagen ${idx + 1}`}
                  aria-current={idx === currentIndex}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {showThumbnails && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {sortedImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-16 h-16 border rounded-md overflow-hidden flex-shrink-0",
                idx === currentIndex ? "border-primary" : "border-gray-200"
              )}
              aria-label={`Seleccionar imagen ${idx + 1}`}
            >
              <img
                src={img.url}
                alt={`${altText} miniatura ${idx + 1}`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallerySlider;
