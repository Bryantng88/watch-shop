import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductImageCreateManyProductInputObjectSchema as ProductImageCreateManyProductInputObjectSchema } from './ProductImageCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProductImageCreateManyProductInputObjectSchema), z.lazy(() => ProductImageCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProductImageCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.ProductImageCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageCreateManyProductInputEnvelope>;
export const ProductImageCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
