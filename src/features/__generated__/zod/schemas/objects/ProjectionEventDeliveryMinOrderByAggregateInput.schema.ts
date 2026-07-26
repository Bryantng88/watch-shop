import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  idempotencyKey: SortOrderSchema.optional(),
  businessEventLogId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  effect: SortOrderSchema.optional(),
  revokeEventKey: SortOrderSchema.optional(),
  eventInstanceId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  attempts: SortOrderSchema.optional(),
  nextAttemptAt: SortOrderSchema.optional(),
  lockedAt: SortOrderSchema.optional(),
  completedAt: SortOrderSchema.optional(),
  lastError: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ProjectionEventDeliveryMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryMinOrderByAggregateInput>;
export const ProjectionEventDeliveryMinOrderByAggregateInputObjectZodSchema = makeSchema();
