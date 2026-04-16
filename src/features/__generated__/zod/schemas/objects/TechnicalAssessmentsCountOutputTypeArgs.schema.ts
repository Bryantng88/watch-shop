import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentsCountOutputTypeSelectObjectSchema as TechnicalAssessmentsCountOutputTypeSelectObjectSchema } from './TechnicalAssessmentsCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TechnicalAssessmentsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TechnicalAssessmentsCountOutputTypeArgsObjectSchema = makeSchema();
export const TechnicalAssessmentsCountOutputTypeArgsObjectZodSchema = makeSchema();
