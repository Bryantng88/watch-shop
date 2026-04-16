import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentCountOutputTypeSelectObjectSchema as TechnicalAssessmentCountOutputTypeSelectObjectSchema } from './TechnicalAssessmentCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TechnicalAssessmentCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TechnicalAssessmentCountOutputTypeArgsObjectSchema = makeSchema();
export const TechnicalAssessmentCountOutputTypeArgsObjectZodSchema = makeSchema();
