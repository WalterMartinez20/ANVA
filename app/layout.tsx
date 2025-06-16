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
import CookieBanner from "@/components/ui/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ANVA - Carteras Artesanales",
  description:
    "✨ Carteras y accesorios hechos a mano. 🎀 Exclusivos, personalizados y llenos de estilo. 🌸 Para mujeres que valoran lo auténtico.",
  keywords: [
    "carteras artesanales",
    "accesorios hechos a mano",
    "moda femenina",
    "carteras personalizadas",
    "ANVA",
  ],
  authors: [{ name: "ANVA" }],
  openGraph: {
    title: "ANVA - Carteras Artesanales",
    description:
      "Carteras y accesorios exclusivos, hechos a mano. Descubrí el estilo único de ANVA.",
    url: "https://tusitio.com", // reemplazá con tu URL real
    siteName: "ANVA",
    images: [
      {
        url: "https://tusitio.com/og-image.jpg", // poné una imagen representativa (mínimo 1200x630)
        width: 1200,
        height: 630,
        alt: "ANVA - Carteras artesanales hechas a mano",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANVA - Carteras Artesanales",
    description:
      "Carteras hechas a mano, personalizadas y llenas de estilo. Descubrí la colección ANVA.",
    images: ["https://tusitio.com/og-image.jpg"],
    creator: "@anvastore", // opcional
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
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
            <CookieBanner />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
