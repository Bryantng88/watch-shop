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
export const AppTagLinkMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AppTagLinkMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkMaxOrderByAggregateInput>;
export const AppTagLinkMaxOrderByAggregateInputObjectZodSchema = makeSchema();
