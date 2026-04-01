import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  TechnicalIssue: z.boolean().optional()
}).strict();
export const TechnicalAssessmentCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TechnicalAssessmentCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentCountOutputTypeSelect>;
export const TechnicalAssessmentCountOutputTypeSelectObjectZodSchema = makeSchema();
