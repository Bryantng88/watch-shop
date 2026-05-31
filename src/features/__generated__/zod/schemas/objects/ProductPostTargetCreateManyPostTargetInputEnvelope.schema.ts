import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetCreateManyPostTargetInputObjectSchema as ProductPostTargetCreateManyPostTargetInputObjectSchema } from './ProductPostTargetCreateManyPostTargetInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProductPostTargetCreateManyPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetCreateManyPostTargetInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProductPostTargetCreateManyPostTargetInputEnvelopeObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateManyPostTargetInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateManyPostTargetInputEnvelope>;
export const ProductPostTargetCreateManyPostTargetInputEnvelopeObjectZodSchema = makeSchema();
