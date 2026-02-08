import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ServiceRequestCountOrderByAggregateInputObjectSchema as ServiceRequestCountOrderByAggregateInputObjectSchema } from './ServiceRequestCountOrderByAggregateInput.schema';
import { ServiceRequestMaxOrderByAggregateInputObjectSchema as ServiceRequestMaxOrderByAggregateInputObjectSchema } from './ServiceRequestMaxOrderByAggregateInput.schema';
import { ServiceRequestMinOrderByAggregateInputObjectSchema as ServiceRequestMinOrderByAggregateInputObjectSchema } from './ServiceRequestMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  billable: SortOrderSchema.optional(),
  orderItemId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  customerId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  variantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  brandSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  modelSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serialSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  appointmentAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  warrantyUntil: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  warrantyPolicy: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  servicecatalogid: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refNo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scope: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => ServiceRequestCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ServiceRequestMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ServiceRequestMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ServiceRequestOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ServiceRequestOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestOrderByWithAggregationInput>;
export const ServiceRequestOrderByWithAggregationInputObjectZodSchema = makeSchema();
