import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  platform: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const PostTargetMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PostTargetMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetMaxOrderByAggregateInput>;
export const PostTargetMaxOrderByAggregateInputObjectZodSchema = makeSchema();
