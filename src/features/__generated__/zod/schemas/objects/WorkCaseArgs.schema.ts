import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseSelectObjectSchema as WorkCaseSelectObjectSchema } from './WorkCaseSelect.schema';
import { WorkCaseIncludeObjectSchema as WorkCaseIncludeObjectSchema } from './WorkCaseInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkCaseSelectObjectSchema).optional(),
  include: z.lazy(() => WorkCaseIncludeObjectSchema).optional()
}).strict();
export const WorkCaseArgsObjectSchema = makeSchema();
export const WorkCaseArgsObjectZodSchema = makeSchema();
