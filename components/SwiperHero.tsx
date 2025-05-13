"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; // ✅ Importa estilos de los dots
import { Navigation, Autoplay, Pagination } from "swiper/modules"; // ✅ Agrega Pagination
import Link from "next/link";

const productSlides = [
  { src: "/carteras/A4.png", href: "/producto/1" },
  { src: "/carteras/B1.png", href: "/producto/3" },
  { src: "/carteras/C3.png", href: "/producto/4" },
  { src: "/carteras/D1.png", href: "/producto/5" },
];

export default function SwiperHero() {
  return (
    <Swiper
      modules={[Navigation, Autoplay, Pagination]} // ✅ Agrega Pagination aquí
      navigation
      pagination={{ clickable: true }} // ✅ Activa los dots
      autoplay={{ delay: 3000 }}
      loop
      className="h-full w-full relative z-0 [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white [&_.swiper-pagination-bullet]:bg-white"
    >
      {productSlides.map((item, index) => (
        <SwiperSlide key={index}>
          <Link href={item.href} className="block h-full w-full">
            <img
              src={item.src}
              alt={`Producto ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer"
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
