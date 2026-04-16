import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MechanicalPartCatalogCountOrderByAggregateInputObjectSchema as MechanicalPartCatalogCountOrderByAggregateInputObjectSchema } from './MechanicalPartCatalogCountOrderByAggregateInput.schema';
import { MechanicalPartCatalogAvgOrderByAggregateInputObjectSchema as MechanicalPartCatalogAvgOrderByAggregateInputObjectSchema } from './MechanicalPartCatalogAvgOrderByAggregateInput.schema';
import { MechanicalPartCatalogMaxOrderByAggregateInputObjectSchema as MechanicalPartCatalogMaxOrderByAggregateInputObjectSchema } from './MechanicalPartCatalogMaxOrderByAggregateInput.schema';
import { MechanicalPartCatalogMinOrderByAggregateInputObjectSchema as MechanicalPartCatalogMinOrderByAggregateInputObjectSchema } from './MechanicalPartCatalogMinOrderByAggregateInput.schema';
import { MechanicalPartCatalogSumOrderByAggregateInputObjectSchema as MechanicalPartCatalogSumOrderByAggregateInputObjectSchema } from './MechanicalPartCatalogSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  group: SortOrderSchema.optional(),
  defaultCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => MechanicalPartCatalogCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => MechanicalPartCatalogAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MechanicalPartCatalogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MechanicalPartCatalogMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => MechanicalPartCatalogSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const MechanicalPartCatalogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogOrderByWithAggregationInput>;
export const MechanicalPartCatalogOrderByWithAggregationInputObjectZodSchema = makeSchema();
