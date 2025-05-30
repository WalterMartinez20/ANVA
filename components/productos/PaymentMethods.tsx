export default function PaymentMethods() {
  const methods = [
    {
      name: "Efectivo",
      url: "https://cdn-icons-png.flaticon.com/512/2488/2488749.png",
    },
    {
      name: "Depósito Bancario",
      url: "https://cdn-icons-png.flaticon.com/512/10842/10842175.png",
    },
  ];

  return (
    <div className="flex gap-4 mt-2">
      {methods.map((method) => (
        <img
          key={method.name}
          src={method.url}
          alt={method.name}
          className="h-16 w-auto object-contain"
          title={method.name}
        />
      ))}
    </div>
  );
}
