import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workCaseId: SortOrderSchema.optional(),
  actorId: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const WorkCaseActivityCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityCountOrderByAggregateInput>;
export const WorkCaseActivityCountOrderByAggregateInputObjectZodSchema = makeSchema();
