import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogArgsObjectSchema as BusinessEventLogArgsObjectSchema } from './BusinessEventLogArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  idempotencyKey: z.boolean().optional(),
  businessEventLogId: z.boolean().optional(),
  eventKey: z.boolean().optional(),
  targetType: z.boolean().optional(),
  targetId: z.boolean().optional(),
  actorUserId: z.boolean().optional(),
  effect: z.boolean().optional(),
  revokeEventKey: z.boolean().optional(),
  targetAliasIds: z.boolean().optional(),
  eventInstanceId: z.boolean().optional(),
  payloadJson: z.boolean().optional(),
  status: z.boolean().optional(),
  attempts: z.boolean().optional(),
  nextAttemptAt: z.boolean().optional(),
  lockedAt: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  lastError: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  businessEventLog: z.union([z.boolean(), z.lazy(() => BusinessEventLogArgsObjectSchema)]).optional()
}).strict();
export const ProjectionEventDeliverySelectObjectSchema: z.ZodType<Prisma.ProjectionEventDeliverySelect> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliverySelect>;
export const ProjectionEventDeliverySelectObjectZodSchema = makeSchema();
