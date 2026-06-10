import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCategoryCountOutputTypeSelectObjectSchema as WorkCaseCategoryCountOutputTypeSelectObjectSchema } from './WorkCaseCategoryCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkCaseCategoryCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const WorkCaseCategoryCountOutputTypeArgsObjectSchema = makeSchema();
export const WorkCaseCategoryCountOutputTypeArgsObjectZodSchema = makeSchema();
