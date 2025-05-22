"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileCheckout } from "./mobile-checkout";

interface ResponsiveCheckoutProps {
  items: any[];
  subtotal: number;
  shipping: number;
  discount: number;
  membershipDiscount: number;
  total: number;
}

export function ResponsiveCheckout(props: ResponsiveCheckoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{!isDesktop && <MobileCheckout {...props} />}</>;
}
