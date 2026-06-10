import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workCaseId: SortOrderSchema.optional(),
  actorId: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const WorkCaseActivityMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityMaxOrderByAggregateInput>;
export const WorkCaseActivityMaxOrderByAggregateInputObjectZodSchema = makeSchema();
