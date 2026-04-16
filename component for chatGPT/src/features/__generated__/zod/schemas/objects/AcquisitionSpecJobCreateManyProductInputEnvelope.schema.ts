import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobCreateManyProductInputObjectSchema as AcquisitionSpecJobCreateManyProductInputObjectSchema } from './AcquisitionSpecJobCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AcquisitionSpecJobCreateManyProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AcquisitionSpecJobCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateManyProductInputEnvelope>;
export const AcquisitionSpecJobCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
