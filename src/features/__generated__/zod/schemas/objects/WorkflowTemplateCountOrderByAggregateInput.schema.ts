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
export const WorkflowTemplateCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCountOrderByAggregateInput>;
export const WorkflowTemplateCountOrderByAggregateInputObjectZodSchema = makeSchema();
