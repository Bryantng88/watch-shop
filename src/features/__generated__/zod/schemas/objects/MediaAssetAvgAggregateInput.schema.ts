import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sizeBytes: z.literal(true).optional()
}).strict();
export const MediaAssetAvgAggregateInputObjectSchema: z.ZodType<Prisma.MediaAssetAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetAvgAggregateInputType>;
export const MediaAssetAvgAggregateInputObjectZodSchema = makeSchema();
