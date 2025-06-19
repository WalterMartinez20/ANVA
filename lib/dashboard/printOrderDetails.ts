import { formatPrice, getPaymentLabel, getOrderStatusLabel } from "@/lib/utils";
import type { OrderWithUser } from "@/types/order";

export function printOrderDetails(order: OrderWithUser) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const orderDate = new Date(order.createdAt).toLocaleDateString("es-ES");

  printWindow.document.write(`
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Pedido #${order.id}</title>
    <style>
      :root {
        --primary: #934D48;
        --foreground: #534741;
        --muted: #D5CAC4;
        --accent: #C9B0AB;
        --border: #D5CAC4;
        --background: #E5E4E0;
      }

      * {
        box-sizing: border-box;
      }

      body {
        font-family: "Museo Sans", Arial, sans-serif;
        margin: 40px auto;
        padding: 0 24px;
        background: white;
        color: var(--foreground);
        max-width: 960px;
        line-height: 1.6;
      }

      h1, h2 {
        color: var(--primary);
        border-bottom: 2px solid var(--primary);
        margin-bottom: 12px;
        padding-bottom: 4px;
      }

      p {
        margin: 4px 0;
        font-size: 14px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 36px;
      }

      .header img {
        max-height: 60px;
      }

      .print-button {
        background-color: var(--primary);
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .print-button:hover {
        background-color: #7a3f3a;
      }

      .section {
        margin-top: 30px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 16px;
        font-size: 13px;
      }

      th, td {
        border: 1px solid var(--border);
        padding: 10px;
        text-align: left;
      }

      th {
        background-color: var(--primary);
        color: white;
      }

      tr:nth-child(even) {
        background-color: var(--background);
      }

      .table-footer {
        background-color: var(--muted);
        font-weight: bold;
        color: var(--primary);
      }

      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #777;
        border-top: 1px solid var(--border);
        padding-top: 20px;
        text-align: center;
      }

      @media print {
        .print-button {
          display: none;
        }
        body {
          margin: 20px;
          font-size: 12px;
        }
        table {
          font-size: 12px;
        }
      }
    </style>
  </head>
  <body>
    <!-- ENCABEZADO -->
    <div class="header">
      <div>
        <h1>Pedido #${order.id}</h1>
        <p>📅 Fecha: ${orderDate}</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end;">
        <img src="/logos/logo_principal_letras.png" alt="Logo ANVA" />
        <button class="print-button" onclick="window.print()">🖨️ Imprimir</button>
      </div>
    </div>

    <!-- CLIENTE -->
    <div class="section">
      <h2>👤 Información del Cliente</h2>
      <p><strong>Nombre:</strong> ${order.user.nombres} ${
    order.user.apellidos
  }</p>
      <p><strong>Email:</strong> ${order.user.email}</p>
      <p><strong>Teléfono:</strong> ${order.phone || "No especificado"}</p>
      <p><strong>Dirección:</strong> ${order.address || "No especificada"}</p>
    </div>

    <!-- PRODUCTOS -->
    <div class="section">
      <h2>📦 Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td>${item.product.name}</td>
              <td>${formatPrice(item.price)}</td>
              <td>${item.quantity}</td>
              <td>${formatPrice(item.price * item.quantity)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr class="table-footer">
            <td colspan="3" style="text-align: right;">Total:</td>
            <td>${formatPrice(order.total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- ENVÍO -->
    <div class="section">
      <h2>🚚 Envío</h2>
      <p><strong>Estado:</strong> ${getOrderStatusLabel(order.status)}</p>
      <p><strong>N° Seguimiento:</strong> ${
        order.trackingNumber || "No especificado"
      }</p>
      <p><strong>Transportista:</strong> ${
        order.carrier || "No especificado"
      }</p>
      <p><strong>Entrega Estimada:</strong> ${
        order.estimatedDeliveryDate
          ? new Date(order.estimatedDeliveryDate).toLocaleDateString("es-ES")
          : "No especificada"
      }</p>
    </div>

    <!-- PAGOS -->
    <div class="section">
      <h2>💳 Pagos</h2>
      <table>
        <thead>
          <tr>
            <th>Método</th>
            <th>Estado</th>
            <th>Referencia</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          ${order.payments
            .map(
              (p) => `
            <tr>
              <td>${getPaymentLabel(p.method)}</td>
              <td>${getOrderStatusLabel(p.status)}</td>
              <td>${p.reference || "-"}</td>
              <td>${formatPrice(p.amount)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>Gracias por comprar con <strong>ANVA</strong></p>
      <p>📞 <strong>Atención al Cliente:</strong> +503 7865 9463 | anvahechoamano@gmail.com</p>
      <p>📍 Puerto El Triunfo, Usulután, El Salvador</p>
    </div>
  </body>
</html>
  `);

  printWindow.document.close();
}
