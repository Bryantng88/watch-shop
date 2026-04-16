import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateManyProductCategoryInputObjectSchema as ProductCreateManyProductCategoryInputObjectSchema } from './ProductCreateManyProductCategoryInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProductCreateManyProductCategoryInputObjectSchema), z.lazy(() => ProductCreateManyProductCategoryInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProductCreateManyProductCategoryInputEnvelopeObjectSchema: z.ZodType<Prisma.ProductCreateManyProductCategoryInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateManyProductCategoryInputEnvelope>;
export const ProductCreateManyProductCategoryInputEnvelopeObjectZodSchema = makeSchema();
