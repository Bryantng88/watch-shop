import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const MediaBindingSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaBindingSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingSumOrderByAggregateInput>;
export const MediaBindingSumOrderByAggregateInputObjectZodSchema = makeSchema();
