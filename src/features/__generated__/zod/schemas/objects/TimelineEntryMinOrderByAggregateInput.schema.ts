import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  containerType: SortOrderSchema.optional(),
  containerId: SortOrderSchema.optional(),
  sourceType: SortOrderSchema.optional(),
  sourceId: SortOrderSchema.optional(),
  occurredAt: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  bodySnapshot: SortOrderSchema.optional(),
  visibility: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TimelineEntryMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TimelineEntryMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TimelineEntryMinOrderByAggregateInput>;
export const TimelineEntryMinOrderByAggregateInputObjectZodSchema = makeSchema();
