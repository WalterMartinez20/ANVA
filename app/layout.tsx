import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/components/cart/cart-provider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar/navbar";
import Cart from "@/components/cart/cart";
import Footer from "@/components/home/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ANVA - Carteras Artesanales",
  description:
    "✨ Carteras y accesorios hechos a mano. 🎀 Exclusivos, personalizados y llenos de estilo. 🌸 Para mujeres que valoran lo autentico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Aqui se ponen los metadatos del sitio */}
        <link
          rel="shortcut icon"
          href="/logos/logo_principal.png"
          type="image/x-icon"
        />
      </head>
      <body>
        {/* className={inter.className} */}
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <Cart />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
