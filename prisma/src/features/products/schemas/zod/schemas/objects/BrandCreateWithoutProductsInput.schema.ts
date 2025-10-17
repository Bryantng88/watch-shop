import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandStatusSchema } from '../enums/BrandStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  country: z.string().optional().nullable(),
  foundedYear: z.number().int().optional().nullable(),
  website: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  isAuthorized: z.boolean().optional(),
  status: BrandStatusSchema.optional(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const BrandCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.BrandCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandCreateWithoutProductsInput>;
export const BrandCreateWithoutProductsInputObjectZodSchema = makeSchema();
