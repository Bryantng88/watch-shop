import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { BusinessEventLogOrderByWithRelationInputObjectSchema as BusinessEventLogOrderByWithRelationInputObjectSchema } from './BusinessEventLogOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  idempotencyKey: SortOrderSchema.optional(),
  businessEventLogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  effect: SortOrderSchema.optional(),
  revokeEventKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  targetAliasIds: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  eventInstanceId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  payloadJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  attempts: SortOrderSchema.optional(),
  nextAttemptAt: SortOrderSchema.optional(),
  lockedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lastError: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  businessEventLog: z.lazy(() => BusinessEventLogOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ProjectionEventDeliveryOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryOrderByWithRelationInput>;
export const ProjectionEventDeliveryOrderByWithRelationInputObjectZodSchema = makeSchema();
