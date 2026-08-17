import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  storageKey: z.string(),
  derivativeKey: z.string().optional().nullable(),
  originalFileName: z.string(),
  altText: z.string().optional().nullable(),
  mimeType: z.string(),
  sizeBytes: z.number().int(),
  width: z.number().int(),
  height: z.number().int(),
  focalX: z.number().int().optional(),
  focalY: z.number().int().optional(),
  overlayOpacity: z.number().int().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const StorefrontHeroImageCreateManyInputObjectSchema: z.ZodType<Prisma.StorefrontHeroImageCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.StorefrontHeroImageCreateManyInput>;
export const StorefrontHeroImageCreateManyInputObjectZodSchema = makeSchema();
