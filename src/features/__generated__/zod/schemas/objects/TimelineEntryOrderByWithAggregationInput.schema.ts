import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TimelineEntryCountOrderByAggregateInputObjectSchema as TimelineEntryCountOrderByAggregateInputObjectSchema } from './TimelineEntryCountOrderByAggregateInput.schema';
import { TimelineEntryMaxOrderByAggregateInputObjectSchema as TimelineEntryMaxOrderByAggregateInputObjectSchema } from './TimelineEntryMaxOrderByAggregateInput.schema';
import { TimelineEntryMinOrderByAggregateInputObjectSchema as TimelineEntryMinOrderByAggregateInputObjectSchema } from './TimelineEntryMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  containerType: SortOrderSchema.optional(),
  containerId: SortOrderSchema.optional(),
  sourceType: SortOrderSchema.optional(),
  sourceId: SortOrderSchema.optional(),
  occurredAt: SortOrderSchema.optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  bodySnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  visibility: SortOrderSchema.optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => TimelineEntryCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TimelineEntryMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TimelineEntryMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TimelineEntryOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TimelineEntryOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TimelineEntryOrderByWithAggregationInput>;
export const TimelineEntryOrderByWithAggregationInputObjectZodSchema = makeSchema();
