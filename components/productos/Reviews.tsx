import { Star, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
}

interface ReviewsProps {
  reviews: Review[];
  average: number;
}

export default function Reviews({ reviews, average }: ReviewsProps) {
  return (
    <div className="space-y-8">
      {/* Resumen de puntuaciones */}
      <div className="flex items-center gap-6 border-b pb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary">
            {average.toFixed(1)}
          </div>
          <div className="flex justify-center mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(average)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {reviews.length} reseñas
          </div>
        </div>
        <Button variant="outline" className="ml-auto">
          Escribir una reseña
        </Button>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">Reseñas de clientes</h3>
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-md p-4 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3 mb-1">
              <UserCircle className="w-6 h-6 text-gray-400" />
              <div>
                <div className="font-medium text-sm">{review.name}</div>
                <div className="text-xs text-muted-foreground">
                  {review.date}
                </div>
              </div>
            </div>

            <div className="flex items-center mt-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-gray-800 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
