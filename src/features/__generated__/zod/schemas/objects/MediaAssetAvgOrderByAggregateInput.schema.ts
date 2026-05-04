import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sizeBytes: SortOrderSchema.optional()
}).strict();
export const MediaAssetAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaAssetAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetAvgOrderByAggregateInput>;
export const MediaAssetAvgOrderByAggregateInputObjectZodSchema = makeSchema();
