import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  metadataJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const WorkflowEventLogCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowEventLogCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowEventLogCountOrderByAggregateInput>;
export const WorkflowEventLogCountOrderByAggregateInputObjectZodSchema = makeSchema();
