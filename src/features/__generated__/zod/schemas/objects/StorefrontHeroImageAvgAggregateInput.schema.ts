import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sizeBytes: z.literal(true).optional(),
  width: z.literal(true).optional(),
  height: z.literal(true).optional(),
  focalX: z.literal(true).optional(),
  focalY: z.literal(true).optional(),
  overlayOpacity: z.literal(true).optional()
}).strict();
export const StorefrontHeroImageAvgAggregateInputObjectSchema: z.ZodType<Prisma.StorefrontHeroImageAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StorefrontHeroImageAvgAggregateInputType>;
export const StorefrontHeroImageAvgAggregateInputObjectZodSchema = makeSchema();
