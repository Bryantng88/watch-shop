import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  caseSizeMM: SortOrderSchema.optional(),
  lugToLugMM: SortOrderSchema.optional(),
  lugWidthMM: SortOrderSchema.optional(),
  thicknessMM: SortOrderSchema.optional(),
  goldKarat: SortOrderSchema.optional()
}).strict();
export const WatchSpecV2AvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchSpecV2AvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2AvgOrderByAggregateInput>;
export const WatchSpecV2AvgOrderByAggregateInputObjectZodSchema = makeSchema();
