import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateManyProductVariantInputObjectSchema as AcquisitionItemCreateManyProductVariantInputObjectSchema } from './AcquisitionItemCreateManyProductVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionItemCreateManyProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemCreateManyProductVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionItemCreateManyProductVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateManyProductVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateManyProductVariantInputEnvelope>;
export const AcquisitionItemCreateManyProductVariantInputEnvelopeObjectZodSchema = makeSchema();
