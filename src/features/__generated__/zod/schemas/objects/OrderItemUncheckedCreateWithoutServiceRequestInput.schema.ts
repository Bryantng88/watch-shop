import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  productId: z.string().optional().nullable(),
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
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectSchema).optional()
}).strict();
export const OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUncheckedCreateWithoutServiceRequestInput>;
export const OrderItemUncheckedCreateWithoutServiceRequestInputObjectZodSchema = makeSchema();
