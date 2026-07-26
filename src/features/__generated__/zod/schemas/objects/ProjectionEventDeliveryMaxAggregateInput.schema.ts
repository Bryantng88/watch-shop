import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  idempotencyKey: z.literal(true).optional(),
  businessEventLogId: z.literal(true).optional(),
  eventKey: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  targetId: z.literal(true).optional(),
  actorUserId: z.literal(true).optional(),
  effect: z.literal(true).optional(),
  revokeEventKey: z.literal(true).optional(),
  eventInstanceId: z.literal(true).optional(),
  status: z.literal(true).optional(),
  attempts: z.literal(true).optional(),
  nextAttemptAt: z.literal(true).optional(),
  lockedAt: z.literal(true).optional(),
  completedAt: z.literal(true).optional(),
  lastError: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ProjectionEventDeliveryMaxAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryMaxAggregateInputType>;
export const ProjectionEventDeliveryMaxAggregateInputObjectZodSchema = makeSchema();
