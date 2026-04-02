import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsCreateManyTechnicalAssessmentsInputObjectSchema as approvalRequestsCreateManyTechnicalAssessmentsInputObjectSchema } from './approvalRequestsCreateManyTechnicalAssessmentsInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => approvalRequestsCreateManyTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsCreateManyTechnicalAssessmentsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const approvalRequestsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema: z.ZodType<Prisma.approvalRequestsCreateManyTechnicalAssessmentsInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsCreateManyTechnicalAssessmentsInputEnvelope>;
export const approvalRequestsCreateManyTechnicalAssessmentsInputEnvelopeObjectZodSchema = makeSchema();
