import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  fileKey: z.string(),
  role: ImageRoleSchema.optional(),
  alt: z.string().optional().nullable(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  mime: z.string().optional().nullable(),
  sizeBytes: z.number().int().optional().nullable(),
  sortOrder: z.number().int().optional(),
  dominantHex: z.string().optional().nullable(),
  contentHash: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ProductImageCreateManyProductInputObjectSchema: z.ZodType<Prisma.ProductImageCreateManyProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageCreateManyProductInput>;
export const ProductImageCreateManyProductInputObjectZodSchema = makeSchema();
