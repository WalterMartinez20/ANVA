import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import TooltipInfoButton from "@/components/help/TooltipInfoButton";

const developers = [
  {
    name: "Juan Martinez",
    role: "Project Manager",
    portfolio: "https://juanperez.dev",
    avatar: "https://ui-avatars.com/api/?name=Juan+Pérez&background=random",
  },
  {
    name: "Walter Martinez",
    role: "Desarrollador Backend",
    portfolio: "https://anagarcia.dev",
    avatar: "https://ui-avatars.com/api/?name=Ana+García&background=random",
  },
  {
    name: "Kevin Bonilla",
    role: "Diseñador UX/UI",
    portfolio: "https://corcio2021.github.io/MiPortfolio/",
    avatar: "https://ui-avatars.com/api/?name=Carlos+Torres&background=random",
  },
  {
    name: "Maria Martinez",
    role: "Product Manager",
    portfolio: "https://luisafernandez.dev",
    avatar:
      "https://ui-avatars.com/api/?name=Luisa+Fernández&background=random",
  },
  {
    name: "Jose Chavez",
    role: "Diseñador",
    portfolio: "https://davidramirez.dev",
    avatar: "https://ui-avatars.com/api/?name=David+Ramírez&background=random",
  },
  {
    name: "Alvaro Moran",
    role: "Desarrollador Frontend",
    portfolio: "https://lauramendez.dev",
    avatar: "https://ui-avatars.com/api/?name=Laura+Méndez&background=random",
  },
];

export default function EquipoDesarrolloPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-gray-800">
            Equipo de Desarrollo
          </h1>
          <TooltipInfoButton content="Aquí puedes conocer al equipo encargado del desarrollo del sistema." />
        </div>

        <Button
          asChild
          className="flex items-center gap-2 shadow-md hover:shadow-lg transition"
        >
          <a
            href="https://mail.google.com/mail/?view=cm&to=usis017621@ugb.edu.sv"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail className="w-4 h-4" />
            Contactar al equipo
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {developers.map((dev, i) => {
          const initials = dev.name
            .split(" ")
            .map((n) => n.charAt(0))
            .join("")
            .toUpperCase();

          const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            dev.name
          )}&background=d8c6bd&color=ffffff&bold=true&size=128`;

          return (
            <Card
              key={i}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-md text-center hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white shadow-lg mb-4 bg-[#d8c6bd] text-white flex items-center justify-center text-2xl font-semibold">
                  <img
                    src={avatarUrl}
                    alt={`Avatar de ${dev.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{dev.name}</h2>
                <p className="text-sm text-muted-foreground">{dev.role}</p>
                <a
                  href={dev.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-primary hover:underline transition"
                >
                  Ver Portafolio
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
