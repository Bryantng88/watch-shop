import * as z from 'zod';

export const ProjectionEventDeliveryScalarFieldEnumSchema = z.enum(['id', 'idempotencyKey', 'businessEventLogId', 'eventKey', 'targetType', 'targetId', 'actorUserId', 'effect', 'revokeEventKey', 'targetAliasIds', 'eventInstanceId', 'payloadJson', 'status', 'attempts', 'nextAttemptAt', 'lockedAt', 'completedAt', 'lastError', 'createdAt', 'updatedAt'])

export type ProjectionEventDeliveryScalarFieldEnum = z.infer<typeof ProjectionEventDeliveryScalarFieldEnumSchema>;