// components/productos/PaymentMethods.tsx
export default function PaymentMethods() {
  const methods = [
    {
      name: "Visa",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
    },
    {
      name: "Mastercard",
      url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
    },
    {
      name: "American Express",
      url: "https://cdn.freelogovectors.net/wp-content/uploads/2023/05/american-express-logo-freelogovectors.net_-1.png",
    },
    {
      name: "PayPal",
      url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
    },
  ];

  return (
    <div className="flex gap-2 mt-2">
      {methods.map((method) => (
        <img
          key={method.name}
          src={method.url}
          alt={method.name}
          className="h-6"
        />
      ))}
    </div>
  );
}
