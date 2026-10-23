import "dotenv/config";

import { PurchaseRequestStatus } from "@prisma/client";
import { prisma } from "../src/server/db/client";

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
const parsed = databaseUrl ? new URL(databaseUrl) : null;

if (!parsed || !["127.0.0.1", "localhost", "::1"].includes(parsed.hostname)) {
  throw new Error("Operations dashboard seed chỉ được chạy trên database loopback local.");
}
if (!/(test|local|storefront)/i.test(parsed.pathname)) {
  throw new Error("Tên database local phải chứa test, local hoặc storefront.");
}

const fixtures = [
  {
    reference: "LOCAL-PR-WAITING-001",
    requestKey: "local-dashboard-purchase-request-waiting-001",
    status: PurchaseRequestStatus.WAITING,
    customerName: "Khách demo chờ xử lý",
    phone: "0900000001",
    normalizedPhone: "0900000001",
    followUpOffsetDays: null,
  },
  {
    reference: "LOCAL-PR-PROCESSING-002",
    requestKey: "local-dashboard-purchase-request-processing-002",
    status: PurchaseRequestStatus.PROCESSING,
    customerName: "Khách demo đang tư vấn",
    phone: "0900000002",
    normalizedPhone: "0900000002",
    followUpOffsetDays: -2,
  },
  {
    reference: "LOCAL-PR-COMPLETED-003",
    requestKey: "local-dashboard-purchase-request-completed-003",
    status: PurchaseRequestStatus.COMPLETED,
    customerName: "Khách demo đã hoàn tất",
    phone: "0900000003",
    normalizedPhone: "0900000003",
    followUpOffsetDays: null,
  },
] as const;

async function main() {
  for (const fixture of fixtures) {
    const followUpAt = fixture.followUpOffsetDays === null
      ? null
      : new Date(Date.now() + fixture.followUpOffsetDays * 86_400_000);
    await prisma.purchaseRequest.upsert({
      where: { requestKey: fixture.requestKey },
      update: {
        status: fixture.status,
        customerName: fixture.customerName,
        phone: fixture.phone,
        normalizedPhone: fixture.normalizedPhone,
        followUpAt,
      },
      create: {
        reference: fixture.reference,
        requestKey: fixture.requestKey,
        status: fixture.status,
        customerName: fixture.customerName,
        phone: fixture.phone,
        normalizedPhone: fixture.normalizedPhone,
        followUpAt,
        channel: "LOCAL_DASHBOARD_SEED",
        requestHash: fixture.requestKey,
        fingerprintHash: fixture.requestKey,
        contactPreference: "PHONE",
      },
    });
  }

  console.log(JSON.stringify({ ok: true, database: parsed.pathname.slice(1), purchaseRequests: fixtures.length }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
