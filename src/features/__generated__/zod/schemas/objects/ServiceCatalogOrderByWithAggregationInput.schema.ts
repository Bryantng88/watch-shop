import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ServiceCatalogCountOrderByAggregateInputObjectSchema as ServiceCatalogCountOrderByAggregateInputObjectSchema } from './ServiceCatalogCountOrderByAggregateInput.schema';
import { ServiceCatalogAvgOrderByAggregateInputObjectSchema as ServiceCatalogAvgOrderByAggregateInputObjectSchema } from './ServiceCatalogAvgOrderByAggregateInput.schema';
import { ServiceCatalogMaxOrderByAggregateInputObjectSchema as ServiceCatalogMaxOrderByAggregateInputObjectSchema } from './ServiceCatalogMaxOrderByAggregateInput.schema';
import { ServiceCatalogMinOrderByAggregateInputObjectSchema as ServiceCatalogMinOrderByAggregateInputObjectSchema } from './ServiceCatalogMinOrderByAggregateInput.schema';
import { ServiceCatalogSumOrderByAggregateInputObjectSchema as ServiceCatalogSumOrderByAggregateInputObjectSchema } from './ServiceCatalogSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  defaultPrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  durationMin: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  maintenanceRecordId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  detail: SortOrderSchema.optional(),
  _count: z.lazy(() => ServiceCatalogCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ServiceCatalogAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ServiceCatalogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ServiceCatalogMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ServiceCatalogSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ServiceCatalogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ServiceCatalogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogOrderByWithAggregationInput>;
export const ServiceCatalogOrderByWithAggregationInputObjectZodSchema = makeSchema();
