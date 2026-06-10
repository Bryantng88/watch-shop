import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCategorySelectObjectSchema as WorkCaseCategorySelectObjectSchema } from './WorkCaseCategorySelect.schema';
import { WorkCaseCategoryIncludeObjectSchema as WorkCaseCategoryIncludeObjectSchema } from './WorkCaseCategoryInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkCaseCategorySelectObjectSchema).optional(),
  include: z.lazy(() => WorkCaseCategoryIncludeObjectSchema).optional()
}).strict();
export const WorkCaseCategoryArgsObjectSchema = makeSchema();
export const WorkCaseCategoryArgsObjectZodSchema = makeSchema();
