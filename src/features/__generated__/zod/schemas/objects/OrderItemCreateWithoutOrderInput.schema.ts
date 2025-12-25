import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema as AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutSourceOrderItemInput.schema';
import { ProductCreateNestedOneWithoutOrderItemsInputObjectSchema as ProductCreateNestedOneWithoutOrderItemsInputObjectSchema } from './ProductCreateNestedOneWithoutOrderItemsInput.schema';
import { ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema as ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
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
  acquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemsInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema).optional()
}).strict();
export const OrderItemCreateWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderItemCreateWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateWithoutOrderInput>;
export const OrderItemCreateWithoutOrderInputObjectZodSchema = makeSchema();
