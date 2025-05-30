"use client";

import { Instagram, MessageCircle, ArrowUp, Facebook } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const socialItems = [
  {
    icon: Facebook,
    name: "Facebook",
    link: "https://www.facebook.com/share/18Grb5voXJ/?mibextid=wwXIfr",
    hoverColor: "hover:bg-[#1877F2]",
    iconColor: "text-[#1877F2]",
    tooltipColor: "bg-[#1877F2]",
  },
  {
    icon: Instagram,
    name: "Instagram",
    link: "https://www.instagram.com/anva.sv/?igsh=NjltdGZqNDdva2Vo#",
    hoverColor:
      "hover:bg-gradient-to-br hover:from-pink-500 hover:via-red-500 hover:to-yellow-500",
    iconColor: "text-[#E1306C]",
    tooltipColor: "bg-[#E1306C]",
  },
  {
    icon: MessageCircle,
    name: "WhatsApp",
    link: "https://wa.me/1234567890",
    hoverColor: "hover:bg-[#25D366]",
    iconColor: "text-[#25D366]",
    tooltipColor: "bg-[#25D366]",
  },
];

export default function FloatingSocialPanel() {
  const [visible, setVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Botón subir - esquina inferior izquierda */}
      <div
        className={`fixed bottom-8 left-4 z-10 transition-all duration-500 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={scrollToTop}
          aria-label="Volver arriba"
          className="w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
        >
          <ArrowUp size={20} />
        </button>
      </div>

      {/* Redes sociales y botón de colapsar */}
      <div className="fixed bottom-8 right-2 z-10 flex items-end gap-2">
        {/* Panel de redes */}
        {panelOpen && (
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-lg shadow-lg flex flex-col gap-3">
            {socialItems.map(
              ({
                icon: Icon,
                name,
                link,
                hoverColor,
                iconColor,
                tooltipColor,
              }) => (
                <Link
                  key={name}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                >
                  <div
                    className={`group relative w-10 h-10 flex items-center justify-center bg-white rounded-md transition-colors duration-300 shadow-sm ${hoverColor}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${iconColor} transition duration-300 group-hover:text-white`}
                    />
                    {/* Tooltip */}
                    <div
                      className={`absolute right-14 top-1/2 -translate-y-1/2 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow ${tooltipColor}`}
                    >
                      {name}
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}
