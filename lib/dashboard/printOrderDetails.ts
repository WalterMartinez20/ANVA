import { formatPrice, getPaymentLabel } from "@/lib/utils";
import type { OrderWithUser } from "@/types/order";

export function printOrderDetails(order: OrderWithUser) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const orderDate = new Date(order.createdAt).toLocaleDateString("es-ES");

  printWindow.document.write(`
    <html>
      <head>
        <title>Pedido #${order.id}</title>
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
            background-color: #f9f9f9;
          }
          h1, h2 {
            color: #1c2c3c;
            margin-bottom: 10px;
            border-bottom: 3px solid #2980b9;
            padding-bottom: 5px;
            font-weight: bold;
          }
          p {
            margin: 6px 0;
            font-size: 15px;
            color: #555;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 15px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px 8px;
            text-align: left;
            color: #333;
          }
          th {
            background-color: #2980b9;
            color: white;
            font-size: 16px;
          }
          tr:nth-child(even) {
            background-color: #f4f4f4;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 24px;
            color: #1c2c3c;
            font-weight: bold;
          }
          .header p {
            font-size: 16px;
            color: #7f8c8d;
          }
          .section {
            margin-top: 30px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #7f8c8d;
          }
          .print-button {
            background-color: #27ae60;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            text-transform: uppercase;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .print-button:hover {
            background-color: #2ecc71;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          .table-footer {
            font-weight: bold;
            background-color: #f0f0f0;
            font-size: 16px;
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
        <div class="header">
          <div>
            <h1>Detalle de Pedido #${order.id}</h1>
            <p>Fecha: ${orderDate}</p>
          </div>
          <button class="print-button" onclick="window.print()">🖨️ Imprimir</button>
        </div>

        <div class="section">
          <h2>Información del Cliente</h2>
          <p><strong>Nombre:</strong> ${order.user.nombres} ${
    order.user.apellidos
  }</p>
          <p><strong>Email:</strong> ${order.user.email}</p>
          <p><strong>Teléfono:</strong> ${order.phone || "No especificado"}</p>
          <p><strong>Dirección:</strong> ${
            order.address || "No especificada"
          }</p>
        </div>

        <div class="section">
          <h2>Productos</h2>
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
                </tr>`
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

        <div class="section">
          <h2>Envío</h2>
          <p><strong>Estado:</strong> ${order.status}</p>
          <p><strong>N° Seguimiento:</strong> ${
            order.trackingNumber || "No especificado"
          }</p>
          <p><strong>Transportista:</strong> ${
            order.carrier || "No especificado"
          }</p>
          <p><strong>Entrega Estimada:</strong> ${
            order.estimatedDeliveryDate
              ? new Date(order.estimatedDeliveryDate).toLocaleDateString(
                  "es-ES"
                )
              : "No especificada"
          }</p>
        </div>

        <div class="section">
          <h2>Pagos</h2>
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
                  <td>${p.status}</td>
                  <td>${p.reference || "-"}</td>
                  <td>${formatPrice(p.amount)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Este documento es un comprobante de pedido. Para cualquier consulta, contacte con atención al cliente.</p>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
}
