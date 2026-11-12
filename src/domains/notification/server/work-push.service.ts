import { personalEventTiming } from "@/domains/personal-work/shared/personal-event";
import { sendNotification } from "web-push";
import { prisma, withDbTransaction, type DB } from "@/server/db/client";
import { benPushVapid, pushEndpoint } from "@/domains/ai-assistant/server/ben-push";
import { workRoute, reminderKey } from "./work-push-policy";

// Call with the same transaction as the business mutation. No network before commit.
export async function queueWorkNotification(db: DB, input: {
  key: string; userId: string; actorId?: string | null; taskItemId?: string;
  kind: "ASSIGNED" | "SHARED" | "CHANGED" | "CANCELLED" | "REMINDER";
  title: string; route: string;
}) {
  if (input.userId === input.actorId) return;
  const user = await db.user.findFirst({ where: { id: input.userId, isActive: true }, select: { id: true } });
  if (!user) return;
  const labels = { ASSIGNED: "Bạn được giao công việc", SHARED: "Công việc được chia sẻ với bạn", CHANGED: "Lịch công việc đã thay đổi", CANCELLED: "Công việc đã hủy", REMINDER: "Nhắc lịch công việc" };
  await db.notification.upsert({
    where: { dedupeKey: input.key }, update: {},
    create: { dedupeKey: input.key, userId: input.userId, type: `WORK_${input.kind}`, title: labels[input.kind], message: input.title,
      metadata: { route: input.route, taskItemId: input.taskItemId ?? null } },
  });
  const subscriptions = await db.benPushSubscription.findMany({ where: { userId: input.userId } });
  await db.workPushDelivery.createMany({ data: subscriptions.map(s => ({ notificationKey: input.key, userId: input.userId,
    taskItemId: input.taskItemId, kind: input.kind, route: input.route, endpoint: s.endpoint, subscriptionVersion: s.updatedAt })), skipDuplicates: true });
}

export async function queuePersonalChange(db: DB, id: string, actorId: string, kind: "CHANGED" | "CANCELLED") {
  const item = await db.taskItem.findUnique({ where: { id }, include: { personalShares: true } });
  if (!item) return;
  const recipients = new Set([item.personalOwnerUserId, item.assignedToUserId, ...item.personalShares.map(s => s.userId)]);
  for (const userId of recipients) if (userId) await queueWorkNotification(db, { key: `work:${kind}:${id}:${item.updatedAt.toISOString()}:${userId}`,
    userId, actorId, taskItemId: id, kind, title: item.title, route: workRoute(id, true) });
}

export async function runWorkPush(now = new Date(), send: typeof sendNotification = sendNotification) {
  // Catch up after short outages, without flooding users with old reminders.
  const items = await prisma.taskItem.findMany({ where: { personalOwnerUserId: { not: null }, status: { notIn: ["DONE", "CANCELLED"] },
    reminderMinutes: {not:null}, dueAt: { gte: new Date(now.getTime() - 15 * 60000), lte: new Date(now.getTime()+60*60000) } }, include: { personalShares: true }, orderBy: [{dueAt:"asc"},{id:"asc"}], take: 500 });
  for (const item of items) {
    if (!personalEventTiming(item).timed || !item.dueAt || item.reminderMinutes===null || item.dueAt.getTime()-item.reminderMinutes*60000 > now.getTime() || item.dueAt.getTime()-item.reminderMinutes*60000 < now.getTime()-15*60000) continue;
    const recipients = new Set([item.personalOwnerUserId, item.assignedToUserId, ...item.personalShares.map(s => s.userId)]);
    for (const userId of recipients) if (userId && item.dueAt) await withDbTransaction(prisma, async tx => {
      // Recheck under row lock: cancellation/rescheduling must win before enqueue.
      await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${item.id} FOR UPDATE`;
      const current = await tx.taskItem.findUnique({where:{id:item.id},include:{personalShares:true}});
      if (!current || ["DONE","CANCELLED"].includes(current.status) || current.dueAt?.getTime() !== item.dueAt?.getTime() || current.reminderMinutes !== item.reminderMinutes) return;
      if (current.personalOwnerUserId !== userId && current.assignedToUserId !== userId && !current.personalShares.some(s=>s.userId===userId)) return;
      await queueWorkNotification(tx, { key: reminderKey(item.id, userId, item.dueAt!, item.reminderMinutes ?? 0), userId, taskItemId: item.id, kind: "REMINDER", title: current.title, route: workRoute(item.id, true) });
    });
  }
  const vapid = benPushVapid();
  if (!vapid) return { reminders: items.length, configured: false };
  const rows = await prisma.workPushDelivery.findMany({ where: { deliveredAt: null, attempts: { lt: 5 }, availableAt: { lte: now },
    OR: [{ leaseUntil: null }, { leaseUntil: { lt: now } }] }, orderBy: { createdAt: "asc" }, take: 100 });
  let sent = 0;
  for (const row of rows) {
    const leaseUntil = new Date(Date.now() + 60000);
    const claim = await prisma.workPushDelivery.updateMany({ where: { id: row.id, deliveredAt: null, attempts: row.attempts,
      OR: [{ leaseUntil: null }, { leaseUntil: { lt: now } }] }, data: { leaseUntil, attempts: { increment: 1 } } });
    if (!claim.count) continue;
    try {
      const subscription = await prisma.benPushSubscription.findFirst({ where: { endpoint: row.endpoint, userId: row.userId, updatedAt: row.subscriptionVersion, user: { isActive: true } } });
      const item = row.taskItemId ? await prisma.taskItem.findUnique({where:{id:row.taskItemId},include:{personalShares:true,task:true}}) : null;
      const canRead = item && (item.personalOwnerUserId === row.userId || item.assignedToUserId === row.userId || item.userId === row.userId || item.personalShares.some(s => s.userId === row.userId) || String(item.note ?? "").split(/\r?\n/).some(line=>line.startsWith("sharedUserIds:") && line.slice(14).split(",").map(v=>v.trim()).includes(row.userId)) || item.task?.assignedToUserId === row.userId);
      const notification = await prisma.notification.findUnique({where:{dedupeKey:row.notificationKey}});
      const staleReminder = row.kind === "REMINDER" && (!item?.dueAt || item.reminderMinutes===null || ["DONE","CANCELLED"].includes(item.status) || reminderKey(item.id,row.userId,item.dueAt,item.reminderMinutes??0) !== row.notificationKey || item.dueAt.getTime()-(item.reminderMinutes??0)*60000 < Date.now()-15*60000);
      if (subscription && notification && (!row.taskItemId || canRead) && !staleReminder && pushEndpoint.safeParse(subscription.endpoint).success) {
        await send({endpoint:subscription.endpoint,keys:{p256dh:subscription.p256dh,auth:subscription.auth}},
          JSON.stringify({type:"work",kind:row.kind,route:row.route,tag:row.notificationKey}), {vapidDetails:vapid,TTL:900,timeout:5000});
        sent++;
      }
      await prisma.workPushDelivery.updateMany({where:{id:row.id,leaseUntil},data:{deliveredAt:new Date(),leaseUntil:null}});
    } catch (error) {
      const status = (error as {statusCode?:number})?.statusCode;
      if (status === 404 || status === 410) {
        await prisma.benPushSubscription.deleteMany({where:{endpoint:row.endpoint,userId:row.userId,updatedAt:row.subscriptionVersion}});
        await prisma.workPushDelivery.updateMany({where:{id:row.id,leaseUntil},data:{deliveredAt:new Date(),leaseUntil:null}});
      } else await prisma.workPushDelivery.updateMany({where:{id:row.id,leaseUntil},data:{leaseUntil:null,availableAt:new Date(Date.now()+Math.min(900,30*2**row.attempts)*1000)}});
    }
  }
  await prisma.workPushDelivery.deleteMany({where:{createdAt:{lt:new Date(now.getTime()-30*86400000)}}});
  return { reminders: items.length, sent, configured: true };
}
