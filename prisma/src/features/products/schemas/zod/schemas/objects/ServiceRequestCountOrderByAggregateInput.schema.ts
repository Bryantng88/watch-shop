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
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ServiceRequestCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ServiceRequestCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCountOrderByAggregateInput>;
export const ServiceRequestCountOrderByAggregateInputObjectZodSchema = makeSchema();
