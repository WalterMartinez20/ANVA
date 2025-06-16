import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserAppRouter } from "@/lib/auth";
import { Role, PaymentMethod } from "@prisma/client";
import { normalizePaymentMethod } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserAppRouter();
    console.log("🧪 Usuario autenticado:", user);

    if (!user || user.role === Role.GUEST) {
      console.log("❌ Usuario no autorizado o es GUEST");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { shippingInfo, cartItems, shippingMethod, paymentMethod, total } =
      body;

    console.log("📦 Body recibido:", JSON.stringify(body, null, 2));

    if (!shippingInfo?.address || !shippingInfo?.phone) {
      console.log("❌ Dirección o teléfono faltante");
      return NextResponse.json(
        { error: "Dirección y teléfono son requeridos" },
        { status: 400 }
      );
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.log("❌ Carrito vacío");
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    const orderItems = [];

    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        console.log(`❌ Producto con ID ${item.id} no encontrado`);
        return NextResponse.json(
          { error: `Producto con ID ${item.id} no encontrado` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        console.log(`❌ Stock insuficiente para ${product.name}`);
        return NextResponse.json(
          { error: `Stock insuficiente para el producto "${product.name}"` },
          { status: 400 }
        );
      }

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const normalizedMethod = normalizePaymentMethod(paymentMethod);
    console.log("💳 Método de pago normalizado:", normalizedMethod);

    if (
      !Object.values(PaymentMethod).includes(normalizedMethod as PaymentMethod)
    ) {
      console.log("❌ Método de pago inválido:", normalizedMethod);
      return NextResponse.json(
        { error: `Método de pago inválido: ${normalizedMethod}` },
        { status: 400 }
      );
    }

    console.log("✅ Todos los datos validados. Creando orden...");

    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: "PENDING",
        address: shippingInfo.address,
        phone: shippingInfo.phone,
        shippingMethod,
        paymentMethod: normalizedMethod,
        customerName: `${user.nombres} ${user.apellidos}`,
        customerEmail: user.email,
        items: {
          create: orderItems,
        },
        payments: {
          create: {
            amount: total,
            method: normalizedMethod,
            status: "PENDING",
          },
        },
        statusHistory: {
          create: {
            status: "PENDING",
            notes: "Orden creada desde checkout",
          },
        },
      },
      include: {
        items: { include: { product: true } },
        payments: true,
        statusHistory: true,
      },
    });

    console.log("✅ Orden creada exitosamente:", newOrder.id);

    await Promise.all(
      cartItems.map((item) =>
        prisma.product.update({
          where: { id: item.id },
          data: {
            stock: { decrement: item.quantity },
          },
        })
      )
    );

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("🔥 Error en /api/checkout:", error);
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}
