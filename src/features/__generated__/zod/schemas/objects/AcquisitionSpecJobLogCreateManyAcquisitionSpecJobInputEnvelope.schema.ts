import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelope>;
export const AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelopeObjectZodSchema = makeSchema();
