import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const parsed = new URL(databaseUrl);
const databaseName = parsed.pathname.replace(/^\//, "").toLowerCase();
if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname) || !/(test|storefront)/.test(databaseName)) {
  throw new Error("Refusing to seed carrier fixtures outside a loopback test/storefront database");
}

process.env.CARRIER_ENVIRONMENT = "mock";
process.env.CARRIER_PROVIDER = "MOCK";
process.env.CARRIER_WEBHOOK_SECRET ||= "local-carrier-webhook";

async function main() {
  const [{ prisma }, { createCarrierOrder, quoteCarrierShipment }] = await Promise.all([
    import("../src/server/db/client"),
    import("../src/domains/shipment/server/carrier"),
  ]);
  const refNo = "LOCAL-CARRIER-TEST-001";

  try {
    const order = await prisma.order.upsert({
      where: { refNo },
      update: {
        customerName: "Khách test vận chuyển",
        shipPhone: "0900000999",
        shipAddress: "1 Nguyễn Huệ",
        shipWard: "Bến Nghé",
        shipDistrict: "Quận 1",
        shipCity: "Hồ Chí Minh",
        subtotal: 25_000_000,
        hasShipment: true,
        notes: "Dữ liệu test local cho tích hợp nhà vận chuyển",
      },
      create: {
        refNo,
        customerName: "Khách test vận chuyển",
        shipPhone: "0900000999",
        shipAddress: "1 Nguyễn Huệ",
        shipWard: "Bến Nghé",
        shipDistrict: "Quận 1",
        shipCity: "Hồ Chí Minh",
        subtotal: 25_000_000,
        hasShipment: true,
        status: "PROCESSING",
        paymentStatus: "UNPAID",
        paymentMethod: "COD",
        notes: "Dữ liệu test local cho tích hợp nhà vận chuyển",
      },
    });

    let shipment = await prisma.shipment.findFirst({ where: { orderId: order.id, refNo } });
    if (!shipment) {
      shipment = await prisma.shipment.create({
        data: {
          orderId: order.id,
          refNo,
          orderRefNo: refNo,
          customerName: order.customerName,
          shipPhone: order.shipPhone,
          shipAddress: order.shipAddress,
          shipWard: order.shipWard,
          shipDistrict: order.shipDistrict,
          shipCity: order.shipCity,
          status: "READY",
          shippingFeePayer: "BUSINESS",
          notes: "Carrier integration fixture; safe to recreate locally",
          packages: {
            create: {
              weightGram: 700,
              lengthCm: 22,
              widthCm: 18,
              heightCm: 12,
              itemCount: 1,
              declaredValue: order.subtotal,
              contentDescription: "Đồng hồ test",
            },
          },
        },
      });
    }

    const quote = await quoteCarrierShipment(shipment.id, "MOCK");
    const integration = await createCarrierOrder(shipment.id, "MOCK");
    console.log(JSON.stringify({
      ok: true,
      orderId: order.id,
      shipmentId: shipment.id,
      externalOrderCode: integration.externalOrderCode,
      quote: { shippingFee: quote.shippingFee, insuranceFee: quote.insuranceFee },
      webhookUrl: "http://localhost:3000/api/webhooks/carriers/MOCK",
    }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
