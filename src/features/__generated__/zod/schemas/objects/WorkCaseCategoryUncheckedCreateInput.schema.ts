import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { WorkCaseUncheckedCreateNestedManyWithoutCategoryInputObjectSchema as WorkCaseUncheckedCreateNestedManyWithoutCategoryInputObjectSchema } from './WorkCaseUncheckedCreateNestedManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  scope: WorkCaseScopeSchema.optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  workCases: z.lazy(() => WorkCaseUncheckedCreateNestedManyWithoutCategoryInputObjectSchema)
}).strict();
export const WorkCaseCategoryUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryUncheckedCreateInput>;
export const WorkCaseCategoryUncheckedCreateInputObjectZodSchema = makeSchema();
