import { NextResponse } from "next/server";
import { getCurrentUserAppRouter } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role, PaymentStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUserAppRouter();

    if (!currentUser || currentUser.role === Role.GUEST) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const orderId = Number.parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "ID de pedido inválido" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        payments: true,
        statusHistory: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    if (currentUser.role !== Role.ADMIN && order.userId !== currentUser.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    return NextResponse.json(
      { error: "Error al obtener pedido" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUserAppRouter();
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const {
      status,
      statusNote,
      trackingNumber,
      carrier,
      estimatedDeliveryDate,
      paymentUpdates,
    } = body;

    // Actualizar estado del pedido
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        trackingNumber,
        carrier,
        estimatedDeliveryDate: estimatedDeliveryDate
          ? new Date(estimatedDeliveryDate)
          : null,
      },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        payments: true,
        statusHistory: true,
      },
    });

    // Guardar historial de estado
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        notes: statusNote || null,
      },
    });

    // Actualizar estados de pagos si se incluyen
    if (paymentUpdates && typeof paymentUpdates === "object") {
      await Promise.all(
        Object.entries(paymentUpdates).map(([paymentIdStr, newStatus]) => {
          const id = parseInt(paymentIdStr);

          if (
            !isNaN(id) &&
            typeof newStatus === "string" &&
            Object.values(PaymentStatus).includes(newStatus as PaymentStatus)
          ) {
            console.log("Actualizando pago:", id, "→", newStatus); // ✅ log aquí

            return prisma.payment.update({
              where: { id },
              data: {
                status: newStatus as PaymentStatus, // ✅ casteo necesario aquí
              },
            });
          }

          return Promise.resolve(); // evita error si no pasa validación
        })
      );
    }

    const refreshedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        payments: true,
        statusHistory: true,
      },
    });

    return NextResponse.json({ order: refreshedOrder });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    return NextResponse.json(
      { error: "Error al actualizar pedido" },
      { status: 500 }
    );
  }
}
