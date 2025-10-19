import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateManyProductInputObjectSchema as ProductVariantCreateManyProductInputObjectSchema } from './ProductVariantCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProductVariantCreateManyProductInputObjectSchema), z.lazy(() => ProductVariantCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProductVariantCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.ProductVariantCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateManyProductInputEnvelope>;
export const ProductVariantCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
