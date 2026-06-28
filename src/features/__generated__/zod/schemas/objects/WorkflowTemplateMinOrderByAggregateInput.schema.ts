import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  strategy: SortOrderSchema.optional(),
  ownerType: SortOrderSchema.optional(),
  ownerId: SortOrderSchema.optional(),
  isSystem: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WorkflowTemplateMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateMinOrderByAggregateInput>;
export const WorkflowTemplateMinOrderByAggregateInputObjectZodSchema = makeSchema();
