import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  active?: boolean;
  href?: string;
};

export default function PoliticaCard({
  icon,
  title,
  description,
  active,
  href,
}: Props) {
  const cardContent = (
    <Card
      className={clsx(
        "transition-shadow cursor-pointer",
        active ? "border-primary bg-primary/10" : "hover:shadow-md"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center mb-2 text-primary">
          {icon}
          <h3 className="text-lg font-semibold ml-2">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return <a href={href}>{cardContent}</a>;
  }

  return cardContent;
}
