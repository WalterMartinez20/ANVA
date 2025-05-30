import { Shield, Truck, CreditCard, RefreshCw } from "lucide-react";

const indicators = [
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Compra Segura",
    description: "Tus datos están protegidos",
  },
  {
    icon: <Truck className="h-6 w-6 text-primary" />,
    title: "Envío Rápido",
    description: "A todo el país",
  },
  {
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    title: "Pago Seguro",
    description: "Múltiples métodos",
  },
  {
    icon: <RefreshCw className="h-6 w-6 text-primary" />,
    title: "Devolución Fácil",
    description: "30 días de garantía",
  },
];

export function TrustIndicators() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {indicators.map((item, index) => (
        <TrustItem
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  );
}

function TrustItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 border rounded-md bg-white hover:shadow-sm transition">
      <div className="mb-2">{icon}</div>
      <h3 className="font-medium text-sm text-gray-800">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
