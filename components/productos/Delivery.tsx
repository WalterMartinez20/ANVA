import { Store, Truck } from "lucide-react";

export default function DeliveryOptions() {
  const options = [
    {
      title: "Retiro en tienda",
      icon: <Store className="h-6 w-6 text-primary" />,
      description: "Disponible en nuestra tienda principal.",
    },
    {
      title: "Envío a domicilio",
      icon: <Truck className="h-6 w-6 text-primary" />,
      description: "Entrega en 3 a 5 días hábiles.",
    },
  ];

  return (
    <div className="mt-2 grid sm:grid-cols-2 gap-4">
      {options.map((option) => (
        <div
          key={option.title}
          className="flex items-center gap-4 border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="bg-primary/10 p-2 rounded-full">{option.icon}</div>
          <div>
            <p className="text-sm font-semibold">{option.title}</p>
            <p className="text-sm text-gray-600">{option.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
