import "dotenv/config";

import {
  OrderItemKind,
  OrderSource,
  OrderStatus,
  OrderVerificationStatus,
  PaymentMethod,
  PaymentStatus,
  ProductType,
  ReserveType,
} from "@prisma/client";

import { rebuildOrderDetailProjectionRows } from "../src/domains/projection/server/order-detail.projection";
import { prisma } from "../src/server/db/client";

const databaseUrl = String(process.env.DATABASE_URL ?? "");
if (!/127\.0\.0\.1|localhost/i.test(databaseUrl) || !/test|local/i.test(databaseUrl)) {
  throw new Error("Refusing to seed demo orders outside a loopback local/test database");
}

const fixtures = [
  {
    refNo: "LOCAL-ORDER-DRAFT-001",
    status: OrderStatus.DRAFT,
    source: OrderSource.WEB,
    verificationStatus: OrderVerificationStatus.PENDING,
    paymentStatus: PaymentStatus.UNPAID,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    customerName: "Nguyễn Minh Anh",
    phone: "0901 234 567",
    address: "12 Nguyễn Huệ",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    depositRequired: 10_000_000,
    depositPaid: 0,
    reserveType: ReserveType.NONE,
    notes: "Khách cần tư vấn thêm tình trạng máy và lịch sử service trước khi chốt.",
  },
  {
    refNo: "LOCAL-ORDER-RESERVED-002",
    status: OrderStatus.RESERVED,
    source: OrderSource.ADMIN,
    verificationStatus: OrderVerificationStatus.VERIFIED,
    paymentStatus: PaymentStatus.UNPAID,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    customerName: "Trần Quốc Bảo",
    phone: "0938 456 789",
    address: "88 Võ Văn Tần",
    district: "Quận 3",
    city: "TP. Hồ Chí Minh",
    depositRequired: 15_000_000,
    depositPaid: 10_000_000,
    reserveType: ReserveType.DEPOSIT,
    notes: "Đã nhận cọc. Giữ hàng đến cuối ngày và chuẩn bị hộp quà.",
  },
  {
    refNo: "LOCAL-ORDER-PROCESSING-003",
    status: OrderStatus.PROCESSING,
    source: OrderSource.ADMIN,
    verificationStatus: OrderVerificationStatus.VERIFIED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.CASH,
    customerName: "Lê Hoàng Nam",
    phone: "0987 111 222",
    address: "25 Trần Phú",
    district: "Hải Châu",
    city: "Đà Nẵng",
    depositRequired: 0,
    depositPaid: 67_000_000,
    reserveType: ReserveType.NONE,
    notes: "Đã thanh toán đủ. Kiểm tra ngoại quan lần cuối trước khi đóng gói.",
  },
  {
    refNo: "LOCAL-ORDER-COMPLETED-004",
    status: OrderStatus.COMPLETED,
    source: OrderSource.WEB,
    verificationStatus: OrderVerificationStatus.VERIFIED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.COD,
    customerName: "Phạm Thu Hà",
    phone: "0912 333 444",
    address: "103 Cầu Giấy",
    district: "Cầu Giấy",
    city: "Hà Nội",
    depositRequired: 0,
    depositPaid: 55_000_000,
    reserveType: ReserveType.NONE,
    notes: "Đơn đã giao thành công. Khách xác nhận nhận hàng nguyên vẹn.",
  },
] as const;

async function main() {
  const products = await prisma.product.findMany({
    where: { type: ProductType.WATCH },
    orderBy: { updatedAt: "desc" },
    take: 4,
    select: {
      id: true,
      title: true,
      primaryImageUrl: true,
      productImage: {
        where: { fileKey: { not: "" } },
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        take: 1,
        select: { fileKey: true },
      },
      watch: { select: { watchPrice: { select: { salePrice: true } } } },
    },
  });

  const fallbackProducts = [
    { title: "Omega Seamaster Automatic", price: 55_000_000 },
    { title: "Cartier Santos Quartz", price: 32_000_000 },
    { title: "Longines Flagship Vintage", price: 27_500_000 },
  ];
  const ids: string[] = [];

  for (const [fixtureIndex, fixture] of fixtures.entries()) {
    const itemCount = fixtureIndex === 1 ? 2 : 1;
    const items = Array.from({ length: itemCount }, (_, itemIndex) => {
      const product = products[(fixtureIndex + itemIndex) % Math.max(products.length, 1)];
      const fallback = fallbackProducts[(fixtureIndex + itemIndex) % fallbackProducts.length];
      const price = Number(product?.watch?.watchPrice?.salePrice ?? fallback.price);
      return {
        productId: product?.id ?? null,
        title: product?.title ?? fallback.title,
        img: product?.productImage[0]?.fileKey ?? product?.primaryImageUrl ?? null,
        kind: OrderItemKind.PRODUCT,
        productType: ProductType.WATCH,
        listPrice: price,
        unitPriceAgreed: price,
        quantity: 1,
        subtotal: price,
        customerItemNote: itemIndex ? "Kiểm tra dây và khóa trước khi giao." : null,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const order = await prisma.order.upsert({
      where: { refNo: fixture.refNo },
      create: {
        refNo: fixture.refNo,
        status: fixture.status,
        source: fixture.source,
        verificationStatus: fixture.verificationStatus,
        paymentStatus: fixture.paymentStatus,
        paymentMethod: fixture.paymentMethod,
        customerName: fixture.customerName,
        shipPhone: fixture.phone,
        shipAddress: fixture.address,
        shipDistrict: fixture.district,
        shipCity: fixture.city,
        hasShipment: true,
        subtotal,
        depositRequired: fixture.depositRequired,
        depositPaid: Math.min(fixture.depositPaid, subtotal),
        reserveType: fixture.reserveType,
        reserveUntil: fixture.status === OrderStatus.RESERVED ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
        notes: fixture.notes,
        orderItem: { create: items },
      },
      update: {
        status: fixture.status,
        source: fixture.source,
        verificationStatus: fixture.verificationStatus,
        paymentStatus: fixture.paymentStatus,
        paymentMethod: fixture.paymentMethod,
        customerName: fixture.customerName,
        shipPhone: fixture.phone,
        shipAddress: fixture.address,
        shipDistrict: fixture.district,
        shipCity: fixture.city,
        hasShipment: true,
        subtotal,
        depositRequired: fixture.depositRequired,
        depositPaid: Math.min(fixture.depositPaid, subtotal),
        reserveType: fixture.reserveType,
        reserveUntil: fixture.status === OrderStatus.RESERVED ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
        notes: fixture.notes,
        orderItem: { deleteMany: {}, create: items },
      },
      select: { id: true },
    });
    ids.push(order.id);
  }

  await rebuildOrderDetailProjectionRows(prisma, ids);
  console.log(JSON.stringify(fixtures.map((fixture, index) => ({
    refNo: fixture.refNo,
    status: fixture.status,
    url: `/admin/orders/${ids[index]}`,
  })), null, 2));
}

main().finally(() => prisma.$disconnect());
