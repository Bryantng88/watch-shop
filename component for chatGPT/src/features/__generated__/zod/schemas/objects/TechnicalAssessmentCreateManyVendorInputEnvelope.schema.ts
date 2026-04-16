import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentCreateManyVendorInputObjectSchema as TechnicalAssessmentCreateManyVendorInputObjectSchema } from './TechnicalAssessmentCreateManyVendorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TechnicalAssessmentCreateManyVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentCreateManyVendorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TechnicalAssessmentCreateManyVendorInputEnvelopeObjectSchema: z.ZodType<Prisma.TechnicalAssessmentCreateManyVendorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentCreateManyVendorInputEnvelope>;
export const TechnicalAssessmentCreateManyVendorInputEnvelopeObjectZodSchema = makeSchema();
