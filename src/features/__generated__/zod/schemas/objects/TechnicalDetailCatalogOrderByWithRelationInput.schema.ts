import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TechnicalIssueOrderByRelationAggregateInputObjectSchema as TechnicalIssueOrderByRelationAggregateInputObjectSchema } from './TechnicalIssueOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  area: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  technicalIssues: z.lazy(() => TechnicalIssueOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogOrderByWithRelationInput>;
export const TechnicalDetailCatalogOrderByWithRelationInputObjectZodSchema = makeSchema();
