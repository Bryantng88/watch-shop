import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  billable: SortOrderSchema.optional(),
  orderItemId: SortOrderSchema.optional(),
  customerId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  variantId: SortOrderSchema.optional(),
  brandSnapshot: SortOrderSchema.optional(),
  modelSnapshot: SortOrderSchema.optional(),
  refSnapshot: SortOrderSchema.optional(),
  serialSnapshot: SortOrderSchema.optional(),
  appointmentAt: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional(),
  warrantyUntil: SortOrderSchema.optional(),
  warrantyPolicy: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  servicecatalogid: SortOrderSchema.optional(),
  refNo: SortOrderSchema.optional()
}).strict();
export const ServiceRequestMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ServiceRequestMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestMinOrderByAggregateInput>;
export const ServiceRequestMinOrderByAggregateInputObjectZodSchema = makeSchema();
