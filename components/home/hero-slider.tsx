"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SlideProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const slides: SlideProps[] = [
  {
    image: "/carteras/A4.png",
    title: "Bolsos Artesanales",
    description:
      "Descubre nuestra colección exclusiva de bolsos hechos a mano con los mejores materiales",
    buttonText: "Ver Colección",
    buttonLink: "/producto/1",
  },
  {
    image: "/carteras/B1.png",
    title: "Bisutería Única",
    description:
      "Complementa tu estilo con nuestra elegante colección de bisutería artesanal",
    buttonText: "Explorar",
    buttonLink: "/producto/3",
  },
  {
    image: "/carteras/C3.png",
    title: "Nuevos Diseños",
    description:
      "Conoce nuestras últimas creaciones con diseños exclusivos y materiales sostenibles",
    buttonText: "Ver Novedades",
    buttonLink: "/producto/4",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                sizes="100vw"
                priority
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent flex flex-col justify-center p-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <p className="text-white text-lg md:text-xl mb-6 max-w-md">
                  {slide.description}
                </p>
                <Button size="lg" className="w-fit" asChild>
                  <a href={slide.buttonLink}>{slide.buttonText}</a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-10"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6 text-black" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-10"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6 text-black" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentSlide === index ? "bg-primary" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
