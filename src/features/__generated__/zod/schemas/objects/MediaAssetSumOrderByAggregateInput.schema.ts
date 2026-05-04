import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sizeBytes: SortOrderSchema.optional()
}).strict();
export const MediaAssetSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaAssetSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetSumOrderByAggregateInput>;
export const MediaAssetSumOrderByAggregateInputObjectZodSchema = makeSchema();
