"use client";

import ProductGrid from "@/components/home/product-grid";
import HeroSlider from "@/components/home/hero-slider";
import WhyChooseUs from "@/components/home/why-choose-us";
import MainCategories from "@/components/home/main-categories";
import SocialPanel from "@/components/home/SocialPanel";
import FeaturedProducts from "@/components/productos/featured-products";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  // const { toast } = useToast(); // ← HOOK DEL TOAST
  // const handleClick = () => {toast({title: "Hola 👋",description: "Este es un mensaje de prueba desde el botón",});};

  return (
    <>
      {/* Botón para disparar toast */}
      {/* <div className="text-center mt-6"><Button onClick={handleClick}>Mostrar toast</Button></div> */}

      {/* Redes sociales */}
      <SocialPanel />

      {/* Hero Slider */}
      <div className="container mx-auto px-4 py-8 bg-gray-100">
        <HeroSlider />
      </div>

      {/* Por qué elegirnos */}
      <div className="container mx-auto px-4 py-8 bg-gray-50">
        <WhyChooseUs />
      </div>

      {/* Categorías Principales */}
      <div className="container mx-auto px-4 py-8 bg-gray-100">
        <MainCategories />
      </div>

      {/* Todos los productos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">
            Todos los Productos
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Explora todo nuestro catálogo de productos artesanales
          </p>

          <ProductGrid />
          {/* Botón para ver todos los productos */}
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/categoria/todos">Ver más productos</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
