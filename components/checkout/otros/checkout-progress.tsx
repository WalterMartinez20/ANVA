import { CheckCircle } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: string;
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { id: "shipping", label: "Envío" },
    { id: "payment", label: "Pago" },
    { id: "review", label: "Revisión" },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  return (
    <div className="relative">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = getCurrentStepIndex() > index;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-600 text-white"
                    : isActive
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`text-sm mt-1 ${
                  isActive ? "font-medium text-primary" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${(getCurrentStepIndex() / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
