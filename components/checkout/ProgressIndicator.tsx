type Props = {
  currentStep: string;
};

const steps = [
  { id: "information", label: "Información" },
  { id: "shipping", label: "Envío" },
  { id: "payment", label: "Pago" },
];

export function ProgressIndicator({ currentStep }: Props) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="flex items-center justify-between max-w-md mx-auto">
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;

        return (
          <div key={step.id} className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive ? "bg-primary text-white" : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-1">{step.label}</span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-gray-200 relative">
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                    currentIndex > index ? "bg-primary" : "bg-gray-200"
                  }`}
                  style={{
                    width: currentIndex > index ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
