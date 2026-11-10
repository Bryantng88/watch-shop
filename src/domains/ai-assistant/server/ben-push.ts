import { z } from "zod";
import webpush from "web-push";
import { prisma } from "@/server/db/client";
import { AssistantError } from "./access";

const supportedHosts = /^(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|(?:[a-z0-9-]+\.)?push\.apple\.com)$/;

export const pushEndpoint = z.string().max(1024).url().refine(value => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.port && !url.username && !url.password &&
    !url.hash && supportedHosts.test(url.hostname);
});
export const pushSubscription = z.object({
  endpoint: pushEndpoint,
  keys: z.object({ p256dh: z.string().regex(/^[\w-]{87}$/), auth: z.string().regex(/^[\w-]{22}$/) }).strict(),
}).strict();

function vapidDetails() {
  const { BEN_PUSH_PUBLIC_KEY: publicKey, BEN_PUSH_PRIVATE_KEY: privateKey, BEN_PUSH_SUBJECT: subject } = process.env;
  return publicKey && privateKey && subject ? { publicKey, privateKey, subject } : null;
}

export function benPushPublicKey() {
  return vapidDetails()?.publicKey ?? null;
}

export async function saveBenPush(userId: string, subscription: z.infer<typeof pushSubscription>) {
  if (!vapidDetails()) throw new AssistantError("Thông báo Ben chưa được cấu hình.", 503);
  const { endpoint, keys } = subscription;
  await prisma.benPushSubscription.upsert({
    where: { endpoint },
    create: { endpoint, userId, ...keys },
    update: { userId, ...keys },
  });
}

export async function hasBenPush(userId: string, endpoint: string) {
  return Boolean(await prisma.benPushSubscription.findFirst({where:{userId,endpoint},select:{endpoint:true}}));
}

export async function removeBenPush(userId: string, endpoint: string) {
  await prisma.benPushSubscription.deleteMany({ where: { userId, endpoint } });
}

export async function notifyBenAssignment(userId: string) {
  const vapid = vapidDetails();
  if (!vapid) return;
  try {
    const subscriptions = await prisma.benPushSubscription.findMany({
      where: { userId, user: { isActive: true } },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });
    await Promise.allSettled(subscriptions.map(async row => {
      if (!pushEndpoint.safeParse(row.endpoint).success) return;
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
          JSON.stringify({ type: "assignment" }),
          { vapidDetails: vapid, TTL: 3600, timeout: 5000 },
        );
      } catch (error) {
        const status = (error as {statusCode?:number})?.statusCode;
        if (status === 404 || status === 410) {
          await prisma.benPushSubscription.deleteMany({ where: { endpoint: row.endpoint, userId, updatedAt: row.updatedAt } });
        }
      }
    }));
  } catch {
    console.warn("[ben-push] Could not load assignment subscriptions");
  }
}
