import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateManyOrderItemInputObjectSchema as AcquisitionItemCreateManyOrderItemInputObjectSchema } from './AcquisitionItemCreateManyOrderItemInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionItemCreateManyOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemCreateManyOrderItemInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionItemCreateManyOrderItemInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateManyOrderItemInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateManyOrderItemInputEnvelope>;
export const AcquisitionItemCreateManyOrderItemInputEnvelopeObjectZodSchema = makeSchema();
