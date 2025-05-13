import {
  PrismaClient,
  Role,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🧹 Limpiando base de datos...");
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productMaterial.deleteMany();
    await prisma.material.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Base de datos limpiada.");

    // 🔐 Crear usuarios
    const adminPassword = await hashPassword("admin123");
    const userPassword = await hashPassword("user123");

    const [admin, user] = await Promise.all([
      prisma.user.create({
        data: {
          nombres: "Admin",
          apellidos: "Sistema",
          email: "admin@example.com",
          password: adminPassword,
          role: Role.ADMIN,
        },
      }),
      prisma.user.create({
        data: {
          nombres: "Usuario",
          apellidos: "Regular",
          email: "user@example.com",
          password: userPassword,
          role: Role.USER,
        },
      }),
    ]);

    console.log("👤 Usuarios creados:");
    console.table([admin.email, user.email]);

    // 🧵 Crear materiales
    const materials = await prisma.material.createMany({
      data: [
        {
          name: "Cuero sintético",
          description: "Alta calidad",
          stock: 100,
          unit: "metros",
        },
        {
          name: "Cuero genuino",
          description: "Primera calidad",
          stock: 50,
          unit: "metros",
        },
        {
          name: "Hebillas doradas",
          description: "Metálicas doradas",
          stock: 200,
          unit: "unidades",
        },
        {
          name: "Cremalleras",
          description: "De metal resistentes",
          stock: 150,
          unit: "unidades",
        },
        {
          name: "Forro de tela",
          description: "Interior de carteras",
          stock: 80,
          unit: "metros",
        },
      ],
      skipDuplicates: true,
    });

    const allMaterials = await prisma.material.findMany();
    console.log(`🧱 Materiales insertados: ${allMaterials.length}`);

    // 👜 Crear productos de ejemplo
    const productsData = [
      {
        name: "Cartera Elegance",
        description: "Cartera elegante de cuero sintético",
        price: 89.99,
        stock: 15,
        category: "Carteras",
        images: [
          "Cartera+Elegance+1",
          "Cartera+Elegance+2",
          "Cartera+Elegance+3",
        ],
        materials: [
          { name: "Cuero sintético", quantity: 0.5 },
          { name: "Hebillas doradas", quantity: 2 },
          { name: "Forro de tela", quantity: 0.3 },
        ],
      },
      {
        name: "Clutch Noche",
        description: "Elegante clutch con cadena desmontable",
        price: 55.0,
        stock: 25,
        category: "Clutch",
        images: ["Clutch+Noche+1", "Clutch+Noche+2", "Clutch+Noche+3"],
        materials: [
          { name: "Cuero sintético", quantity: 0.3 },
          { name: "Hebillas doradas", quantity: 1 },
          { name: "Forro de tela", quantity: 0.2 },
        ],
      },
    ];

    for (const product of productsData) {
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
        },
      });

      // Imágenes
      for (const [index, urlPart] of product.images.entries()) {
        await prisma.productImage.create({
          data: {
            url: `/placeholder.svg?height=500&width=500&text=${urlPart}`,
            isMain: index === 0,
            productId: createdProduct.id,
          },
        });
      }

      // Materiales
      for (const m of product.materials) {
        const mat = allMaterials.find((mat) => mat.name === m.name);
        if (!mat) continue;
        await prisma.productMaterial.create({
          data: {
            productId: createdProduct.id,
            materialId: mat.id,
            quantity: m.quantity,
          },
        });
      }
    }

    console.log(`👜 Productos creados: ${productsData.length}`);

    // ⭐ Crear favoritos
    await prisma.favorite.createMany({
      data: [
        { userId: user.id, productId: 1 },
        { userId: user.id, productId: 2 },
        { userId: admin.id, productId: 1 },
      ],
    });

    console.log("❤️ Favoritos asignados.");

    // 📦 Crear órdenes
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: 144.99,
        address: "Calle Principal 123",
        phone: "123-456-7890",
        status: OrderStatus.PROCESSING,
        items: {
          create: [
            { productId: 1, quantity: 1, price: 89.99 },
            { productId: 2, quantity: 1, price: 55.0 },
          ],
        },
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: 144.99,
        method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        reference: "PAY-EXAMPLE-1",
      },
    });

    console.log("🧾 Orden y pago creados:", order.id);

    console.log("🎉 Base de datos inicializada correctamente.");
  } catch (error) {
    console.error("❌ Error en la inicialización:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
