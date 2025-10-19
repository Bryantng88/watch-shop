import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateManySourceOrderItemInputObjectSchema as AcquisitionItemCreateManySourceOrderItemInputObjectSchema } from './AcquisitionItemCreateManySourceOrderItemInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionItemCreateManySourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemCreateManySourceOrderItemInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionItemCreateManySourceOrderItemInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateManySourceOrderItemInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateManySourceOrderItemInputEnvelope>;
export const AcquisitionItemCreateManySourceOrderItemInputEnvelopeObjectZodSchema = makeSchema();
