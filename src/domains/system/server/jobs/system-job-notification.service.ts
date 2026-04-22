import { prisma } from "@/server/db/client";

export async function pushSystemJobNotification(input: {
    title: string;
    message: string;
    level?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
    actionUrl?: string | null;
}) {
    try {
        await prisma.notification.create({
            data: {
                title: input.title,
                message: input.message,
                level: input.level ?? "INFO",
                actionUrl: input.actionUrl ?? "/admin/system/jobs",
            },
        });
    } catch {
        // không chặn flow chính nếu notification fail
    }
}