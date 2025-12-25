import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  variantId: z.string().optional().nullable(),
  title: z.string(),
  listPrice: z.number(),
  discountType: discount_typeSchema.optional().nullable(),
  discountValue: z.number().optional().nullable(),
  unitPriceAgreed: z.number(),
  taxRate: z.number().optional().nullable(),
  quantity: z.number().int(),
  subtotal: z.number(),
  img: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  acquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema).optional()
}).strict();
export const OrderItemUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUncheckedCreateWithoutProductInput>;
export const OrderItemUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();
