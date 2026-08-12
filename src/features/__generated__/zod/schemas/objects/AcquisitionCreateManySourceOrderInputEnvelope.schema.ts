import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateManySourceOrderInputObjectSchema as AcquisitionCreateManySourceOrderInputObjectSchema } from './AcquisitionCreateManySourceOrderInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionCreateManySourceOrderInputObjectSchema), z.lazy(() => AcquisitionCreateManySourceOrderInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionCreateManySourceOrderInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionCreateManySourceOrderInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateManySourceOrderInputEnvelope>;
export const AcquisitionCreateManySourceOrderInputEnvelopeObjectZodSchema = makeSchema();
