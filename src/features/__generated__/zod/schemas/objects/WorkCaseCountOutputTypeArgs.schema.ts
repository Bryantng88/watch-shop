import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCountOutputTypeSelectObjectSchema as WorkCaseCountOutputTypeSelectObjectSchema } from './WorkCaseCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkCaseCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const WorkCaseCountOutputTypeArgsObjectSchema = makeSchema();
export const WorkCaseCountOutputTypeArgsObjectZodSchema = makeSchema();
