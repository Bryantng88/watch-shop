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
export const AppTagLinkCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AppTagLinkCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkCountOrderByAggregateInput>;
export const AppTagLinkCountOrderByAggregateInputObjectZodSchema = makeSchema();
