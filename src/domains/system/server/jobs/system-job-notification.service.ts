import { prisma } from "@/server/db/client";

type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export async function pushSystemJobNotification(input: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    priority?: NotificationPriority;
    metadata?: Record<string, unknown>;
}) {
    try {
        await prisma.notification.create({
            data: {
                userId: input.userId,
                type: input.type ?? "SYSTEM_JOB",
                title: input.title,
                message: input.message,
                priority: input.priority ?? "NORMAL",
                //metadata: input.metadata ?? {},
            },
        });
    } catch (e) {
        console.error("pushSystemJobNotification error:", e);
        // không block flow chính
    }
}