import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetCreateManyProductInputObjectSchema as ProductPostTargetCreateManyProductInputObjectSchema } from './ProductPostTargetCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProductPostTargetCreateManyProductInputObjectSchema), z.lazy(() => ProductPostTargetCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProductPostTargetCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateManyProductInputEnvelope>;
export const ProductPostTargetCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
