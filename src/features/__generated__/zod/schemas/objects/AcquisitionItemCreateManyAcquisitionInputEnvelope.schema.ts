import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateManyAcquisitionInputObjectSchema as AcquisitionItemCreateManyAcquisitionInputObjectSchema } from './AcquisitionItemCreateManyAcquisitionInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionItemCreateManyAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemCreateManyAcquisitionInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionItemCreateManyAcquisitionInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateManyAcquisitionInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateManyAcquisitionInputEnvelope>;
export const AcquisitionItemCreateManyAcquisitionInputEnvelopeObjectZodSchema = makeSchema();
