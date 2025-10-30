import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionItemOrderByRelationAggregateInputObjectSchema as AcquisitionItemOrderByRelationAggregateInputObjectSchema } from './AcquisitionItemOrderByRelationAggregateInput.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './OrderOrderByWithRelationInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { ServiceRequestOrderByRelationAggregateInputObjectSchema as ServiceRequestOrderByRelationAggregateInputObjectSchema } from './ServiceRequestOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  variantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  listPriceAtOrder: SortOrderSchema.optional(),
  discountType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  discountValue: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  unitPriceAgreed: SortOrderSchema.optional(),
  taxRate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  quantity: SortOrderSchema.optional(),
  subtotal: SortOrderSchema.optional(),
  img: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemOrderByRelationAggregateInputObjectSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputObjectSchema).optional(),
  Product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const OrderItemOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.OrderItemOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemOrderByWithRelationInput>;
export const OrderItemOrderByWithRelationInputObjectZodSchema = makeSchema();
