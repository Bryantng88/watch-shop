import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseFindManySchema as WorkCaseFindManySchema } from '../findManyWorkCase.schema';
import { WorkCaseCategoryCountOutputTypeArgsObjectSchema as WorkCaseCategoryCountOutputTypeArgsObjectSchema } from './WorkCaseCategoryCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  scope: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  workCases: z.union([z.boolean(), z.lazy(() => WorkCaseFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WorkCaseCategoryCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WorkCaseCategorySelectObjectSchema: z.ZodType<Prisma.WorkCaseCategorySelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategorySelect>;
export const WorkCaseCategorySelectObjectZodSchema = makeSchema();
