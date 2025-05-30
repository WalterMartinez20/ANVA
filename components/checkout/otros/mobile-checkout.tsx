"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { OrderSummary } from "./order-summary";

interface MobileCheckoutProps {
  items: any[];
  subtotal: number;
  shipping: number;
  discount: number;
  membershipDiscount: number;
  total: number;
}

export function MobileCheckout({
  items,
  subtotal,
  shipping,
  discount,
  membershipDiscount,
  total,
}: MobileCheckoutProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-10">
      <div className="container px-4 py-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <span className="font-medium">
              {items.length} {items.length === 1 ? "producto" : "productos"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold">${total.toFixed(2)}</span>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="pt-3 mt-3 border-t">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              membershipDiscount={membershipDiscount}
              total={total}
            />
          </div>
        )}
      </div>
    </div>
  );
}
