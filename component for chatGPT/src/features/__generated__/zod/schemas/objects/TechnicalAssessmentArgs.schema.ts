import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentSelectObjectSchema as TechnicalAssessmentSelectObjectSchema } from './TechnicalAssessmentSelect.schema';
import { TechnicalAssessmentIncludeObjectSchema as TechnicalAssessmentIncludeObjectSchema } from './TechnicalAssessmentInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TechnicalAssessmentSelectObjectSchema).optional(),
  include: z.lazy(() => TechnicalAssessmentIncludeObjectSchema).optional()
}).strict();
export const TechnicalAssessmentArgsObjectSchema = makeSchema();
export const TechnicalAssessmentArgsObjectZodSchema = makeSchema();
