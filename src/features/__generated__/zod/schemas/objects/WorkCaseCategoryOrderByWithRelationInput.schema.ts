import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkCaseOrderByRelationAggregateInputObjectSchema as WorkCaseOrderByRelationAggregateInputObjectSchema } from './WorkCaseOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scope: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  workCases: z.lazy(() => WorkCaseOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const WorkCaseCategoryOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryOrderByWithRelationInput>;
export const WorkCaseCategoryOrderByWithRelationInputObjectZodSchema = makeSchema();
