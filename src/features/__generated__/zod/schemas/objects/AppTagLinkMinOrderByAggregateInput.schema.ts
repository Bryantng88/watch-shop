import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  tagId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const AppTagLinkMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AppTagLinkMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkMinOrderByAggregateInput>;
export const AppTagLinkMinOrderByAggregateInputObjectZodSchema = makeSchema();
