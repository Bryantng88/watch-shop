import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  shipPhone: SortOrderSchema.optional(),
  shipAddress: SortOrderSchema.optional(),
  shipCity: SortOrderSchema.optional(),
  shipDistrict: SortOrderSchema.optional(),
  shipWard: SortOrderSchema.optional(),
  carrier: SortOrderSchema.optional(),
  trackingCode: SortOrderSchema.optional(),
  shippingFee: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  shippedAt: SortOrderSchema.optional(),
  deliveredAt: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const ShipmentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCountOrderByAggregateInput>;
export const ShipmentCountOrderByAggregateInputObjectZodSchema = makeSchema();
