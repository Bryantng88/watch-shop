import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateManyTechnicalAssessmentInputObjectSchema as TechnicalIssueCreateManyTechnicalAssessmentInputObjectSchema } from './TechnicalIssueCreateManyTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TechnicalIssueCreateManyTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueCreateManyTechnicalAssessmentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TechnicalIssueCreateManyTechnicalAssessmentInputEnvelopeObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateManyTechnicalAssessmentInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManyTechnicalAssessmentInputEnvelope>;
export const TechnicalIssueCreateManyTechnicalAssessmentInputEnvelopeObjectZodSchema = makeSchema();
