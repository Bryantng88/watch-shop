import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateManyVariantInputObjectSchema as AcquisitionItemCreateManyVariantInputObjectSchema } from './AcquisitionItemCreateManyVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionItemCreateManyVariantInputObjectSchema), z.lazy(() => AcquisitionItemCreateManyVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionItemCreateManyVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateManyVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateManyVariantInputEnvelope>;
export const AcquisitionItemCreateManyVariantInputEnvelopeObjectZodSchema = makeSchema();
