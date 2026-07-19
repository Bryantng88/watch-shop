import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  projectionKey: SortOrderSchema.optional(),
  projectionVersion: SortOrderSchema.optional(),
  rowKey: SortOrderSchema.optional(),
  workspaceId: SortOrderSchema.optional(),
  spaceId: SortOrderSchema.optional(),
  entityType: SortOrderSchema.optional(),
  entityId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  searchText: SortOrderSchema.optional(),
  sortAt: SortOrderSchema.optional(),
  sourceUpdatedAt: SortOrderSchema.optional(),
  projectedAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ProjectionRecordMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionRecordMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordMinOrderByAggregateInput>;
export const ProjectionRecordMinOrderByAggregateInputObjectZodSchema = makeSchema();
