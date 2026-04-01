import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TechnicalIssueOrderByRelationAggregateInputObjectSchema as TechnicalIssueOrderByRelationAggregateInputObjectSchema } from './TechnicalIssueOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  unit: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  defaultCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const SupplyCatalogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.SupplyCatalogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogOrderByWithRelationInput>;
export const SupplyCatalogOrderByWithRelationInputObjectZodSchema = makeSchema();
