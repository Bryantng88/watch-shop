import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseFindManySchema as WorkCaseFindManySchema } from '../findManyWorkCase.schema';
import { WorkCaseCategoryCountOutputTypeArgsObjectSchema as WorkCaseCategoryCountOutputTypeArgsObjectSchema } from './WorkCaseCategoryCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  workCases: z.union([z.boolean(), z.lazy(() => WorkCaseFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WorkCaseCategoryCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WorkCaseCategoryIncludeObjectSchema: z.ZodType<Prisma.WorkCaseCategoryInclude> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryInclude>;
export const WorkCaseCategoryIncludeObjectZodSchema = makeSchema();
