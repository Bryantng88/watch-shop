import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivitySelectObjectSchema as WorkCaseActivitySelectObjectSchema } from './WorkCaseActivitySelect.schema';
import { WorkCaseActivityIncludeObjectSchema as WorkCaseActivityIncludeObjectSchema } from './WorkCaseActivityInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkCaseActivitySelectObjectSchema).optional(),
  include: z.lazy(() => WorkCaseActivityIncludeObjectSchema).optional()
}).strict();
export const WorkCaseActivityArgsObjectSchema = makeSchema();
export const WorkCaseActivityArgsObjectZodSchema = makeSchema();
