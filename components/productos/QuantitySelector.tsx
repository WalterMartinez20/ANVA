//Control de cantidad con botones

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onChange?: (value: number) => void;
}

export default function QuantitySelector({
  quantity,
  stock,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Cantidad</h3>
      <div className="flex items-center w-32 border rounded-md overflow-hidden">
        <button
          onClick={onDecrease}
          disabled={quantity <= 1}
          className="px-3 py-2 hover:bg-muted transition-colors duration-200 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="flex-1 text-center">{quantity}</span>

        <button
          onClick={onIncrease}
          disabled={quantity >= stock}
          className="px-3 py-2 hover:bg-muted transition-colors duration-200 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm mt-2 flex items-center gap-1">
        {stock > 0 ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">En stock</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-500 font-medium">Agotado</span>
          </>
        )}
      </p>
    </div>
  );
}
