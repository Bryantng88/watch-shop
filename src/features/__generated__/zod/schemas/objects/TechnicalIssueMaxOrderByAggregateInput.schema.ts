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
  vendorNameSnap: SortOrderSchema.optional(),
  mechanicalPartCatalogId: SortOrderSchema.optional()
}).strict();
export const TechnicalIssueMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalIssueMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueMaxOrderByAggregateInput>;
export const TechnicalIssueMaxOrderByAggregateInputObjectZodSchema = makeSchema();
