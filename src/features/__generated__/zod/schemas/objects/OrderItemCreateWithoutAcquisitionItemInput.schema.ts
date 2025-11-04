import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateNestedOneWithoutItemsInputObjectSchema as OrderCreateNestedOneWithoutItemsInputObjectSchema } from './OrderCreateNestedOneWithoutItemsInput.schema';
import { ProductCreateNestedOneWithoutOrderItemsInputObjectSchema as ProductCreateNestedOneWithoutOrderItemsInputObjectSchema } from './ProductCreateNestedOneWithoutOrderItemsInput.schema';
import { ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema as ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  variantId: z.string().optional().nullable(),
  title: z.string(),
  listPriceAtOrder: z.number(),
  discountType: z.string().optional().nullable(),
  discountValue: z.number().optional().nullable(),
  unitPriceAgreed: z.number(),
  taxRate: z.number().optional().nullable(),
  quantity: z.number().int(),
  subtotal: z.number(),
  img: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutItemsInputObjectSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemsInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema).optional()
}).strict();
export const OrderItemCreateWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.OrderItemCreateWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateWithoutAcquisitionItemInput>;
export const OrderItemCreateWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
