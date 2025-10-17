import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateManyVendorInputObjectSchema as AcquisitionCreateManyVendorInputObjectSchema } from './AcquisitionCreateManyVendorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionCreateManyVendorInputObjectSchema), z.lazy(() => AcquisitionCreateManyVendorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionCreateManyVendorInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionCreateManyVendorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateManyVendorInputEnvelope>;
export const AcquisitionCreateManyVendorInputEnvelopeObjectZodSchema = makeSchema();
