import * as z from 'zod';

// prettier-ignore
export const ProjectionEventDeliveryInputSchema = z.object({
    id: z.string(),
    idempotencyKey: z.string(),
    businessEventLogId: z.string().optional().nullable(),
    eventKey: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    actorUserId: z.string().optional().nullable(),
    effect: z.string(),
    revokeEventKey: z.string().optional().nullable(),
    targetAliasIds: z.unknown().optional().nullable(),
    eventInstanceId: z.string().optional().nullable(),
    payloadJson: z.unknown().optional().nullable(),
    status: z.string(),
    attempts: z.number().int(),
    nextAttemptAt: z.date(),
    lockedAt: z.date().optional().nullable(),
    completedAt: z.date().optional().nullable(),
    lastError: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    businessEventLog: z.unknown().optional().nullable()
}).strict();

export type ProjectionEventDeliveryInputType = z.infer<typeof ProjectionEventDeliveryInputSchema>;
