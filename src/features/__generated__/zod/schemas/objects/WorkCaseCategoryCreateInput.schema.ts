import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { WorkCaseCreateNestedManyWithoutCategoryInputObjectSchema as WorkCaseCreateNestedManyWithoutCategoryInputObjectSchema } from './WorkCaseCreateNestedManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  scope: WorkCaseScopeSchema.optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  workCases: z.lazy(() => WorkCaseCreateNestedManyWithoutCategoryInputObjectSchema)
}).strict();
export const WorkCaseCategoryCreateInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryCreateInput>;
export const WorkCaseCategoryCreateInputObjectZodSchema = makeSchema();
