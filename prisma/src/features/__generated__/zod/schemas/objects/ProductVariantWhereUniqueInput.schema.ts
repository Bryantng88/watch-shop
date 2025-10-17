import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  sku: z.string().optional()
}).strict();
export const ProductVariantWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProductVariantWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantWhereUniqueInput>;
export const ProductVariantWhereUniqueInputObjectZodSchema = makeSchema();
