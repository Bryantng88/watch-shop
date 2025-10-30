import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema as AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutSourceOrderItemInput.schema';
import { OrderCreateNestedOneWithoutItemsInputObjectSchema as OrderCreateNestedOneWithoutItemsInputObjectSchema } from './OrderCreateNestedOneWithoutItemsInput.schema';
import { ProductCreateNestedOneWithoutOrderItemsInputObjectSchema as ProductCreateNestedOneWithoutOrderItemsInputObjectSchema } from './ProductCreateNestedOneWithoutOrderItemsInput.schema'

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
  AcquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema).optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutItemsInputObjectSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemsInputObjectSchema).optional()
}).strict();
export const OrderItemCreateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.OrderItemCreateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateWithoutServiceRequestInput>;
export const OrderItemCreateWithoutServiceRequestInputObjectZodSchema = makeSchema();
