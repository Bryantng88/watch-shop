import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  mediaObjectId: SortOrderSchema.optional(),
  ownerType: SortOrderSchema.optional(),
  ownerId: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  audienceSegment: SortOrderSchema.optional(),
  lifecycle: SortOrderSchema.optional(),
  pipelineKey: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const MediaBindingMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaBindingMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingMaxOrderByAggregateInput>;
export const MediaBindingMaxOrderByAggregateInputObjectZodSchema = makeSchema();
