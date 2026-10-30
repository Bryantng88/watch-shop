import { PrismaClient, TaskPriority } from "@prisma/client";
import { prisma as domainPrisma } from "../src/server/db/client";
import { personalWorkViewAccessWhere } from "../src/domains/personal-work/server/personal-work-access";
import { createPersonalWorkItem } from "../src/domains/personal-work/server/personal-work.service";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Local seed cannot run in production");
  const databaseUrl = String(process.env.DATABASE_URL || "");
  if (!/127\.0\.0\.1|localhost/i.test(databaseUrl)) throw new Error("Refusing to seed a non-local database");
  const user = await prisma.user.findFirst({
    where: { email: "admin@system.local" },
    select: { id: true, email: true, name: true },
  });
  if (!user) throw new Error("Run npm run local:seed-admin first");
  const existing = await prisma.taskItem.count({ where: personalWorkViewAccessWhere(user.id) });
  if (existing) {
    console.log(`Personal work seed skipped: ${existing} item(s) already exist.`);
    return;
  }
  const auth = { ...user, userId: user.id, roles: ["ADMIN"], permissions: ["TASK_VIEW"] };
  const now = Date.now();
  const rows = [
    ["Kiểm tra tiến độ xử lý ảnh lô Seiko", "MEDIA", -60, TaskPriority.HIGH, ["Lô tháng 10"]],
    ["Xác nhận tình trạng máy với kỹ thuật", "TECHNICAL", 120, TaskPriority.HIGH, ["Follow-up"]],
    ["Gọi lại khách đang quan tâm Rolex", "SALES", 240, TaskPriority.MEDIUM, ["Khách hàng"]],
    ["Đối soát đơn đang chờ giao", "ORDER", 24 * 60, TaskPriority.MEDIUM, ["Đối soát"]],
    ["Rà giá nhập lô đồng hồ mới", "ACQUISITION", 2 * 24 * 60, TaskPriority.LOW, ["Vendor"]],
  ] as const;
  for (const [title, domain, minutes, priority, tags] of rows) {
    await createPersonalWorkItem({ title, domain, priority, tags: [...tags], dueAt: new Date(now + minutes * 60_000).toISOString() }, auth);
  }
  console.log(`Seeded ${rows.length} personal work items for ${user.email}.`);
}

main().finally(async () => {
  await Promise.all([prisma.$disconnect(), domainPrisma.$disconnect()]);
});
