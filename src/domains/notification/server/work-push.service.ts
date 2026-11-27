import {isPersonalWorkOwner} from "@/domains/personal-work/server/personal-work-access";
import { personalEventTiming } from "@/domains/personal-work/shared/personal-event";
import { sendNotification } from "web-push";
import { prisma, withDbTransaction, type DB } from "@/server/db/client";
import { benPushVapid, pushEndpoint } from "@/domains/ai-assistant/server/ben-push";
import { workRoute, reminderKey } from "./work-push-policy";

// Call with the same transaction as the business mutation. No network before commit.
export async function queueWorkNotification(db: DB, input: {
  key: string; userId: string; actorId?: string | null; taskItemId?: string; checklistItemId?:string;
  kind: "ASSIGNED" | "SHARED" | "CHANGED" | "CANCELLED" | "RESTORED" | "REMINDER";
  title: string; route: string;
}) {
  if (input.userId === input.actorId) return;
  const user = await db.user.findFirst({ where: { id: input.userId, isActive: true }, select: { id: true } });
  if (!user) return;
  const labels = { ASSIGNED: "Bạn được giao công việc", SHARED: "Công việc được chia sẻ với bạn", CHANGED: "Lịch công việc đã thay đổi", CANCELLED: "Công việc đã hủy", RESTORED:"Công việc được mở lại", REMINDER: "Nhắc lịch công việc" };
  await db.notification.upsert({
    where: { dedupeKey: input.key }, update: {},
    create: { dedupeKey: input.key, userId: input.userId, type: `WORK_${input.kind}`, title: labels[input.kind], message: input.title,
      metadata: { route: input.route, taskItemId: input.taskItemId ?? null,checklistItemId:input.checklistItemId??null } },
  });
  const subscriptions = await db.benPushSubscription.findMany({ where: { userId: input.userId } });
  await db.workPushDelivery.createMany({ data: subscriptions.map(s => ({ notificationKey: input.key, userId: input.userId,
    taskItemId: input.taskItemId, checklistItemId:input.checklistItemId, kind: input.kind, route: input.route, endpoint: s.endpoint, subscriptionVersion: s.updatedAt })), skipDuplicates: true });
}

export async function queuePersonalChange(db: DB, id: string, actorId: string, kind: "CHANGED" | "CANCELLED" | "RESTORED", reason?:string|null) {
  const item = await db.taskItem.findUnique({ where: { id }, include: { personalShares: true,task:true,checklists:{include:{personalShares:true}} } });
  if (!item) return;
  const full = new Set([item.personalOwnerUserId,item.task?.kind === "PERSONAL" ? item.task.createdByUserId : null,item.task?.kind === "PERSONAL" ? item.task.assignedToUserId : null, ...item.personalShares.map(s => s.userId)]);
  const actor=await db.user.findUnique({where:{id:actorId},select:{name:true,email:true}});
  const actorName=actor?.name||actor?.email||"Người phụ trách";
  const partial=new Map<string,{id:string;title:string}>();
  if(kind!=="CHANGED")for(const entry of item.checklists)for(const share of entry.personalShares)if(!full.has(share.userId)&&!partial.has(share.userId))partial.set(share.userId,entry);
  const recipients=[...new Set([...full,...partial.keys()])].filter((id):id is string=>Boolean(id)&&id!==actorId);
  const users=await db.user.findMany({where:{id:{in:recipients},isActive:true},select:{id:true}});
  const subscriptions=await db.benPushSubscription.findMany({where:{userId:{in:users.map(user=>user.id)}}});
  const records=users.map(({id:userId})=>{
    const entry=partial.get(userId),key=`work:${kind}:${id}:${item.updatedAt.toISOString()}:${userId}`,route=workRoute(id,true);
    const message=entry?`${entry.title} · ${actorName} ${kind==="CANCELLED"?"đã hủy công việc chứa đầu việc này":"đã mở lại công việc chứa đầu việc này"}`:kind==="CHANGED"?item.title:`${item.title} · ${actorName}${reason?": "+reason:""}`;
    return {userId,dedupeKey:key,type:`WORK_${kind}`,title:kind==="CANCELLED"?"Công việc đã hủy":kind==="RESTORED"?"Công việc được mở lại":"Lịch công việc đã thay đổi",message,metadata:{route,taskItemId:id,checklistItemId:entry?.id??null}};
  });
  for(let offset=0;offset<records.length;offset+=200)await db.notification.createMany({data:records.slice(offset,offset+200),skipDuplicates:true});
  const recordMap=new Map(records.map(row=>[row.userId,row]));
  const deliveries=subscriptions.map(subscription=>{
    const record=recordMap.get(subscription.userId)!;
    return {notificationKey:record.dedupeKey,userId:subscription.userId,taskItemId:id,checklistItemId:record.metadata.checklistItemId,kind,route:record.metadata.route,endpoint:subscription.endpoint,subscriptionVersion:subscription.updatedAt};
  });
  for(let offset=0;offset<deliveries.length;offset+=200)await db.workPushDelivery.createMany({data:deliveries.slice(offset,offset+200),skipDuplicates:true});
}

export async function runWorkPush(now = new Date(), send: typeof sendNotification = sendNotification) {
  // Catch up after short outages, without flooding users with old reminders.
  const items = await prisma.taskItem.findMany({ where: { personalOwnerUserId: { not: null }, mergedIntoTaskItemId:null, status: { notIn: ["DONE", "CANCELLED"] },
    reminderMinutes: {not:null}, dueAt: { gte: new Date(now.getTime() - 15 * 60000), lte: new Date(now.getTime()+60*60000) } }, include: { personalShares: true }, orderBy: [{dueAt:"asc"},{id:"asc"}], take: 500 });
  for (const item of items) {
    if (!personalEventTiming(item).timed || !item.dueAt || item.reminderMinutes===null || item.dueAt.getTime()-item.reminderMinutes*60000 > now.getTime() || item.dueAt.getTime()-item.reminderMinutes*60000 < now.getTime()-15*60000) continue;
    const recipients = new Set([item.personalOwnerUserId, ...item.personalShares.map(s => s.userId)]);
    for (const userId of recipients) if (userId && item.dueAt) await withDbTransaction(prisma, async tx => {
      // Recheck under row lock: cancellation/rescheduling must win before enqueue.
      await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${item.id} FOR UPDATE`;
      const current = await tx.taskItem.findUnique({where:{id:item.id},include:{personalShares:true}});
      if (!current || current.mergedIntoTaskItemId || ["DONE","CANCELLED"].includes(current.status) || current.dueAt?.getTime() !== item.dueAt?.getTime() || current.reminderMinutes !== item.reminderMinutes) return;
      if (current.personalOwnerUserId !== userId && !current.personalShares.some(s=>s.userId===userId)) return;
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
      const entryShared = row.checklistItemId && item ? await prisma.personalChecklistShare.findFirst({where:{checklistItemId:row.checklistItemId,userId:row.userId,checklist:{taskItemId:item.id}},select:{id:true}}) : null;
      const personal = item && (Boolean(item.personalOwnerUserId) || item.task?.kind === "PERSONAL");
      const fullRead = item && (personal ? isPersonalWorkOwner(item,row.userId) || item.personalShares.some(s=>s.userId===row.userId) :
        item.assignedToUserId===row.userId || item.userId===row.userId || item.task?.assignedToUserId===row.userId ||
        String(item.note??"").split(/\r?\n/).some(line=>line.startsWith("sharedUserIds:")&&line.slice(14).split(",").map(v=>v.trim()).includes(row.userId)));
      const canRead = Boolean(entryShared) || Boolean(fullRead);
      const notification = await prisma.notification.findUnique({where:{dedupeKey:row.notificationKey}});
      const staleAssignment=item?.status==="CANCELLED"&&["ASSIGNED","SHARED","CHANGED"].includes(row.kind);
      const staleReminder = row.kind === "REMINDER" && (!item?.dueAt || item.reminderMinutes===null || ["DONE","CANCELLED"].includes(item.status) || reminderKey(item.id,row.userId,item.dueAt,item.reminderMinutes??0) !== row.notificationKey || item.dueAt.getTime()-(item.reminderMinutes??0)*60000 < Date.now()-15*60000);
      if (subscription && notification && (!row.taskItemId || canRead) && !staleReminder && !staleAssignment && pushEndpoint.safeParse(subscription.endpoint).success) {
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
