import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "@/server/db/client";
import { ensureOperationSpace } from "@/domains/coordination/server/operation-space.service";
import { createAuthToken } from "@/server/auth/auth-token";

async function main() {
  const database = new URL(process.env.DATABASE_URL!);
  const base = process.env.APP_URL!;
  if (!["127.0.0.1", "localhost"].includes(database.hostname) || database.pathname !== "/personal_codex_test" || new URL(base).hostname !== "127.0.0.1") throw Error("ISOLATED_LOOPBACK_TEST_REQUIRED");
  await ensureOperationSpace(prisma, { context: "OPERATION", provisionWorkTickets: false });
  const suffix = randomUUID();
  await prisma.permission.upsert({ where: { code: "TASK_VIEW" }, create: { code: "TASK_VIEW" }, update: {} });
  const admin = await prisma.role.upsert({ where: { name: "ADMIN" }, create: { name: "ADMIN", permissions: { connect: { code: "TASK_VIEW" } } }, update: { permissions: { connect: { code: "TASK_VIEW" } } } });
  const owner = await prisma.user.create({ data: { email: suffix + "@example.invalid", roles: { connect: { id: admin.id } } } });
  const other = await prisma.user.create({ data: { email: suffix + "-other@example.invalid", roles: { connect: { id: admin.id } } } });
  const staff = await prisma.user.create({ data: { email: suffix + "-staff@example.invalid" } });
  const customer = await prisma.customer.create({ data: { name: "HTTP fixture " + suffix } });
  const product = await prisma.product.create({ data: { title: "HTTP watch " + suffix, sku: "HTTP-" + suffix, type: "WATCH", watch: { create: { saleStage: "READY" } } } });
  const cookie = (id: string) => "auth_token=" + createAuthToken(id);
  async function publicApi(method: string, body?: unknown, userId = owner.id, origin = base) {
    const r = await fetch(base + "/api/admin/sales-intake", { method, headers: { cookie: cookie(userId), origin, "content-type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
    return { status: r.status, body: await r.json() };
  }
  const worker = async (operation: string, body: unknown, authorized = true) => {
    const r = await fetch(base + "/api/internal/sales-codex/" + operation, { method: "POST", headers: { "content-type": "application/json", ...(authorized ? { authorization: "Bearer " + process.env.PERSONAL_CODEX_WORKER_TOKEN } : {}) }, body: JSON.stringify(body) });
    return { status: r.status, body: await r.json() };
  };
  assert.equal((await fetch(base + "/api/admin/sales-intake")).status, 401);
  assert.equal((await publicApi("GET", undefined, staff.id)).status, 403);
  assert.equal((await worker("claim", { workerId: "fixture-http" }, false)).status, 401);
  const input = { requestKey: randomUUID(), text: "Khách fixture hỏi mua watch, cần xác minh mắt dây", routing: { SALES: owner.id, TECHNICAL: other.id, OPERATION: other.id } };
  assert.equal((await publicApi("POST", input, owner.id, "https://wrong-origin.invalid")).status, 403);
  assert.equal((await publicApi("POST", { ...input, sql: "forbidden" })).status, 400);
  const request = await publicApi("POST", input); assert.equal(request.status, 200);
  const claimed = await worker("claim", { workerId: "fixture-http" }); assert.equal(claimed.status, 200); assert.equal(claimed.body.run.id, request.body.id);
  const run = claimed.body.run;
  assert.equal((await worker("heartbeat", { id: run.id, leaseToken: randomUUID() })).status, 409);
  assert.equal((await worker("lookup", { ...run, lookup: { tool: "sql", query: "SELECT *" } })).status, 400);
  for (const lookup of [{ tool: "customers.search", query: customer.id }, { tool: "watches.search", query: product.sku }, { tool: "watches.detail", productId: product.id }, { tool: "work.open", customerId: customer.id, productId: product.id }, { tool: "accessories.search", query: "fixture unknown accessory" }]) assert.equal((await worker("lookup", { id: run.id, leaseToken: run.leaseToken, lookup })).status, 200);
  const plan = { summary: "Xác minh phụ kiện rồi Sale theo dõi", questions: [], leads: [{ key: "a", customerId: customer.id, productId: product.id, followups: [{ kind: "VERIFY_ACCESSORY", description: "Xác minh tương thích, chưa cam kết có hàng." }, { kind: "SALES_FOLLOWUP", description: "Theo dõi kết quả trước khi phản hồi khách." }] }] };
  assert.equal((await worker("finish", { id: run.id, leaseToken: run.leaseToken, plan })).status, 200);
  const list = await publicApi("GET"); assert.equal(list.status, 200);
  const row = list.body.requests.find((r: { id: string }) => r.id === run.id);
  assert.equal(row.status, "APPLIED"); assert.equal(row.resultJson.tasks.length, 2); assert.equal("lookupsJson" in row, false); assert.equal("leaseToken" in row, false);
  const taskIds = row.resultJson.tasks.map((task: { id: string }) => task.id);
  assert.equal(await prisma.notification.count({ where: { type: { in: taskIds.map((id: string) => "SALES_CODEX_" + id) } } }), 2);
  assert.equal((await publicApi("GET", undefined, other.id)).body.requests.length, 0);
  assert.equal((await publicApi("POST", input)).body.id, run.id);
  assert.equal((await worker("finish", { id: run.id, leaseToken: run.leaseToken, plan })).status, 200);
  assert.equal(await prisma.notification.count({ where: { type: { in: taskIds.map((id: string) => "SALES_CODEX_" + id) } } }), 2);
  const page = await fetch(base + "/admin/coordination/sales", { headers: { cookie: cookie(owner.id) }, redirect: "manual" }); assert.equal(page.status, 200); assert.ok((await page.text()).includes("Tiếp nhận tư vấn bằng AI"));
  const operation = await fetch(base + "/admin/coordination/operation?view=ad-hoc-work", { headers: { cookie: cookie(owner.id) }, redirect: "manual" });
  assert.equal(operation.status, 200); const operationHtml = await operation.text();
  assert.ok(taskIds.every((id: string) => operationHtml.includes(id)), "Created followups must appear in the existing Operation ad-hoc queue");
  const cancelRequest = await publicApi("POST", { ...input, requestKey: randomUUID(), text: "Một yêu cầu fixture cần hủy trước khi chạy" }); assert.equal(cancelRequest.status, 200);
  assert.equal((await publicApi("DELETE", { id: cancelRequest.body.id }, other.id)).status, 403);
  assert.equal((await publicApi("DELETE", { id: cancelRequest.body.id }, owner.id, "https://wrong-origin.invalid")).status, 403);
  assert.equal((await publicApi("DELETE", { id: cancelRequest.body.id })).body.cancelled, true);
  assert.equal((await worker("claim", { workerId: "fixture-http-after-cancel" })).body.run, null);
  await prisma.taskItem.updateMany({ where: { id: { in: taskIds } }, data: { status: "CANCELLED" } });
  await prisma.user.updateMany({ where: { id: { in: [owner.id, other.id, staff.id] } }, data: { isActive: false } });
  console.log("PASS synthetic HTTP: auth/permissions/origin, worker authentication/fencing/tool allowlist, automatic internal tasks and notifications, requester privacy, replay idempotency and rendered Sales form. Model plan was scripted, not real CLI output.");
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
