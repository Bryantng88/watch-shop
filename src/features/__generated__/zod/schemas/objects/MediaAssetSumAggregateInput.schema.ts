import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sizeBytes: z.literal(true).optional()
}).strict();
export const MediaAssetSumAggregateInputObjectSchema: z.ZodType<Prisma.MediaAssetSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetSumAggregateInputType>;
export const MediaAssetSumAggregateInputObjectZodSchema = makeSchema();
