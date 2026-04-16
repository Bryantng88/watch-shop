import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsSelectObjectSchema as technicalAssessmentsSelectObjectSchema } from './technicalAssessmentsSelect.schema';
import { technicalAssessmentsIncludeObjectSchema as technicalAssessmentsIncludeObjectSchema } from './technicalAssessmentsInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => technicalAssessmentsSelectObjectSchema).optional(),
  include: z.lazy(() => technicalAssessmentsIncludeObjectSchema).optional()
}).strict();
export const technicalAssessmentsArgsObjectSchema = makeSchema();
export const technicalAssessmentsArgsObjectZodSchema = makeSchema();
