import type { DB } from "@/server/db/client";
import { codexExecutionReadiness } from "@/domains/personal-work/server/codex/codex-config";

export class SalesIntakeError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function salesIntakeReady() {
  return process.env.SALES_CODEX_ENABLED === "1" && codexExecutionReadiness().ready;
}
export async function intakeActor(db: DB, id: string) {
  if (!salesIntakeReady()) throw new SalesIntakeError("Chức năng tiếp nhận Sale chưa bật trên staging.", 503);
  const user = await db.user.findFirst({ where: { id, isActive: true }, select: { id: true, name: true, roles: { select: { name: true, permissions: { select: { code: true } } } } } });
  const permissions = new Set(user?.roles.flatMap(role => role.permissions.map(permission => permission.code)));
  if (!user || (!user.roles.some(role => role.name === "ADMIN") && !["TASK_VIEW", "TASK_MANAGE", "PRODUCT_VIEW", "CUSTOMER_VIEW"].every(permission => permissions.has(permission)))) throw new SalesIntakeError("Cần quyền quản lý công việc, xem sản phẩm và khách hàng.", 403);
  return user;
}
export async function validRecipient(db: DB, id: string) {
  return db.user.findFirst({ where: { id, isActive: true, roles: { some: { OR: [{ name: "ADMIN" }, { permissions: { some: { code: "TASK_VIEW" } } }] } } }, select: { id: true, name: true } });
}
