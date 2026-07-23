import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sizeBytes: SortOrderSchema.optional()
}).strict();
export const MediaObjectAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaObjectAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectAvgOrderByAggregateInput>;
export const MediaObjectAvgOrderByAggregateInputObjectZodSchema = makeSchema();
