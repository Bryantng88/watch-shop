import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  scope: WorkCaseScopeSchema.optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryCreateWithoutWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryCreateWithoutWorkCasesInput>;
export const WorkCaseCategoryCreateWithoutWorkCasesInputObjectZodSchema = makeSchema();
