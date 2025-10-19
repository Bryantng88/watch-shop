import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateManyProductInputObjectSchema as AcquisitionItemCreateManyProductInputObjectSchema } from './AcquisitionItemCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionItemCreateManyProductInputObjectSchema), z.lazy(() => AcquisitionItemCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionItemCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateManyProductInputEnvelope>;
export const AcquisitionItemCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
