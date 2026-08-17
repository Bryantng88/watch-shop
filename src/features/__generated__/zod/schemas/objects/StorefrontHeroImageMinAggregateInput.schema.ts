import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  storageKey: z.literal(true).optional(),
  derivativeKey: z.literal(true).optional(),
  originalFileName: z.literal(true).optional(),
  altText: z.literal(true).optional(),
  mimeType: z.literal(true).optional(),
  sizeBytes: z.literal(true).optional(),
  width: z.literal(true).optional(),
  height: z.literal(true).optional(),
  focalX: z.literal(true).optional(),
  focalY: z.literal(true).optional(),
  overlayOpacity: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const StorefrontHeroImageMinAggregateInputObjectSchema: z.ZodType<Prisma.StorefrontHeroImageMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StorefrontHeroImageMinAggregateInputType>;
export const StorefrontHeroImageMinAggregateInputObjectZodSchema = makeSchema();
