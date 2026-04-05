import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TechnicalIssueCountOrderByAggregateInputObjectSchema as TechnicalIssueCountOrderByAggregateInputObjectSchema } from './TechnicalIssueCountOrderByAggregateInput.schema';
import { TechnicalIssueAvgOrderByAggregateInputObjectSchema as TechnicalIssueAvgOrderByAggregateInputObjectSchema } from './TechnicalIssueAvgOrderByAggregateInput.schema';
import { TechnicalIssueMaxOrderByAggregateInputObjectSchema as TechnicalIssueMaxOrderByAggregateInputObjectSchema } from './TechnicalIssueMaxOrderByAggregateInput.schema';
import { TechnicalIssueMinOrderByAggregateInputObjectSchema as TechnicalIssueMinOrderByAggregateInputObjectSchema } from './TechnicalIssueMinOrderByAggregateInput.schema';
import { TechnicalIssueSumOrderByAggregateInputObjectSchema as TechnicalIssueSumOrderByAggregateInputObjectSchema } from './TechnicalIssueSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  assessmentId: SortOrderSchema.optional(),
  area: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  issueType: SortOrderSchema.optional(),
  actionMode: SortOrderSchema.optional(),
  serviceCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  supplyCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  estimatedCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mechanicalPartCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: SortOrderSchema.optional(),
  executionStatus: SortOrderSchema.optional(),
  openedAt: SortOrderSchema.optional(),
  startedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  canceledAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  actualCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  technicianId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  summary: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  resolutionNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedByNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => TechnicalIssueCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TechnicalIssueAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TechnicalIssueMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TechnicalIssueMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TechnicalIssueSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TechnicalIssueOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TechnicalIssueOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueOrderByWithAggregationInput>;
export const TechnicalIssueOrderByWithAggregationInputObjectZodSchema = makeSchema();
