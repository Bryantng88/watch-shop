import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";

function toSafeJson(value: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    if (value === null) {
        return Prisma.JsonNull;
    }

    try {
        return JSON.parse(
            JSON.stringify(value, (_key, val) => {
                if (val instanceof Error) {
                    return {
                        name: val.name,
                        message: val.message,
                        stack: val.stack,
                    };
                }
                if (typeof val === "undefined") {
                    return null;
                }
                return val;
            })
        ) as Prisma.InputJsonValue;
    } catch {
        return {
            message: "Unable to serialize log detail",
        } as Prisma.InputJsonValue;
    }
}

export async function createSystemJobRunLog(input: {
    processorKey: string;
    triggerSource: string;
    status: string;
    processedCount?: number;
    errorCount?: number;
    note?: string | null;
    detail?: unknown;
    startedAt?: Date;
    finishedAt?: Date | null;
}) {
    try {
        return await prisma.systemJobRunLog.create({
            data: {
                processorKey: input.processorKey,
                triggerSource: input.triggerSource,
                status: input.status,
                processedCount: input.processedCount ?? 0,
                errorCount: input.errorCount ?? 0,
                note: input.note ?? null,
                detail:
                    input.detail === undefined ? undefined : toSafeJson(input.detail),
                startedAt: input.startedAt ?? new Date(),
                finishedAt: input.finishedAt ?? null,
            },
        });
    } catch (error) {
        console.error("createSystemJobRunLog failed:", error);
        return null;
    }
}

export async function getRecentJobRunLogs(limit = 20) {
    try {
        return await prisma.systemJobRunLog.findMany({
            orderBy: { startedAt: "desc" },
            take: Math.max(1, Math.min(limit, 100)),
        });
    } catch (error) {
        console.error("getRecentJobRunLogs failed:", error);
        return [];
    }
}