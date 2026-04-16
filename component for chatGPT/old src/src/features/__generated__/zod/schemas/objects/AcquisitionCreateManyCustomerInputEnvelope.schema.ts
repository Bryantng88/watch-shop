import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateManyCustomerInputObjectSchema as AcquisitionCreateManyCustomerInputObjectSchema } from './AcquisitionCreateManyCustomerInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionCreateManyCustomerInputObjectSchema), z.lazy(() => AcquisitionCreateManyCustomerInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionCreateManyCustomerInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionCreateManyCustomerInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateManyCustomerInputEnvelope>;
export const AcquisitionCreateManyCustomerInputEnvelopeObjectZodSchema = makeSchema();
