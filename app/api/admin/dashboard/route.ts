import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUserAppRouter } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserAppRouter();

    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "year";

    // Calcular fecha de inicio según el rango de tiempo
    const startDate = new Date();
    switch (timeRange) {
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case "all":
        startDate.setFullYear(2000); // Fecha muy antigua para incluir todo
        break;
    }

    // Obtener estadísticas generales
    const totalProducts = await prisma.product.count();
    const totalCustomers = await prisma.user.count({
      where: { role: Role.USER },
    });

    // Obtener pedidos dentro del rango de tiempo
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcular ventas totales
    const totalSales = orders.reduce((sum, order) => {
      if (order.status !== "CANCELLED") {
        return sum + order.total;
      }
      return sum;
    }, 0);

    // Obtener pedidos recientes
    const recentOrders = orders.slice(0, 5).map((order) => ({
      id: order.id,
      customer: `${order.user.nombres} ${order.user.apellidos}`,
      date: order.createdAt,
      status: order.status,
      total: order.total,
    }));

    // Calcular productos más vendidos
    const productSales = new Map();
    const productRevenue = new Map();
    const categorySales = new Map();

    orders.forEach((order) => {
      if (order.status !== "CANCELLED") {
        order.items.forEach((item) => {
          const productId = item.productId;
          const product = item.product;
          const category = item.product?.category?.name ?? "Sin categoría";

          // Acumular ventas por producto
          const currentSales = productSales.get(productId) || 0;
          productSales.set(productId, currentSales + item.quantity);

          // Acumular ingresos por producto
          const currentRevenue = productRevenue.get(productId) || 0;
          productRevenue.set(
            productId,
            currentRevenue + item.price * item.quantity
          );

          // Acumular ventas por categoría
          const currentCategorySales = categorySales.get(category) || 0;
          categorySales.set(
            category,
            currentCategorySales + item.price * item.quantity
          );
        });
      }
    });

    // Obtener detalles de los productos más vendidos
    const topProductIds = [...productSales.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);

    const productsDetails = await prisma.product.findMany({
      where: {
        id: {
          in: topProductIds,
        },
      },
    });

    const topProducts = productsDetails
      .map((product) => ({
        id: product.id,
        name: product.name,
        sales: productSales.get(product.id) || 0,
        revenue: productRevenue.get(product.id) || 0,
        stock: product.stock,
      }))
      .sort((a, b) => b.sales - a.sales);

    // Calcular ventas por mes
    const now = new Date();
    const currentYear = now.getFullYear();

    type MonthlySales = {
      month: string;
      sales: number;
    };

    const salesByMonth: MonthlySales[] = [];

    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    // Inicializar con ceros
    for (let i = 0; i < 12; i++) {
      salesByMonth.push({
        month: monthNames[i],
        sales: 0,
      });
    }

    // Sumar ventas por mes
    orders.forEach((order) => {
      if (order.status !== "CANCELLED") {
        const orderDate = new Date(order.createdAt);
        if (orderDate.getFullYear() === currentYear) {
          const month = orderDate.getMonth();
          salesByMonth[month].sales += order.total;
        }
      }
    });

    // Preparar datos para gráficos adicionales
    // Ventas por categoría para el gráfico de pastel
    const salesByCategory = Array.from(categorySales.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // Pedidos por estado para el gráfico de barras
    const orderStatusCounts = new Map();
    orders.forEach((order) => {
      const status = order.status;
      const currentCount = orderStatusCounts.get(status) || 0;
      orderStatusCounts.set(status, currentCount + 1);
    });

    const statusNames = {
      PENDING: "Pendiente",
      PROCESSING: "En proceso",
      SHIPPED: "Enviado",
      DELIVERED: "Entregado",
      CANCELLED: "Cancelado",
    };

    const ordersByStatus = Array.from(orderStatusCounts.entries()).map(
      ([status, value]) => ({
        name: statusNames[status as keyof typeof statusNames] || status,
        value,
      })
    );

    // Crecimiento de clientes por mes
    type MonthlyCustomerGrowth = {
      month: string;
      customers: number;
    };
    const customersByMonth: MonthlyCustomerGrowth[] = [];

    for (let i = 0; i < 12; i++) {
      customersByMonth.push({
        month: monthNames[i],
        customers: 0,
      });
    }

    // Obtener usuarios registrados en el último año
    const users = await prisma.user.findMany({
      where: {
        role: Role.USER,
        createdAt: {
          gte: new Date(currentYear, 0, 1),
        },
      },
    });

    users.forEach((user) => {
      const registerDate = new Date(user.createdAt);
      if (registerDate.getFullYear() === currentYear) {
        const month = registerDate.getMonth();
        customersByMonth[month].customers += 1;
      }
    });

    // Calcular fechas del período anterior
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(startDate); // fin del período anterior = inicio del actual

    // VENTAS PERÍODO ANTERIOR
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
        status: { not: "CANCELLED" },
      },
    });
    const previousTotalSales = previousOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    // PEDIDOS PERÍODO ANTERIOR
    const previousTotalOrders = previousOrders.length;

    // CLIENTES NUEVOS PERÍODO ACTUAL
    const customersInPeriod = await prisma.user.findMany({
      where: {
        role: Role.USER,
        createdAt: {
          gte: startDate,
        },
      },
    });
    const previousCustomers = await prisma.user.findMany({
      where: {
        role: Role.USER,
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
      },
    });

    // PRODUCTOS NUEVOS
    const newProductsThisPeriod = await prisma.product.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Utilidad segura para evitar NaN o división por cero
    function safePercentageChange(
      current: number,
      previous: number
    ): number | null {
      if (isNaN(current) || isNaN(previous)) return null;
      if (previous === 0) {
        if (current === 0) return 0;
        return 100;
      }
      return ((current - previous) / previous) * 100;
    }

    const salesChangePercentage = safePercentageChange(
      totalSales,
      previousTotalSales
    );
    const ordersChangePercentage = safePercentageChange(
      orders.length,
      previousTotalOrders
    );
    const customersChangePercentage = safePercentageChange(
      customersInPeriod.length,
      previousCustomers.length
    );

    return NextResponse.json({
      totalSales,
      totalOrders: orders.length,
      totalProducts,
      totalCustomers,
      recentOrders,
      topProducts,
      salesByMonth,
      salesByCategory,
      ordersByStatus,
      customerGrowth: customersByMonth,
      salesChangePercentage,
      ordersChangePercentage,
      customersChangePercentage,
      newProductsThisPeriod,
    });
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    return NextResponse.json(
      { error: "Error al obtener datos del dashboard" },
      { status: 500 }
    );
  }
}
