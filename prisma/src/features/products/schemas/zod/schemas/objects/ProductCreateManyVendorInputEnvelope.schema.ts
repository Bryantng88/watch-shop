import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateManyVendorInputObjectSchema as ProductCreateManyVendorInputObjectSchema } from './ProductCreateManyVendorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProductCreateManyVendorInputObjectSchema), z.lazy(() => ProductCreateManyVendorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProductCreateManyVendorInputEnvelopeObjectSchema: z.ZodType<Prisma.ProductCreateManyVendorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateManyVendorInputEnvelope>;
export const ProductCreateManyVendorInputEnvelopeObjectZodSchema = makeSchema();
