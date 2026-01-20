import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './OrderOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  shipPhone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipAddress: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipCity: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipDistrict: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipWard: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  carrier: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  trackingCode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shippingFee: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  shippedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  deliveredAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  refNo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  orderRefNo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  customerName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  Order: z.lazy(() => OrderOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ShipmentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ShipmentOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentOrderByWithRelationInput>;
export const ShipmentOrderByWithRelationInputObjectZodSchema = makeSchema();
