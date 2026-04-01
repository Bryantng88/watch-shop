import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  assessmentId: SortOrderSchema.optional(),
  area: SortOrderSchema.optional(),
  issueType: SortOrderSchema.optional(),
  actionMode: SortOrderSchema.optional(),
  serviceCatalogId: SortOrderSchema.optional(),
  supplyCatalogId: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  estimatedCost: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  vendorId: SortOrderSchema.optional(),
  vendorNameSnap: SortOrderSchema.optional()
}).strict();
export const TechnicalIssueMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalIssueMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueMinOrderByAggregateInput>;
export const TechnicalIssueMinOrderByAggregateInputObjectZodSchema = makeSchema();
