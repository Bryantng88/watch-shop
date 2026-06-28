import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  slug: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  scope: SortOrderSchema.optional(),
  ownerType: SortOrderSchema.optional(),
  ownerId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  workflowTemplateId: SortOrderSchema.optional()
}).strict();
export const AppTagCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AppTagCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCountOrderByAggregateInput>;
export const AppTagCountOrderByAggregateInputObjectZodSchema = makeSchema();
