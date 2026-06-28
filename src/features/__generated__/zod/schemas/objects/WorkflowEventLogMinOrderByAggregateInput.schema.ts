import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const WorkflowEventLogMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowEventLogMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowEventLogMinOrderByAggregateInput>;
export const WorkflowEventLogMinOrderByAggregateInputObjectZodSchema = makeSchema();
