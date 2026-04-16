import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema';
import { ProductCreateNestedOneWithoutImageInputObjectSchema as ProductCreateNestedOneWithoutImageInputObjectSchema } from './ProductCreateNestedOneWithoutImageInput.schema'

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
  product: z.lazy(() => ProductCreateNestedOneWithoutImageInputObjectSchema)
}).strict();
export const ProductImageCreateInputObjectSchema: z.ZodType<Prisma.ProductImageCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageCreateInput>;
export const ProductImageCreateInputObjectZodSchema = makeSchema();
