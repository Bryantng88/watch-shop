import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sizeBytes: SortOrderSchema.optional()
}).strict();
export const MediaObjectSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaObjectSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectSumOrderByAggregateInput>;
export const MediaObjectSumOrderByAggregateInputObjectZodSchema = makeSchema();
