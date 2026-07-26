import * as z from 'zod';

// prettier-ignore
export const ProjectionEventDeliveryModelSchema = z.object({
    id: z.string(),
    idempotencyKey: z.string(),
    businessEventLogId: z.string().nullable(),
    eventKey: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    actorUserId: z.string().nullable(),
    effect: z.string(),
    revokeEventKey: z.string().nullable(),
    targetAliasIds: z.unknown().nullable(),
    eventInstanceId: z.string().nullable(),
    payloadJson: z.unknown().nullable(),
    status: z.string(),
    attempts: z.number().int(),
    nextAttemptAt: z.date(),
    lockedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    lastError: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    businessEventLog: z.unknown().nullable()
}).strict();

export type ProjectionEventDeliveryPureType = z.infer<typeof ProjectionEventDeliveryModelSchema>;
