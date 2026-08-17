import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  storageKey: SortOrderSchema.optional(),
  derivativeKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  originalFileName: SortOrderSchema.optional(),
  altText: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mimeType: SortOrderSchema.optional(),
  sizeBytes: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  focalX: SortOrderSchema.optional(),
  focalY: SortOrderSchema.optional(),
  overlayOpacity: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const StorefrontHeroImageOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.StorefrontHeroImageOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.StorefrontHeroImageOrderByWithRelationInput>;
export const StorefrontHeroImageOrderByWithRelationInputObjectZodSchema = makeSchema();
