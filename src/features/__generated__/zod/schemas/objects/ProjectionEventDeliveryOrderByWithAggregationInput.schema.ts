import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProjectionEventDeliveryCountOrderByAggregateInputObjectSchema as ProjectionEventDeliveryCountOrderByAggregateInputObjectSchema } from './ProjectionEventDeliveryCountOrderByAggregateInput.schema';
import { ProjectionEventDeliveryAvgOrderByAggregateInputObjectSchema as ProjectionEventDeliveryAvgOrderByAggregateInputObjectSchema } from './ProjectionEventDeliveryAvgOrderByAggregateInput.schema';
import { ProjectionEventDeliveryMaxOrderByAggregateInputObjectSchema as ProjectionEventDeliveryMaxOrderByAggregateInputObjectSchema } from './ProjectionEventDeliveryMaxOrderByAggregateInput.schema';
import { ProjectionEventDeliveryMinOrderByAggregateInputObjectSchema as ProjectionEventDeliveryMinOrderByAggregateInputObjectSchema } from './ProjectionEventDeliveryMinOrderByAggregateInput.schema';
import { ProjectionEventDeliverySumOrderByAggregateInputObjectSchema as ProjectionEventDeliverySumOrderByAggregateInputObjectSchema } from './ProjectionEventDeliverySumOrderByAggregateInput.schema'

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
  _count: z.lazy(() => ProjectionEventDeliveryCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ProjectionEventDeliveryAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ProjectionEventDeliveryMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ProjectionEventDeliveryMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ProjectionEventDeliverySumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ProjectionEventDeliveryOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryOrderByWithAggregationInput>;
export const ProjectionEventDeliveryOrderByWithAggregationInputObjectZodSchema = makeSchema();
