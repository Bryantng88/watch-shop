import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  storageKey: z.boolean().optional(),
  derivativeKey: z.boolean().optional(),
  originalFileName: z.boolean().optional(),
  altText: z.boolean().optional(),
  mimeType: z.boolean().optional(),
  sizeBytes: z.boolean().optional(),
  width: z.boolean().optional(),
  height: z.boolean().optional(),
  focalX: z.boolean().optional(),
  focalY: z.boolean().optional(),
  overlayOpacity: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const StorefrontHeroImageSelectObjectSchema: z.ZodType<Prisma.StorefrontHeroImageSelect> = makeSchema() as unknown as z.ZodType<Prisma.StorefrontHeroImageSelect>;
export const StorefrontHeroImageSelectObjectZodSchema = makeSchema();
